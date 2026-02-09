# Kafka 交易一致性設計的靈魂之一 - Inbox Pattern

> 💡 **核心理念**：每個事件先「蓋章報到」再處理，確保同一事件永遠只會影響系統一次（Exactly-Once Effect）

**類比理解**：就像銀行櫃檯作業流程：
- 📄 客戶單據先登記流水號
- ✅ 已處理過的單據不能再扣款一次
- 🔍 所有處理記錄可追溯審計

---

## 目錄

- [Kafka 交易一致性設計的靈魂之一 - Inbox Pattern](#kafka-交易一致性設計的靈魂之一---inbox-pattern)
  - [目錄](#目錄)
  - [一、為什麼 Kafka 一定需要 Inbox Pattern？](#一為什麼-kafka-一定需要-inbox-pattern)
    - [1.1 Kafka 的重送特性](#11-kafka-的重送特性)
    - [1.2 沒有 Inbox 的風險](#12-沒有-inbox-的風險)
  - [二、實際場景案例：銀行扣帳流程](#二實際場景案例銀行扣帳流程)
    - [2.1 事件結構](#21-事件結構)
    - [2.2 無 Inbox Pattern 的災難場景](#22-無-inbox-pattern-的災難場景)
      - [處理流程（❌ 錯誤做法）](#處理流程-錯誤做法)
      - [災難場景](#災難場景)
    - [2.3 有 Inbox Pattern 的安全場景](#23-有-inbox-pattern-的安全場景)
      - [處理流程（✅ 正確做法）](#處理流程-正確做法)
      - [安全場景](#安全場景)
  - [三、Inbox 表結構設計](#三inbox-表結構設計)
    - [3.1 標準 Inbox 表](#31-標準-inbox-表)
    - [3.2 進階 Inbox 表（含狀態機）](#32-進階-inbox-表含狀態機)
      - [狀態說明](#狀態說明)
  - [四、正確實施流程](#四正確實施流程)
    - [4.1 Step 1: 先寫 Inbox（報到）](#41-step-1-先寫-inbox報到)
    - [4.2 Step 2: 執行業務邏輯](#42-step-2-執行業務邏輯)
    - [4.3 Step 3: 標記處理完成](#43-step-3-標記處理完成)
    - [4.4 重送事件的自動處理](#44-重送事件的自動處理)
  - [五、Java 實作範例](#五java-實作範例)
    - [5.1 基礎版本（簡單防重）](#51-基礎版本簡單防重)
    - [5.2 生產級版本（含狀態機）](#52-生產級版本含狀態機)
  - [六、Retry + DLQ 與 Inbox 的配合](#六retry--dlq-與-inbox-的配合)
    - [6.1 重試策略](#61-重試策略)
      - [重試場景決策樹](#重試場景決策樹)
    - [6.2 DLQ 處理](#62-dlq-處理)
  - [七、監控與可觀測性](#七監控與可觀測性)
    - [7.1 關鍵指標](#71-關鍵指標)
      - [Prometheus Metrics 範例](#prometheus-metrics-範例)
      - [Grafana Dashboard 告警規則](#grafana-dashboard-告警規則)
    - [7.2 查帳與追蹤](#72-查帳與追蹤)
      - [完整交易事件歷史查詢](#完整交易事件歷史查詢)
      - [重複事件分析](#重複事件分析)
      - [對帳查詢](#對帳查詢)
  - [八、Inbox + Outbox 組合威力](#八inbox--outbox-組合威力)
    - [完整一致性保證](#完整一致性保證)
    - [組合架構圖](#組合架構圖)
    - [為什麼這是「Kafka 版 XA Transaction」？](#為什麼這是kafka-版-xa-transaction)
  - [九、常見問題與最佳實踐](#九常見問題與最佳實踐)
    - [9.1 FAQ](#91-faq)
    - [9.2 Best Practices](#92-best-practices)
      - [✅ 必須做（Must Have）](#-必須做must-have)
      - [✅ 強烈建議（Should Have）](#-強烈建議should-have)
      - [⭕ 可選（Nice to Have）](#-可選nice-to-have)
  - [十、總結](#十總結)
    - [核心價值](#核心價值)
    - [關鍵要點（記住這五點）](#關鍵要點記住這五點)
    - [實施檢查清單](#實施檢查清單)
    - [一句話總結](#一句話總結)
  - [延伸閱讀](#延伸閱讀)

---

## 一、為什麼 Kafka 一定需要 Inbox Pattern？

### 1.1 Kafka 的重送特性

Kafka 的消費語意是 **at-least-once**，這意味著：

- ✔ 訊息可能重送（network retry、consumer crash、rebalance）
- ✔ Consumer 可能在處理中途 crash
- ✔ Offset 可能還沒 commit 就斷線
- ✔ 手動 replay 事件時會重複消費

> ⚠️ **關鍵理解**：Kafka 保證訊息「至少送達一次」，不保證「僅送達一次」。應用層必須自行實現冪等性。

### 1.2 沒有 Inbox 的風險

如果沒有 Inbox Pattern 進行防重處理，會導致：

| 風險類型         | 具體影響                     | 嚴重程度 |
| ---------------- | ---------------------------- | -------- |
| **重複扣款**     | 客戶帳戶被多次扣款           | 🔴 P0    |
| **額度重複釋放** | 授信額度計算錯誤             | 🔴 P0    |
| **狀態錯亂**     | 交易狀態機跳到不合法的狀態   | 🔴 P0    |
| **財務不一致**   | 帳務與交易系統金額不符       | 🔴 P0    |
| **審計軌跡污染** | 無法分辨重複事件與正常事件   | 🟡 P1    |

> 💥 **真實案例**：某銀行在 Kafka 遷移初期因未實施 Inbox，導致客戶被重複扣款，造成 P1 生產事故，需人工補正數千筆交易。

---

## 二、實際場景案例：銀行扣帳流程

### 2.1 事件結構

假設有以下業務流程：

```text
EARMARK_REQUESTED → EARMARK_OK → DDA_DEBIT_REQUESTED → DDA_OK → COMPLETED
```

Kafka 事件範例：

```json
{
  "eventId": "EVT-1001",
  "correlationId": "CORR-TX123",
  "mainRef": "TX123",
  "version": 1,
  "eventType": "EARMARK_OK",
  "businessData": {
    "amount": 100000,
    "currency": "USD",
    "accountNo": "1234567890"
  },
  "timestamp": "2026-02-09T10:30:00Z"
}
```

**事件語意**：額度凍結（EARMARK）已完成，可以開始扣帳（DDA_DEBIT）。

### 2.2 無 Inbox Pattern 的災難場景

#### 處理流程（❌ 錯誤做法）

```java
@KafkaListener(topics = "earmark-events")
public void handleEarmarkEvent(EarmarkEvent event) {
    // 直接執行業務邏輯
    ddaService.debit(event.getAccountNo(), event.getAmount());

    // 更新交易狀態
    transactionRepo.updateStatus(event.getMainRef(), "DDA_PROCESSING");

    // Commit offset
    ack.acknowledge();
}
```

#### 災難場景

```text
時間 T1: Consumer 收到 EVT-1001
        → 執行 ddaService.debit(100000) ✅
        → 準備 updateStatus...

時間 T2: Consumer CRASH! 💥（網路斷線、JVM OOM、容器重啟）
        → offset 未 commit

時間 T3: Consumer 重啟
        → Kafka 從上次 committed offset 重新消費
        → 再次收到 EVT-1001

時間 T4: Consumer 又執行一次
        → 再次 ddaService.debit(100000) 💥

結果: 客戶被扣款兩次 200,000 USD！
```

### 2.3 有 Inbox Pattern 的安全場景

#### 處理流程（✅ 正確做法）

```java
@KafkaListener(topics = "earmark-events")
@Transactional
public void handleEarmarkEvent(EarmarkEvent event) {
    // Step 1: 先寫 Inbox（報到）
    try {
        inboxRepo.insert(event.getEventId(), event.getMainRef(),
                        event.getEventType(), "RECEIVED");
    } catch (DuplicateKeyException e) {
        // 重複事件，直接跳過
        log.info("Duplicate event {}, skipping", event.getEventId());
        ack.acknowledge();
        return;
    }

    // Step 2: 執行業務邏輯
    ddaService.debit(event.getAccountNo(), event.getAmount());
    transactionRepo.updateStatus(event.getMainRef(), "DDA_PROCESSING");

    // Step 3: 標記處理完成
    inboxRepo.updateStatus(event.getEventId(), "PROCESSED");

    // Step 4: Commit offset
    ack.acknowledge();
}
```

#### 安全場景

```text
時間 T1: Consumer 收到 EVT-1001
        → INSERT inbox_event(EVT-1001) ✅
        → 執行 ddaService.debit(100000) ✅

時間 T2: Consumer CRASH! 💥
        → inbox 已寫入，業務已執行
        → 但 offset 未 commit

時間 T3: Consumer 重啟
        → 再次收到 EVT-1001

時間 T4: 嘗試 INSERT inbox_event(EVT-1001)
        → DuplicateKeyException ❌（PK 已存在）
        → 直接跳過，不執行業務邏輯
        → 直接 acknowledge()

結果: 客戶只被扣款一次 100,000 USD ✅
      系統狀態一致 ✅
```

---

## 三、Inbox 表結構設計

### 3.1 標準 Inbox 表

**基礎版本**（適合簡單場景）：

```sql
CREATE TABLE inbox_event (
    event_id VARCHAR(50) PRIMARY KEY,          -- 事件唯一 ID（防重關鍵）
    aggregate_id VARCHAR(50) NOT NULL,         -- 業務主鍵（mainRef）
    event_type VARCHAR(50) NOT NULL,           -- 事件類型
    received_at TIMESTAMP DEFAULT NOW(),       -- 接收時間
    processed_at TIMESTAMP NULL,               -- 處理完成時間
    status VARCHAR(20) NOT NULL,               -- 狀態（RECEIVED, PROCESSED）

    INDEX idx_aggregate (aggregate_id, event_type),
    INDEX idx_status_received (status, received_at)
);
```

### 3.2 進階 Inbox 表（含狀態機）

**生產級版本**（金融系統推薦）：

```sql
CREATE TABLE inbox_event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id VARCHAR(50) UNIQUE NOT NULL,      -- 事件唯一 ID
    correlation_id VARCHAR(50),                -- 關聯 ID（用於追蹤完整 Saga）
    aggregate_id VARCHAR(50) NOT NULL,         -- 業務主鍵（mainRef）
    aggregate_version INT,                     -- 版本號
    event_type VARCHAR(50) NOT NULL,           -- 事件類型
    payload JSON NOT NULL,                     -- 原始事件內容（用於重放/審計）

    status VARCHAR(20) NOT NULL,               -- 狀態
    received_at TIMESTAMP DEFAULT NOW(),       -- 接收時間
    processing_started_at TIMESTAMP NULL,      -- 開始處理時間
    processed_at TIMESTAMP NULL,               -- 處理完成時間

    retry_count INT DEFAULT 0,                 -- 重試次數
    last_error TEXT NULL,                      -- 最後錯誤訊息

    created_by VARCHAR(50),                    -- 處理服務
    hostname VARCHAR(100),                     -- 處理主機

    INDEX idx_event_id (event_id),
    INDEX idx_aggregate (aggregate_id, event_type),
    INDEX idx_status_received (status, received_at),
    INDEX idx_correlation (correlation_id),
    INDEX idx_retry (status, retry_count, received_at)
);
```

#### 狀態說明

| 狀態         | 說明                           | 下一步                     |
| ------------ | ------------------------------ | -------------------------- |
| `RECEIVED`   | 已接收，待處理                 | → PROCESSING               |
| `PROCESSING` | 處理中                         | → PROCESSED / FAILED       |
| `PROCESSED`  | 處理成功                       | （終態）                   |
| `FAILED`     | 處理失敗（達到重試上限）       | → DLQ 或人工介入           |
| `SKIPPED`    | 跳過（重複事件或業務規則跳過） | （終態）                   |

---

## 四、正確實施流程

### 4.1 Step 1: 先寫 Inbox（報到）

**目的**：原子性地檢查並記錄事件到達

```sql
-- 嘗試插入 Inbox 記錄
INSERT INTO inbox_event (
    event_id,
    aggregate_id,
    event_type,
    payload,
    status
)
VALUES (
    'EVT-1001',
    'TX123',
    'EARMARK_OK',
    '{"amount": 100000, ...}',
    'RECEIVED'
);
```

**結果判斷**：

- ✅ **插入成功**：表示第一次看到此事件，繼續處理
- ❌ **插入失敗（PK violation）**：表示已處理過，直接跳過

> 💡 **關鍵設計**：使用 `event_id` 作為 PRIMARY KEY 或 UNIQUE KEY，利用資料庫的 ACID 特性實現原子性檢查。

### 4.2 Step 2: 執行業務邏輯

```java
// 業務邏輯處理
ddaService.debit(accountNo, amount);
transactionRepo.updateStatus(mainRef, "DDA_PROCESSING");
outboxRepo.insertEvent(nextEvent);  // 發送下一個事件
```

> ⚠️ **重要**：Step 1 和 Step 2 必須在同一個 **資料庫事務** 中，確保原子性。

### 4.3 Step 3: 標記處理完成

```sql
UPDATE inbox_event
SET status = 'PROCESSED',
    processed_at = NOW()
WHERE event_id = 'EVT-1001';
```

> 💡 **最佳實踐**：在 Step 2 和 Step 3 完成後再 commit Kafka offset，確保 at-least-once 語意下的安全性。

### 4.4 重送事件的自動處理

當 Kafka 重送同一事件時：

```text
1. Consumer 再次收到 EVT-1001
2. 嘗試 INSERT inbox_event(EVT-1001)
3. 資料庫返回 DuplicateKeyException
4. Catch 異常，記錄日誌，直接 acknowledge
5. 不執行任何業務邏輯
```

**效果**：
- ✅ 不會重複扣款
- ✅ 不會重複更新狀態
- ✅ 系統保持一致性
- ✅ Kafka offset 正常推進

---

## 五、Java 實作範例

### 5.1 基礎版本（簡單防重）

```java
@Service
public class EarmarkEventConsumer {

    @Autowired
    private InboxRepository inboxRepo;

    @Autowired
    private DdaService ddaService;

    @Autowired
    private TransactionRepository txRepo;

    @KafkaListener(topics = "earmark-events",
                   groupId = "earmark-consumer-group")
    @Transactional
    public void handleEarmarkEvent(
            ConsumerRecord<String, EarmarkEvent> record,
            Acknowledgment ack) {

        EarmarkEvent event = record.value();

        // Step 1: 嘗試寫入 Inbox（防重檢查）
        boolean isFirstTime = tryInsertInbox(event);

        if (!isFirstTime) {
            log.info("Duplicate event detected: {}, skipping",
                     event.getEventId());
            ack.acknowledge();
            return;
        }

        // Step 2: 執行業務邏輯
        try {
            processBusinessLogic(event);

            // Step 3: 標記處理完成
            markInboxAsProcessed(event.getEventId());

            // Step 4: Commit offset
            ack.acknowledge();

        } catch (Exception e) {
            log.error("Failed to process event: {}", event.getEventId(), e);
            markInboxAsFailed(event.getEventId(), e.getMessage());
            // 不 acknowledge，等待重試
        }
    }

    private boolean tryInsertInbox(EarmarkEvent event) {
        try {
            InboxEvent inbox = InboxEvent.builder()
                .eventId(event.getEventId())
                .aggregateId(event.getMainRef())
                .eventType(event.getEventType())
                .payload(toJson(event))
                .status("RECEIVED")
                .build();

            inboxRepo.save(inbox);
            return true;  // 插入成功，第一次處理

        } catch (DataIntegrityViolationException e) {
            return false;  // PK 衝突，重複事件
        }
    }

    private void processBusinessLogic(EarmarkEvent event) {
        // 業務邏輯
        ddaService.debit(event.getAccountNo(), event.getAmount());
        txRepo.updateStatus(event.getMainRef(), "DDA_PROCESSING");
    }

    private void markInboxAsProcessed(String eventId) {
        inboxRepo.updateStatus(eventId, "PROCESSED", LocalDateTime.now());
    }

    private void markInboxAsFailed(String eventId, String errorMsg) {
        inboxRepo.updateStatusWithError(eventId, "FAILED", errorMsg);
    }
}
```

### 5.2 生產級版本（含狀態機）

```java
@Service
public class ProductionGradeInboxConsumer {

    @Autowired
    private InboxRepository inboxRepo;

    @Autowired
    private BusinessService businessService;

    @Value("${inbox.max-retry:3}")
    private int maxRetry;

    @KafkaListener(topics = "${kafka.topic.earmark}",
                   groupId = "${kafka.consumer.group}")
    @Transactional
    public void consume(ConsumerRecord<String, Event> record,
                       Acknowledgment ack) {

        Event event = record.value();
        String eventId = event.getEventId();

        // 1. 查詢或創建 Inbox 記錄
        InboxEvent inbox = getOrCreateInboxEvent(event);

        // 2. 檢查狀態
        if (inbox.getStatus().equals("PROCESSED")) {
            log.info("Event {} already processed, skipping", eventId);
            ack.acknowledge();
            return;
        }

        if (inbox.getStatus().equals("FAILED")) {
            log.warn("Event {} previously failed, skipping", eventId);
            ack.acknowledge();
            return;
        }

        // 3. 檢查重試次數
        if (inbox.getRetryCount() >= maxRetry) {
            log.error("Event {} exceeded max retry {}, sending to DLQ",
                     eventId, maxRetry);
            sendToDlq(event);
            markInboxAsFailed(eventId, "Max retry exceeded");
            ack.acknowledge();
            return;
        }

        // 4. 更新狀態為 PROCESSING
        updateInboxStatus(eventId, "PROCESSING");
        incrementRetryCount(eventId);

        // 5. 執行業務邏輯
        try {
            businessService.process(event);

            // 6. 標記成功
            markInboxAsProcessed(eventId);
            ack.acknowledge();

        } catch (BusinessException e) {
            // 業務異常，不重試，直接失敗
            log.error("Business exception for event {}: {}",
                     eventId, e.getMessage());
            markInboxAsFailed(eventId, e.getMessage());
            sendToDlq(event);
            ack.acknowledge();

        } catch (Exception e) {
            // 系統異常，記錄錯誤，不 ack（等待重試）
            log.error("System exception for event {}, will retry",
                     eventId, e);
            updateLastError(eventId, e.getMessage());
            // 不 acknowledge，等待自動重試
        }
    }

    @Transactional
    private InboxEvent getOrCreateInboxEvent(Event event) {
        return inboxRepo.findByEventId(event.getEventId())
            .orElseGet(() -> {
                InboxEvent inbox = InboxEvent.builder()
                    .eventId(event.getEventId())
                    .correlationId(event.getCorrelationId())
                    .aggregateId(event.getMainRef())
                    .aggregateVersion(event.getVersion())
                    .eventType(event.getEventType())
                    .payload(toJson(event))
                    .status("RECEIVED")
                    .retryCount(0)
                    .createdBy(getServiceName())
                    .hostname(getHostname())
                    .build();

                return inboxRepo.save(inbox);
            });
    }

    private void updateInboxStatus(String eventId, String status) {
        inboxRepo.updateStatus(eventId, status,
                               status.equals("PROCESSING")
                                   ? LocalDateTime.now()
                                   : null);
    }

    private void incrementRetryCount(String eventId) {
        inboxRepo.incrementRetryCount(eventId);
    }

    private void markInboxAsProcessed(String eventId) {
        inboxRepo.updateStatusWithTimestamp(eventId, "PROCESSED",
                                           LocalDateTime.now());
    }

    private void markInboxAsFailed(String eventId, String error) {
        inboxRepo.updateStatusWithError(eventId, "FAILED", error);
    }

    private void updateLastError(String eventId, String error) {
        inboxRepo.updateLastError(eventId, error);
    }

    private void sendToDlq(Event event) {
        kafkaTemplate.send("dlq-earmark-events", event);
    }

    private String getServiceName() {
        return System.getProperty("spring.application.name", "unknown");
    }

    private String getHostname() {
        try {
            return InetAddress.getLocalHost().getHostName();
        } catch (Exception e) {
            return "unknown";
        }
    }
}
```

---

## 六、Retry + DLQ 與 Inbox 的配合

### 6.1 重試策略

Inbox Pattern 與重試機制的結合：

```java
@Configuration
public class KafkaRetryConfig {

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();

        // 重試策略：3 次，指數退避
        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(1000);      // 第一次 1 秒
        backOffPolicy.setMultiplier(2.0);            // 每次翻倍
        backOffPolicy.setMaxInterval(10000);         // 最大 10 秒

        retryTemplate.setBackOffPolicy(backOffPolicy);

        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(3);
        retryTemplate.setRetryPolicy(retryPolicy);

        return retryTemplate;
    }
}
```

#### 重試場景決策樹

```text
事件處理失敗
    ↓
是否 BusinessException？
    ↓ Yes → 業務規則錯誤，不重試 → 送 DLQ + 通知
    ↓ No
是否 TransientException？
    ↓ Yes → 暫時性錯誤（網路抖動、下游暫時不可用）
         → 重試（不 ack offset）
         → 達到上限後送 DLQ
    ↓ No
未知異常
    → 重試 N 次
    → 達到上限後送 DLQ + 告警
```

### 6.2 DLQ 處理

DLQ（Dead Letter Queue）與 Inbox 的配合：

```java
@Service
public class DlqProcessor {

    @Autowired
    private InboxRepository inboxRepo;

    @Autowired
    private KafkaTemplate<String, Event> kafkaTemplate;

    public void sendToDlq(Event event, String reason) {
        // 1. 記錄到 Inbox（狀態為 FAILED）
        InboxEvent inbox = inboxRepo.findByEventId(event.getEventId())
            .orElseThrow();

        inbox.setStatus("FAILED");
        inbox.setLastError(reason);
        inboxRepo.save(inbox);

        // 2. 包裝 DLQ 訊息
        DlqEvent dlqEvent = DlqEvent.builder()
            .originalEvent(event)
            .reason(reason)
            .failedAt(LocalDateTime.now())
            .inboxId(inbox.getId())
            .retryCount(inbox.getRetryCount())
            .build();

        // 3. 發送到 DLQ topic
        kafkaTemplate.send("dlq-earmark-events", dlqEvent);

        // 4. 告警通知
        alertService.sendAlert("Event sent to DLQ",
                              "EventId: " + event.getEventId() +
                              ", Reason: " + reason);
    }

    @KafkaListener(topics = "dlq-earmark-events")
    public void processDlq(DlqEvent dlqEvent) {
        // DLQ 處理邏輯
        // 1. 記錄到專門的 DLQ 表
        // 2. 生成人工處理工單
        // 3. 發送通知給運維團隊

        log.warn("DLQ event received: {}, reason: {}",
                dlqEvent.getOriginalEvent().getEventId(),
                dlqEvent.getReason());

        // 創建工單
        ticketService.createDlqTicket(dlqEvent);
    }
}
```

---

## 七、監控與可觀測性

### 7.1 關鍵指標

**必須監控的 Inbox 指標**：

```sql
-- 1. 待處理事件數量（應接近 0）
SELECT COUNT(*) AS pending_count
FROM inbox_event
WHERE status = 'RECEIVED';

-- 2. 處理中事件數量（長時間未變化需告警）
SELECT COUNT(*) AS processing_count
FROM inbox_event
WHERE status = 'PROCESSING';

-- 3. 失敗事件數量（任何新增都要告警）
SELECT COUNT(*) AS failed_count
FROM inbox_event
WHERE status = 'FAILED'
  AND DATE(received_at) = CURDATE();

-- 4. 處理延遲（P99）
SELECT
    PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY processing_time_ms) AS p99_latency
FROM (
    SELECT
        TIMESTAMPDIFF(SECOND, received_at, processed_at) * 1000 AS processing_time_ms
    FROM inbox_event
    WHERE status = 'PROCESSED'
      AND DATE(processed_at) = CURDATE()
) AS latencies;

-- 5. 重複事件比率（過高需檢查 Consumer 配置）
SELECT
    event_type,
    COUNT(*) AS total_attempts,
    COUNT(DISTINCT event_id) AS unique_events,
    (COUNT(*) - COUNT(DISTINCT event_id)) / COUNT(DISTINCT event_id) * 100 AS duplicate_rate
FROM inbox_event
WHERE DATE(received_at) = CURDATE()
GROUP BY event_type;

-- 6. 高重試次數事件（需人工介入）
SELECT
    event_id,
    aggregate_id,
    event_type,
    retry_count,
    last_error,
    received_at
FROM inbox_event
WHERE retry_count > 5
  AND status != 'PROCESSED'
ORDER BY retry_count DESC
LIMIT 100;
```

#### Prometheus Metrics 範例

```java
@Component
public class InboxMetrics {

    private final MeterRegistry meterRegistry;

    @Autowired
    public InboxMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    public void recordEventReceived(String eventType) {
        meterRegistry.counter("inbox.events.received",
                             "event_type", eventType)
                    .increment();
    }

    public void recordEventProcessed(String eventType, long durationMs) {
        meterRegistry.counter("inbox.events.processed",
                             "event_type", eventType)
                    .increment();

        meterRegistry.timer("inbox.processing.duration",
                           "event_type", eventType)
                    .record(durationMs, TimeUnit.MILLISECONDS);
    }

    public void recordDuplicateEvent(String eventType) {
        meterRegistry.counter("inbox.events.duplicate",
                             "event_type", eventType)
                    .increment();
    }

    public void recordEventFailed(String eventType, String reason) {
        meterRegistry.counter("inbox.events.failed",
                             "event_type", eventType,
                             "reason", reason)
                    .increment();
    }

    @Scheduled(fixedDelay = 60000)  // 每分鐘
    public void reportPendingCount() {
        long pending = inboxRepo.countByStatus("RECEIVED");
        meterRegistry.gauge("inbox.events.pending", pending);
    }
}
```

#### Grafana Dashboard 告警規則

```yaml
groups:
  - name: inbox_alerts
    rules:
      - alert: InboxEventsPending
        expr: inbox_events_pending > 1000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "High number of pending inbox events"
          description: "{{ $value }} events pending for > 5 minutes"

      - alert: InboxEventsProcessingSlow
        expr: histogram_quantile(0.99, inbox_processing_duration_seconds) > 30
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "Slow inbox event processing"
          description: "P99 latency is {{ $value }}s"

      - alert: InboxEventsFailed
        expr: increase(inbox_events_failed[5m]) > 0
        labels:
          severity: critical
        annotations:
          summary: "Inbox events failing"
          description: "{{ $value }} events failed in last 5 minutes"
```

### 7.2 查帳與追蹤

#### 完整交易事件歷史查詢

```sql
-- 查詢特定交易的完整事件流
SELECT
    ie.event_id,
    ie.event_type,
    ie.status,
    ie.received_at,
    ie.processing_started_at,
    ie.processed_at,
    TIMESTAMPDIFF(SECOND, ie.received_at, ie.processed_at) AS processing_time_seconds,
    ie.retry_count,
    ie.last_error
FROM inbox_event ie
WHERE ie.aggregate_id = 'TX123'
ORDER BY ie.received_at ASC;
```

**輸出範例**：

| event_id | event_type         | status    | received_at         | processed_at        | processing_time_seconds | retry_count |
| -------- | ------------------ | --------- | ------------------- | ------------------- | ----------------------- | ----------- |
| EVT-1001 | EARMARK_REQUESTED  | PROCESSED | 2026-02-09 10:30:00 | 2026-02-09 10:30:02 | 2                       | 0           |
| EVT-1002 | EARMARK_OK         | PROCESSED | 2026-02-09 10:30:05 | 2026-02-09 10:30:07 | 2                       | 0           |
| EVT-1003 | DDA_DEBIT_REQUESTED| PROCESSED | 2026-02-09 10:30:10 | 2026-02-09 10:30:15 | 5                       | 0           |
| EVT-1004 | DDA_OK             | PROCESSED | 2026-02-09 10:30:20 | 2026-02-09 10:30:22 | 2                       | 0           |

👉 **審計價值**：完整的事件歷史，可追溯每一步的處理時間和結果。

#### 重複事件分析

```sql
-- 找出被重複處理的事件（檢測 Consumer 配置問題）
SELECT
    event_id,
    aggregate_id,
    event_type,
    COUNT(*) AS attempt_count,
    MIN(received_at) AS first_attempt,
    MAX(received_at) AS last_attempt
FROM inbox_event
WHERE DATE(received_at) = CURDATE()
GROUP BY event_id, aggregate_id, event_type
HAVING COUNT(*) > 1
ORDER BY attempt_count DESC;
```

#### 對帳查詢

```sql
-- 檢查是否有遺漏的事件（與 Outbox 表比對）
SELECT
    oe.event_id,
    oe.aggregate_id,
    oe.event_type,
    oe.sent_at,
    ie.event_id AS inbox_event_id,
    ie.status AS inbox_status
FROM outbox_event oe
LEFT JOIN inbox_event ie ON oe.event_id = ie.event_id
WHERE oe.status = 'SENT'
  AND ie.event_id IS NULL  -- 發送了但未接收
  AND oe.sent_at < NOW() - INTERVAL 10 MINUTE  -- 超過 10 分鐘
ORDER BY oe.sent_at DESC;
```

---

## 八、Inbox + Outbox 組合威力

### 完整一致性保證

| 一致性問題           | 解決方案   | 保證能力                       |
| -------------------- | ---------- | ------------------------------ |
| **DB 更新後事件沒送**| Outbox     | 資料庫狀態改變就一定會有事件   |
| **事件重送造成重複處理**| Inbox      | 同一事件只會影響系統一次       |
| **非同步流程一致性** | 兩者組合   | End-to-end exactly-once effect |

### 組合架構圖

```text
┌─────────────────────────────────────────────────────────────┐
│                      Service A (Producer)                    │
│                                                               │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │  Business    │────▶│   Outbox     │────▶│   Kafka      │ │
│  │   Logic      │     │   Table      │     │   Topic      │ │
│  └──────────────┘     └──────────────┘     └──────┬───────┘ │
│         │                                          │         │
│         │ (Same DB Transaction)                    │         │
│         ▼                                          │         │
│  ┌──────────────┐                                 │         │
│  │   Business   │                                 │         │
│  │   Table      │                                 │         │
│  └──────────────┘                                 │         │
└───────────────────────────────────────────────────┼─────────┘
                                                     │
                                                     │ Kafka
                                                     │
┌────────────────────────────────────────────────────┼─────────┐
│                      Service B (Consumer)          │         │
│                                                    ▼         │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐ │
│  │   Kafka      │────▶│    Inbox     │────▶│  Business    │ │
│  │   Consumer   │     │    Table     │     │   Logic      │ │
│  └──────────────┘     └──────────────┘     └──────┬───────┘ │
│                             │                      │         │
│                             │ (Same DB Transaction)│         │
│                             ▼                      ▼         │
│                       ┌──────────────┐     ┌──────────────┐ │
│                       │  Duplicate   │     │   Business   │ │
│                       │  Detection   │     │   Table      │ │
│                       └──────────────┘     └──────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### 為什麼這是「Kafka 版 XA Transaction」？

傳統 XA Transaction（兩階段提交）：

```text
Coordinator → Prepare Phase → All participants vote
           → Commit Phase  → All participants commit
```

Outbox + Inbox Pattern：

```text
Outbox  → 確保 DB 更新 + 事件發送的原子性（本地事務）
Inbox   → 確保事件消費的冪等性（重複事件無副作用）
結果    → End-to-end exactly-once effect（無需分散式事務協調）
```

**優勢**：

- ✅ 無需 2PC（兩階段提交）的效能損耗
- ✅ 無需分散式事務協調器
- ✅ 可擴展性高
- ✅ 故障恢復簡單

---

## 九、常見問題與最佳實踐

### 9.1 FAQ

**Q1: Inbox 表會不會無限增長？**

A: 會。需要定期清理策略：

```java
@Scheduled(cron = "0 0 3 * * *")  // 每天凌晨 3 點
public void cleanupOldInboxEvents() {
    LocalDateTime cutoffDate = LocalDateTime.now().minusDays(30);

    int deleted = inboxRepo.deleteByStatusAndProcessedAtBefore(
        "PROCESSED", cutoffDate
    );

    log.info("Cleaned up {} processed inbox events older than 30 days",
             deleted);
}
```

**建議保留期**：

- `PROCESSED` 狀態：30 天（審計需要）
- `FAILED` 狀態：90 天（問題分析）
- `RECEIVED/PROCESSING`：需人工檢查後才能刪除

---

**Q2: Inbox 插入和業務處理必須在同一事務中嗎？**

A: **強烈建議在同一事務中**，否則可能出現：

- Inbox 插入成功，但業務處理失敗且未回滾
- 下次重複事件來時被跳過，導致業務邏輯遺失

```java
// ❌ 錯誤做法
public void handleEvent(Event event) {
    inboxRepo.save(inbox);  // 事務 1
    // ... 業務處理 ...      // 事務 2（可能失敗）
}

// ✅ 正確做法
@Transactional
public void handleEvent(Event event) {
    inboxRepo.save(inbox);
    // ... 業務處理 ...  // 同一事務
}
```

---

**Q3: 如何處理「已處理但需要重新處理」的場景？**

A: 提供**手動重放機制**：

```java
@RestController
@RequestMapping("/api/admin/inbox")
public class InboxAdminController {

    @PostMapping("/replay/{eventId}")
    public ResponseEntity<String> replayEvent(@PathVariable String eventId) {
        InboxEvent inbox = inboxRepo.findByEventId(eventId)
            .orElseThrow(() -> new NotFoundException("Event not found"));

        // 檢查權限
        if (!hasAdminPermission()) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        // 重置狀態（允許重新處理）
        inbox.setStatus("RECEIVED");
        inbox.setRetryCount(0);
        inbox.setLastError(null);
        inboxRepo.save(inbox);

        // 重新發送到 Kafka（從原始 payload）
        Event originalEvent = fromJson(inbox.getPayload(), Event.class);
        kafkaTemplate.send(inbox.getEventType(), originalEvent);

        log.warn("Event {} manually replayed by admin", eventId);
        return ResponseEntity.ok("Event replayed successfully");
    }
}
```

---

**Q4: Inbox 會影響效能嗎？**

A: 影響很小，但可優化：

**效能考量**：

- INSERT 一筆記錄：< 1ms（有 PK 索引）
- UPDATE 一筆記錄：< 1ms
- 總開銷：< 5% 額外延遲

**優化建議**：

```sql
-- 1. 確保有正確索引
CREATE INDEX idx_event_id ON inbox_event(event_id);
CREATE INDEX idx_status_received ON inbox_event(status, received_at);

-- 2. 定期清理舊資料（避免表過大）
DELETE FROM inbox_event
WHERE status = 'PROCESSED'
  AND processed_at < NOW() - INTERVAL 30 DAY;

-- 3. 考慮分區表（大量事件場景）
CREATE TABLE inbox_event (
    ...
) PARTITION BY RANGE (YEAR(received_at) * 100 + MONTH(received_at)) (
    PARTITION p202601 VALUES LESS THAN (202602),
    PARTITION p202602 VALUES LESS THAN (202603),
    ...
);
```

---

**Q5: 可以用 Redis 代替資料庫 Inbox 嗎？**

A: **可以，但需注意風險**：

✅ **優點**：

- 效能更好（記憶體操作）
- 自動過期（TTL）

❌ **缺點**：

- Redis 故障可能遺失防重記錄
- 無法與業務邏輯在同一事務中
- 審計追蹤較弱

**建議**：

- 非金融核心系統：可用 Redis
- 金融核心系統：必須用資料庫（ACID 保證）

```java
// Redis Inbox 範例（僅供參考）
@Service
public class RedisInboxService {

    @Autowired
    private RedisTemplate<String, String> redisTemplate;

    private static final String INBOX_PREFIX = "inbox:";
    private static final long TTL_DAYS = 30;

    public boolean tryProcess(String eventId) {
        String key = INBOX_PREFIX + eventId;

        // 使用 SETNX（只在 key 不存在時設置）
        Boolean success = redisTemplate.opsForValue()
            .setIfAbsent(key, "PROCESSED", TTL_DAYS, TimeUnit.DAYS);

        return Boolean.TRUE.equals(success);  // true = 第一次處理
    }
}
```

---

### 9.2 Best Practices

#### ✅ 必須做（Must Have）

1. **事件 ID 必須唯一且穩定**
   - 使用 UUID 或業務流水號
   - 同一事件多次發送必須用相同 ID

2. **Inbox 插入與業務處理在同一事務**
   - 確保原子性
   - 避免「已防重但未處理」

3. **定期清理 Inbox 表**
   - 避免無限增長
   - 保留 30-90 天供審計

4. **監控關鍵指標**
   - Pending events 數量
   - Failed events 告警
   - 處理延遲 P99

5. **記錄完整 payload**
   - 用於問題排查
   - 支援手動重放

#### ✅ 強烈建議（Should Have）

1. **使用狀態機管理 Inbox 狀態**
   - RECEIVED → PROCESSING → PROCESSED/FAILED
   - 支援重試和錯誤處理

2. **記錄重試次數和錯誤訊息**
   - 用於故障分析
   - 決定是否送 DLQ

3. **分離 BusinessException 和 SystemException**
   - 業務異常不重試
   - 系統異常重試 N 次

4. **提供查詢和管理 API**
   - 查詢事件處理狀態
   - 手動重放失敗事件

5. **與 Outbox 配合使用**
   - 完整的端到端一致性保證

#### ⭕ 可選（Nice to Have）

1. **使用 correlation ID 串連完整 Saga**
   - 追蹤端到端流程
   - 便於故障排查

2. **記錄處理主機和服務**
   - 便於分散式系統除錯
   - 分析負載分布

3. **實施分區策略**
   - 大量事件場景優化查詢
   - 簡化歷史資料清理

---

## 十、總結

### 核心價值

Inbox Pattern 是 Kafka 事件驅動架構中實現 **冪等性** 的標準模式，解決了 at-least-once 語意下的重複處理問題。

### 關鍵要點（記住這五點）

1. **防重檢查**：利用資料庫 PK/Unique 約束實現原子性防重
2. **同一事務**：Inbox 插入與業務處理必須在同一 DB 事務中
3. **狀態管理**：使用狀態機管理事件處理生命週期
4. **可追溯性**：Inbox 表即事件歷史，支援審計和對帳
5. **組合使用**：與 Outbox Pattern 配合，達到端到端一致性

### 實施檢查清單

- [ ] Inbox 表結構已設計（包含 event_id PK）
- [ ] Consumer 實作防重邏輯（try-insert pattern）
- [ ] Inbox 插入與業務處理在同一事務
- [ ] 實施狀態機（RECEIVED → PROCESSING → PROCESSED）
- [ ] 配置重試策略和 DLQ
- [ ] 設置監控告警（pending, failed events）
- [ ] 實施定期清理策略
- [ ] 提供查詢和管理 API
- [ ] 與 Outbox Pattern 配合使用

### 一句話總結

> ✅ **Outbox 確保「該發的一定會發」，Inbox 確保「來了只會處理一次」。**
>
> 兩者組合即 Kafka 版的 XA Transaction，無需 2PC 即可達到端到端 exactly-once effect。

---

## 延伸閱讀

- **Transactional Outbox Pattern**：Inbox 的配對模式，確保事件發送一致性
- **Saga Pattern**：跨服務分散式交易協調模式
- **Event Sourcing**：以事件為真相來源的架構模式
- **CQRS (Command Query Responsibility Segregation)**：讀寫分離架構

---

**文檔版本**: v2.0
**最後更新**: 2026-02-09
**文檔狀態**: ✅ 生產就緒（Production Ready）
**適用對象**: Kafka 架構師、後端開發工程師、金融系統開發團隊
**文檔級別**: 🏦 銀行級架構設計標準

**相關文檔**：

- [README-JmsToKafka.md](README-JmsToKafka.md) - 完整的 JMS 到 Kafka 遷移指南
- Transactional Outbox Pattern - Inbox 的配對模式
