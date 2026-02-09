# Kafka 銀行級架構：Inbox + DLQ 完整設計指南

> 💡 **核心理念**：Inbox 保證「一次效果」，DLQ 保證「不中斷營運」—— 兩者組合才是金融級 Kafka 架構的雙保險

**類比理解**：

- 📋 **Inbox Pattern**：銀行櫃檯登記本 — 每筆交易先蓋章報到，確保不重複處理
- 🚫 **DLQ Pattern**：異常交易處理中心 — 失敗交易隔離存放，不卡死正常業務

---

## 🧩 一張圖看懂雙保險架構

```text
Kafka Event
   ↓
┌─────────────────────┐
│  Inbox 防重層        │ ← 防止：重複扣帳、重複更新狀態
│  ✅ 檢查 event_id    │
│  ✅ 防重記錄         │
└─────────────────────┘
   ↓
┌─────────────────────┐
│  業務處理層          │ ← 可能失敗的業務邏輯
│  DDA 扣帳           │
│  額度更新           │
└─────────────────────┘
   ↓
   成功？
   ↓ Yes → commit offset
   ↓ No
┌─────────────────────┐
│  Retry 機制         │ ← 重試 3-5 次（指數退避）
└─────────────────────┘
   ↓
   仍失敗？
   ↓ Yes
┌─────────────────────┐
│  DLQ 隔離層         │ ← 防止：系統卡死、業務停擺
│  ✅ 失敗事件存檔    │
│  ✅ 可追蹤可重放    │
│  ✅ commit offset   │
└─────────────────────┘
```

**風險控制對照表**：

| 風險場景         | Inbox 作用 | DLQ 作用  | 缺一個會怎樣           |
| ---------------- | ---------- | --------- | ---------------------- |
| Kafka 重播事件   | ✅ 防止    | —         | 重複扣款 💥            |
| Consumer crash   | ✅ 防止    | —         | 重複扣款 💥            |
| 下游系統當機     | —          | ✅ 隔離   | 整個系統卡死 💥        |
| 資料格式錯誤     | —          | ✅ 隔離   | consumer 崩潰 💥       |
| 業務規則拒絕     | —          | ✅ 記錄   | 無法追蹤補救 💥        |
| 系統需要補帳     | ✅ 避免重複| ✅ 可重放 | 錯帳 or 卡死 💥        |

---

## 目錄

### 第一部分：架構概述

- [為什麼銀行必須同時使用 Inbox + DLQ](#為什麼銀行必須同時使用-inbox--dlq)
- [只用 Inbox 的風險](#只用-inbox-的風險)
- [只用 DLQ 的風險](#只用-dlq-的風險)
- [雙保險架構成熟度等級](#雙保險架構成熟度等級)

### 第二部分：Inbox Pattern（防重機制）

- [Inbox Pattern 核心原理](#inbox-pattern-核心原理)
- [為什麼 Kafka 一定需要 Inbox](#為什麼-kafka-一定需要-inbox)
- [實際場景案例：銀行扣帳流程](#實際場景案例銀行扣帳流程)
- [Inbox 表結構設計](#inbox-表結構設計)
- [Inbox 實施流程](#inbox-實施流程)
- [Inbox Java 實作範例](#inbox-java-實作範例)
- [Inbox 監控與追蹤](#inbox-監控與追蹤)

### 第三部分：DLQ Pattern（異常處理）

- [DLQ Pattern 核心原理](#dlq-pattern-核心原理)
- [為什麼 Kafka 一定需要 DLQ](#為什麼-kafka-一定需要-dlq)
- [DLQ 錯誤分類與處置策略](#dlq-錯誤分類與處置策略)
- [DLQ 標準設計](#dlq-標準設計)
- [Retry 策略與 DLQ 配合](#retry-策略與-dlq-配合)
- [DLQ Java 實作範例](#dlq-java-實作範例)
- [DLQ 重放機制](#dlq-重放機制)
- [DLQ 監控與告警](#dlq-監控與告警)

### 第四部分：整合架構

- [Inbox + DLQ 完整流程](#inbox--dlq-完整流程)
- [與 Outbox 的三方整合](#與-outbox-的三方整合)
- [端到端一致性保證](#端到端一致性保證)

### 第五部分：最佳實踐與總結

- [常見問題 FAQ](#常見問題-faq)
- [Best Practices](#best-practices)
- [反模式（Anti-Patterns）](#反模式anti-patterns)
- [總結與檢查清單](#總結與檢查清單)

---

# 第一部分：架構概述

## 為什麼銀行必須同時使用 Inbox + DLQ

在銀行級 Kafka 架構中，Inbox 和 DLQ 負責**完全不同但互補的風險控制層**：

### 控制層分工

```text
┌──────────────────────────────────────────────────┐
│          Inbox Pattern (一致性控制)               │
│  ✅ 防止重複處理                                  │
│  ✅ 確保 exactly-once effect                     │
│  ✅ 利用資料庫 ACID 特性                          │
└──────────────────────────────────────────────────┘
                        ↓
┌──────────────────────────────────────────────────┐
│          DLQ Pattern (營運風險控制)               │
│  ✅ 隔離失敗事件                                  │
│  ✅ 保持系統流動性                                │
│  ✅ 支援補救與重放                                │
└──────────────────────────────────────────────────┘
```

### 只用 Inbox 的風險

**場景**：DDA 核心系統當機 30 分鐘

```text
時間 T1: Event 進入
        → Inbox 成功記錄 ✅
        → 業務處理失敗（DDA 當機）❌
        → offset 不 commit

時間 T2: Kafka 重送事件
        → Inbox 發現重複，跳過 ✅
        → 但業務還是沒執行 ❌
        → offset 仍不 commit

時間 T3-T30: 持續循環...
        → Consumer 被同一筆事件卡死 💥
        → 後續 10,000+ 筆正常交易全部堵塞 💥
        → 系統完全停擺 💥
```

**影響**：

- 🚫 系統可用性：0%
- 🚫 業務連續性：中斷
- 🚫 客戶體驗：交易無法執行
- 🔴 嚴重程度：P0 生產事故

👉 **Inbox 解決重複，但解決不了卡死**

### 只用 DLQ 的風險

**場景**：Consumer crash 導致事件重送

```text
時間 T1: 收到 EVT-3001
        → 執行扣帳 100,000 USD ✅
        → 準備 commit offset...

時間 T2: Consumer CRASH 💥
        → offset 未 commit

時間 T3: Consumer 重啟
        → Kafka 重送 EVT-3001
        → 沒有 Inbox 防重
        → 再次扣帳 100,000 USD 💥

結果: 客戶被扣款 200,000 USD
      財務事故 🔴 P0
      需人工補正 💰
```

**影響**：

- 💥 財務一致性：錯帳
- 💥 審計合規：違規
- 💥 客戶信任：投訴
- 🔴 嚴重程度：P0 財務事故

👉 **DLQ 解決失敗隔離，但解決不了重複**

---

## 雙保險架構成熟度等級

| 等級     | 架構組合                       | 能上銀行核心？ | 主要風險             |
| -------- | ------------------------------ | -------------- | -------------------- |
| 初級     | Kafka only                     | ❌             | 重複 + 卡死 + 錯帳   |
| 中級     | Kafka + Retry                  | ❌             | 重複 + 卡死          |
| 進階     | Kafka + Inbox                  | ⚠️ 風險高      | 容易卡死             |
| 高階     | Kafka + DLQ                    | ⚠️ 風險高      | 會錯帳               |
| 🏆 銀行級| Kafka + Inbox + DLQ + Outbox   | ✅             | 符合金融風控標準     |

### 🏦 銀行核心 Kafka 標準組合

```text
Outbox Pattern       → 保證事件一定發出
   ↓
Kafka Topic          → 事件可靠傳遞
   ↓
Inbox Pattern        → 保證只處理一次（冪等性）
   ↓
Business Logic       → 執行業務邏輯
   ↓
DLQ Pattern          → 失敗事件隔離可控
   ↓
Saga Pattern         → 跨系統一致性協調
   ↓
Reconciliation       → 最終對帳保險
```

**如果少任何一個，遲早會發生**：
- 重複扣款事故 💰
- 卡單癱瘓事故 🚫
- 稽核違規事故 📋
- 客訴賠償事故 😡

---

# 第二部分：Inbox Pattern（防重機制）

## Inbox Pattern 核心原理

> 💡 **核心理念**：每個事件先「蓋章報到」再處理，確保同一事件永遠只會影響系統一次（Exactly-Once Effect）

**類比理解**：就像銀行櫃檯作業流程：
- 📄 客戶單據先登記流水號
- ✅ 已處理過的單據不能再扣款一次
- 🔍 所有處理記錄可追溯審計

### 為什麼 Kafka 一定需要 Inbox

#### Kafka 的重送特性

Kafka 的消費語意是 **at-least-once**，這意味著：

- ✔ 訊息可能重送（network retry、consumer crash、rebalance）
- ✔ Consumer 可能在處理中途 crash
- ✔ Offset 可能還沒 commit 就斷線
- ✔ 手動 replay 事件時會重複消費

> ⚠️ **關鍵理解**：Kafka 保證訊息「至少送達一次」，不保證「僅送達一次」。應用層必須自行實現冪等性。

#### 沒有 Inbox 的風險

| 風險類型         | 具體影響                     | 嚴重程度 |
| ---------------- | ---------------------------- | -------- |
| **重複扣款**     | 客戶帳戶被多次扣款           | 🔴 P0    |
| **額度重複釋放** | 授信額度計算錯誤             | 🔴 P0    |
| **狀態錯亂**     | 交易狀態機跳到不合法的狀態   | 🔴 P0    |
| **財務不一致**   | 帳務與交易系統金額不符       | 🔴 P0    |
| **審計軌跡污染** | 無法分辨重複事件與正常事件   | 🟡 P1    |

---

## 實際場景案例：銀行扣帳流程

### 事件結構

業務流程：

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

### 無 Inbox Pattern 的災難場景

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

### 有 Inbox Pattern 的安全場景

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

## Inbox 表結構設計

### 標準 Inbox 表（基礎版本）

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

### 進階 Inbox 表（生產級版本）

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

## Inbox 實施流程

### Step 1: 先寫 Inbox（報到）

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

### Step 2: 執行業務邏輯

```java
// 業務邏輯處理
ddaService.debit(accountNo, amount);
transactionRepo.updateStatus(mainRef, "DDA_PROCESSING");
outboxRepo.insertEvent(nextEvent);  // 發送下一個事件
```

> ⚠️ **重要**：Step 1 和 Step 2 必須在同一個 **資料庫事務** 中，確保原子性。

### Step 3: 標記處理完成

```sql
UPDATE inbox_event
SET status = 'PROCESSED',
    processed_at = NOW()
WHERE event_id = 'EVT-1001';
```

> 💡 **最佳實踐**：在 Step 2 和 Step 3 完成後再 commit Kafka offset，確保 at-least-once 語意下的安全性。

### Step 4: 重送事件的自動處理

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

## Inbox Java 實作範例

### 基礎版本（簡單防重）

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

### 生產級版本（含狀態機）

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

    // ... 其他輔助方法
}
```

---

## Inbox 監控與追蹤

### 關鍵監控指標

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

-- 4. 重複事件比率（過高需檢查 Consumer 配置）
SELECT
    event_type,
    COUNT(*) AS total_attempts,
    COUNT(DISTINCT event_id) AS unique_events,
    (COUNT(*) - COUNT(DISTINCT event_id)) / COUNT(DISTINCT event_id) * 100 AS duplicate_rate
FROM inbox_event
WHERE DATE(received_at) = CURDATE()
GROUP BY event_type;

-- 5. 完整交易事件歷史查詢
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

### Prometheus Metrics 範例

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

    @Scheduled(fixedDelay = 60000)  // 每分鐘
    public void reportPendingCount() {
        long pending = inboxRepo.countByStatus("RECEIVED");
        meterRegistry.gauge("inbox.events.pending", pending);
    }
}
```

---

# 第三部分：DLQ Pattern（異常處理）

## DLQ Pattern 核心原理

> 💡 **核心理念**：DLQ 不是垃圾桶，而是 Kafka 系統的「異常交易處理中心」與風險控制點

**DLQ = Dead Letter Queue** (在 Kafka 中通常稱為 **Dead Letter Topic**)

**類比理解**：就像銀行的異常交易暫存池：

- 🚫 處理失敗的事件不會卡死整個系統
- 📋 所有失敗事件可追蹤、可補救、可審計
- ✅ 滿足金融風控與合規要求

### 為什麼 Kafka 一定需要 DLQ

#### 沒有 DLQ 的災難場景

**場景**：DDA 核心系統當機

```text
時間 T1: Consumer 收到 EARMARK_OK 事件 (EVT-2001)
        → 嘗試呼叫 DDA 系統扣帳
        → DDA 系統當機 / Timeout 💥

時間 T2: Consumer 重試第 1 次
        → 仍然失敗 💥

時間 T3: Consumer 重試第 2 次
        → 仍然失敗 💥

時間 T4: Consumer 重試第 3 次
        → 仍然失敗 💥

...（無限循環）

結果：
🚫 事件永遠卡在同一個 offset
🚫 Consumer 無法推進，後續 10,000 筆正常交易全部被堵死
🚫 系統看起來「掛掉」，業務完全停擺
🚫 告警滿天飛，客戶投訴暴增
```

**影響範圍**：

| 影響層面         | 具體後果                       | 嚴重程度 |
| ---------------- | ------------------------------ | -------- |
| **系統可用性**   | Consumer 完全堵塞，無法處理新事件 | 🔴 P0    |
| **業務連續性**   | 正常交易無法執行               | 🔴 P0    |
| **客戶體驗**     | 交易卡住，客戶無法操作         | 🔴 P0    |
| **運維壓力**     | 需緊急人工介入重啟 Consumer    | 🟡 P1    |
| **資料一致性**   | 可能造成狀態不一致             | 🔴 P0    |

#### DLQ 的核心價值

✅ **隔離失敗事件**：不讓單一壞事件影響整個系統
✅ **保持系統流動**：Consumer 可繼續處理後續正常事件
✅ **可追蹤審計**：所有失敗事件完整記錄，符合金融合規要求
✅ **支援補救**：失敗事件可重放、可人工處理、可補償
✅ **風險可控**：失敗率、失敗原因一目了然，便於改進

---

## DLQ 錯誤分類與處置策略

### 錯誤類型分類

| 錯誤類型                    | 描述                           | 是否重試 | DLQ 處理         | 優先級 |
| --------------------------- | ------------------------------ | -------- | ---------------- | ------ |
| **Transient Error**         | 暫時性錯誤（網路抖動、超時）   | ✅ 3-5次 | 失敗後送 DLQ     | 🟡 P1  |
| **Downstream Unavailable**  | 下游系統暫時不可用             | ✅ 3-5次 | 系統恢復後重放   | 🟡 P1  |
| **Schema Error**            | 資料格式/Schema 不符           | ❌ 不重試| 直接送 DLQ + 修正| 🔴 P0  |
| **Business Rule Violation** | 業務規則拒絕                   | ❌ 不重試| 送 DLQ + 補償    | 🟡 P1  |
| **Poison Message**          | 無法反序列化的訊息             | ❌ 不重試| 隔離 + P0 告警   | 🔴 P0  |
| **Version Conflict**        | 事件版本衝突                   | ❌ 不重試| 送 DLQ + 對帳    | 🟡 P1  |
| **Authentication Failed**   | 下游系統認證失敗               | ✅ 1-2次 | 檢查配置 + 告警  | 🔴 P0  |
| **Rate Limit Exceeded**     | 超過下游系統速率限制           | ✅ 重試  | 延遲重放         | 🟢 P2  |

### 常見失敗場景

#### 場景 1: 下游系統故障（Transient Error）

```text
錯誤類型: DOWNSTREAM_TIMEOUT
原因: DDA 核心系統暫時不可用
處置策略: ✅ 重試 3 次（指數退避）
         ❌ 仍失敗 → 送 DLQ
         ✅ 系統恢復後從 DLQ 重放
```

#### 場景 2: 資料格式錯誤（Permanent Error）

```json
{
  "eventType": "EARMARK_OK",
  "amount": null,  // ❌ 金額為空
  "accountNo": "INVALID"  // ❌ 無效帳號
}
```

```text
錯誤類型: SCHEMA_VALIDATION_ERROR
原因: 事件資料不符合 schema
處置策略: ❌ 不重試（永遠不會成功）
         ✅ 直接送 DLQ
         ✅ 告警通知開發團隊修正來源系統
```

#### 場景 3: 業務規則拒絕（Business Exception）

```text
錯誤類型: BUSINESS_RULE_VIOLATION
原因: 客戶餘額不足 / 額度已使用 / 帳戶凍結
處置策略: ❌ 不重試（業務狀態不會自動改變）
         ✅ 送 DLQ
         ✅ 觸發補償流程（釋放 EARMARK）
         ✅ 通知客戶
```

#### 場景 4: 毒藥訊息（Poison Message）

```text
錯誤類型: DESERIALIZATION_ERROR
原因: JSON 格式錯誤 / 無法反序列化
處置策略: ❌ 不重試（永遠無法解析）
         ✅ 直接送 DLQ
         ✅ 隔離該訊息，避免阻塞 Consumer
         ✅ P0 告警，緊急修正來源
```

### 處置決策樹

```text
事件處理失敗
    ↓
能否反序列化？
    ↓ No → POISON_MESSAGE
         → 直接送 DLQ + P0 告警
         → 隔離該訊息
    ↓ Yes
Schema 是否有效？
    ↓ No → SCHEMA_ERROR
         → 直接送 DLQ
         → 通知開發團隊修正
    ↓ Yes
是否 Business Exception？
    ↓ Yes → BUSINESS_RULE_VIOLATION
         → 不重試，送 DLQ
         → 觸發補償流程
         → 通知客戶
    ↓ No
是否 Transient Exception？
    ↓ Yes → 重試（指數退避）
         → 重試次數 < MAX？
             ↓ Yes → 繼續重試
             ↓ No → 送 DLQ + 告警
    ↓ No
未知異常
    → 重試 N 次
    → 達到上限送 DLQ
    → P1 告警人工介入
```

---

## DLQ 標準設計

### DLQ Topic 命名規範

**推薦命名模式**：

```text
格式: dlq-{original-topic-name}

範例:
- 原始 topic: earmark-events
- DLQ topic:  dlq-earmark-events

- 原始 topic: dda-debit-events
- DLQ topic:  dlq-dda-debit-events
```

**進階：按錯誤類型分 DLQ**（大型系統推薦）：

```text
dlq-{topic}-transient    # 暫時性錯誤（可重放）
dlq-{topic}-permanent    # 永久性錯誤（需人工修正）
dlq-{topic}-poison       # 毒藥訊息（需隔離）
dlq-{topic}-business     # 業務規則拒絕（需補償）
```

### DLQ 事件結構

**標準 DLQ 事件格式**：

```json
{
  "dlqMetadata": {
    "dlqId": "DLQ-20260209-001",
    "originalTopic": "earmark-events",
    "originalPartition": 3,
    "originalOffset": 12345,
    "failedAt": "2026-02-09T11:20:00Z",
    "retryCount": 3,
    "errorType": "DOWNSTREAM_TIMEOUT",
    "errorMessage": "DDA core system not responding after 30s",
    "errorStackTrace": "java.net.SocketTimeoutException: Read timed out...",
    "consumerGroup": "earmark-consumer-group",
    "consumerHost": "kafka-consumer-pod-3",
    "processingDuration": 95000
  },
  "originalEvent": {
    "eventId": "EVT-2001",
    "correlationId": "CORR-TX555",
    "mainRef": "TX555",
    "version": 1,
    "eventType": "EARMARK_OK",
    "businessData": {
      "amount": 500000,
      "currency": "USD",
      "accountNo": "9876543210"
    },
    "timestamp": "2026-02-09T11:15:00Z"
  }
}
```

#### 關鍵欄位說明

| 欄位                    | 用途                                   |
| ----------------------- | -------------------------------------- |
| `dlqId`                 | DLQ 事件唯一 ID                        |
| `originalTopic`         | 原始 topic 名稱（用於路由重放）        |
| `originalPartition/Offset` | 原始位置（用於審計追蹤）            |
| `failedAt`              | 失敗時間（用於 SLA 監控）              |
| `retryCount`            | 已重試次數（用於分析）                 |
| `errorType`             | 錯誤分類（用於統計和決策）             |
| `errorMessage`          | 錯誤描述（用於排查）                   |
| `errorStackTrace`       | 完整堆疊（用於除錯）                   |
| `consumerGroup/Host`    | 處理者資訊（用於定位問題）             |
| `processingDuration`    | 處理耗時（用於效能分析）               |
| `originalEvent`         | 完整原始事件（用於重放）               |

### DLQ 表結構（資料庫）

**生產級 DLQ 表設計**：

```sql
CREATE TABLE dlq_event (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    dlq_id VARCHAR(50) UNIQUE NOT NULL,

    -- 原始事件資訊
    original_topic VARCHAR(100) NOT NULL,
    original_partition INT,
    original_offset BIGINT,
    original_event_id VARCHAR(50),
    aggregate_id VARCHAR(50),

    -- 錯誤資訊
    error_type VARCHAR(50) NOT NULL,
    error_message TEXT,
    error_stack_trace TEXT,
    retry_count INT DEFAULT 0,

    -- 時間資訊
    failed_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    -- 處理資訊
    consumer_group VARCHAR(100),
    consumer_host VARCHAR(100),
    processing_duration_ms BIGINT,

    -- 重放資訊
    replay_status VARCHAR(20) DEFAULT 'PENDING',  -- PENDING, REPLAYED, FAILED, SKIPPED
    replay_at TIMESTAMP NULL,
    replay_result TEXT,
    replay_attempt_count INT DEFAULT 0,

    -- 原始資料（完整事件 JSON）
    original_payload JSON NOT NULL,

    -- 業務分類
    business_category VARCHAR(50),
    severity VARCHAR(20),  -- P0, P1, P2

    -- 索引
    INDEX idx_error_type (error_type, failed_at),
    INDEX idx_aggregate (aggregate_id),
    INDEX idx_replay_status (replay_status, failed_at),
    INDEX idx_failed_at (failed_at DESC),
    INDEX idx_original_topic (original_topic, failed_at)
);
```

#### 重放狀態說明

| replay_status | 說明                   | 下一步                 |
| ------------- | ---------------------- | ---------------------- |
| `PENDING`     | 待重放                 | → REPLAYED / FAILED    |
| `REPLAYED`    | 已成功重放             | （終態）               |
| `FAILED`      | 重放失敗               | → 人工介入             |
| `SKIPPED`     | 標記為跳過（不需重放） | （終態）               |

---

## Retry 策略與 DLQ 配合

### 重試策略設計

**推薦配置**：

| 錯誤類型             | 重試次數 | 初始延遲 | 最大延遲 | 退避倍數 |
| -------------------- | -------- | -------- | -------- | -------- |
| Transient Error      | 5        | 1s       | 60s      | 2.0      |
| Downstream Timeout   | 3        | 2s       | 30s      | 2.0      |
| Rate Limit           | 10       | 5s       | 300s     | 1.5      |
| Schema Error         | 0        | -        | -        | -        |
| Business Exception   | 0        | -        | -        | -        |
| Poison Message       | 0        | -        | -        | -        |

### Exponential Backoff 實作

```java
@Configuration
public class RetryConfig {

    @Bean
    public RetryTemplate retryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();

        // 重試策略：最多 3 次
        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy();
        retryPolicy.setMaxAttempts(3);
        retryTemplate.setRetryPolicy(retryPolicy);

        // 退避策略：指數退避
        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(1000);      // 第一次重試等待 1 秒
        backOffPolicy.setMultiplier(2.0);            // 每次翻倍
        backOffPolicy.setMaxInterval(30000);         // 最大等待 30 秒
        retryTemplate.setBackOffPolicy(backOffPolicy);

        return retryTemplate;
    }

    @Bean
    public RetryTemplate businessRetryTemplate() {
        RetryTemplate retryTemplate = new RetryTemplate();

        // 只重試特定異常
        Map<Class<? extends Throwable>, Boolean> retryableExceptions = new HashMap<>();
        retryableExceptions.put(TransientException.class, true);
        retryableExceptions.put(TimeoutException.class, true);
        retryableExceptions.put(BusinessException.class, false);  // 不重試

        SimpleRetryPolicy retryPolicy = new SimpleRetryPolicy(3, retryableExceptions);
        retryTemplate.setRetryPolicy(retryPolicy);

        ExponentialBackOffPolicy backOffPolicy = new ExponentialBackOffPolicy();
        backOffPolicy.setInitialInterval(2000);
        backOffPolicy.setMultiplier(2.0);
        backOffPolicy.setMaxInterval(60000);
        retryTemplate.setBackOffPolicy(backOffPolicy);

        return retryTemplate;
    }
}
```

### 重試決策邏輯

```java
public class RetryDecisionMaker {

    public boolean shouldRetry(Exception exception, int attemptCount, int maxAttempts) {
        // 已達到最大重試次數
        if (attemptCount >= maxAttempts) {
            return false;
        }

        // 業務異常不重試
        if (exception instanceof BusinessException) {
            return false;
        }

        // Schema 錯誤不重試
        if (exception instanceof SchemaValidationException) {
            return false;
        }

        // 毒藥訊息不重試
        if (exception instanceof DeserializationException) {
            return false;
        }

        // 暫時性錯誤重試
        if (exception instanceof TransientException) {
            return true;
        }

        // 下游超時重試
        if (exception instanceof TimeoutException) {
            return true;
        }

        // 網路錯誤重試
        if (exception instanceof IOException) {
            return true;
        }

        // 預設不重試（保守策略）
        return false;
    }

    public long calculateBackoffDelay(int attemptCount) {
        // 指數退避：1s, 2s, 4s, 8s, 16s, 30s (cap)
        long baseDelay = 1000;  // 1 秒
        double multiplier = 2.0;
        long maxDelay = 30000;  // 30 秒

        long delay = (long) (baseDelay * Math.pow(multiplier, attemptCount - 1));
        return Math.min(delay, maxDelay);
    }
}
```

---

## DLQ Java 實作範例

### 基礎版本（簡單 DLQ）

```java
@Service
public class BasicDlqConsumer {

    @Autowired
    private KafkaTemplate<String, Event> kafkaTemplate;

    @Autowired
    private BusinessService businessService;

    @Autowired
    private RetryTemplate retryTemplate;

    @Value("${dlq.max-retry:3}")
    private int maxRetry;

    @KafkaListener(topics = "earmark-events",
                   groupId = "earmark-consumer-group")
    public void consume(ConsumerRecord<String, Event> record,
                       Acknowledgment ack) {

        Event event = record.value();

        try {
            // 使用 RetryTemplate 處理
            retryTemplate.execute(context -> {
                businessService.process(event);
                return null;
            });

            // 成功，commit offset
            ack.acknowledge();

        } catch (Exception e) {
            // 失敗，送 DLQ
            log.error("Failed to process event {} after {} retries, sending to DLQ",
                     event.getEventId(), maxRetry, e);

            sendToDlq(record, e);
            ack.acknowledge();  // Commit offset，避免重複處理
        }
    }

    private void sendToDlq(ConsumerRecord<String, Event> record, Exception error) {
        DlqEvent dlqEvent = DlqEvent.builder()
            .dlqId("DLQ-" + UUID.randomUUID())
            .originalTopic(record.topic())
            .originalPartition(record.partition())
            .originalOffset(record.offset())
            .originalEvent(record.value())
            .errorType(classifyError(error))
            .errorMessage(error.getMessage())
            .errorStackTrace(getStackTrace(error))
            .failedAt(Instant.now())
            .retryCount(maxRetry)
            .consumerGroup("earmark-consumer-group")
            .consumerHost(getHostname())
            .build();

        // 發送到 DLQ topic
        kafkaTemplate.send("dlq-earmark-events", dlqEvent);

        // 記錄到資料庫
        dlqRepository.save(dlqEvent);

        // 發送告警
        alertService.sendAlert("Event sent to DLQ",
                              "EventId: " + record.value().getEventId() +
                              ", Error: " + error.getMessage());
    }

    private String classifyError(Exception error) {
        if (error instanceof TimeoutException) {
            return "DOWNSTREAM_TIMEOUT";
        } else if (error instanceof BusinessException) {
            return "BUSINESS_RULE_VIOLATION";
        } else if (error instanceof SchemaValidationException) {
            return "SCHEMA_ERROR";
        } else if (error instanceof DeserializationException) {
            return "POISON_MESSAGE";
        } else {
            return "UNKNOWN_ERROR";
        }
    }
}
```

### 生產級版本（含分類與告警）

```java
@Service
public class ProductionGradeDlqConsumer {

    @Autowired
    private KafkaTemplate<String, DlqEvent> kafkaTemplate;

    @Autowired
    private DlqRepository dlqRepository;

    @Autowired
    private AlertService alertService;

    @Autowired
    private MetricsService metricsService;

    @Autowired
    private RetryDecisionMaker retryDecisionMaker;

    @Value("${dlq.max-retry:3}")
    private int maxRetry;

    @KafkaListener(topics = "${kafka.topic.earmark}",
                   groupId = "${kafka.consumer.group}")
    @Transactional
    public void consume(ConsumerRecord<String, Event> record,
                       Acknowledgment ack) {

        Event event = record.value();
        int attemptCount = 0;
        Exception lastException = null;

        // 重試循環
        while (attemptCount < maxRetry) {
            try {
                attemptCount++;
                long startTime = System.currentTimeMillis();

                // 執行業務邏輯
                businessService.process(event);

                // 成功
                long duration = System.currentTimeMillis() - startTime;
                metricsService.recordSuccess(event.getEventType(), duration);
                ack.acknowledge();
                return;

            } catch (Exception e) {
                lastException = e;
                long duration = System.currentTimeMillis() - startTime;

                // 判斷是否應該重試
                if (!retryDecisionMaker.shouldRetry(e, attemptCount, maxRetry)) {
                    log.error("Non-retryable exception for event {}, sending to DLQ",
                             event.getEventId(), e);
                    break;
                }

                // 計算退避延遲
                long backoffDelay = retryDecisionMaker.calculateBackoffDelay(attemptCount);

                log.warn("Retry {}/{} for event {} after {}ms, waiting {}ms",
                        attemptCount, maxRetry, event.getEventId(),
                        duration, backoffDelay);

                metricsService.recordRetry(event.getEventType(), attemptCount);

                // 等待後重試
                try {
                    Thread.sleep(backoffDelay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
        }

        // 所有重試都失敗，送 DLQ
        sendToDlqWithClassification(record, lastException, attemptCount);
        ack.acknowledge();
    }

    private void sendToDlqWithClassification(
            ConsumerRecord<String, Event> record,
            Exception error,
            int retryCount) {

        String errorType = classifyError(error);
        String severity = determineSeverity(errorType);
        String dlqTopic = determineDlqTopic(errorType);

        DlqEvent dlqEvent = DlqEvent.builder()
            .dlqId(generateDlqId())
            .originalTopic(record.topic())
            .originalPartition(record.partition())
            .originalOffset(record.offset())
            .originalEventId(record.value().getEventId())
            .aggregateId(record.value().getMainRef())
            .originalEvent(record.value())
            .errorType(errorType)
            .errorMessage(error.getMessage())
            .errorStackTrace(getStackTrace(error))
            .failedAt(Instant.now())
            .retryCount(retryCount)
            .consumerGroup(getConsumerGroup())
            .consumerHost(getHostname())
            .businessCategory(record.value().getEventType())
            .severity(severity)
            .replayStatus("PENDING")
            .build();

        // 1. 發送到分類後的 DLQ topic
        kafkaTemplate.send(dlqTopic, dlqEvent);

        // 2. 持久化到資料庫
        dlqRepository.save(dlqEvent);

        // 3. 記錄 metrics
        metricsService.recordDlq(errorType, severity);

        // 4. 發送告警（根據嚴重程度）
        sendAlert(dlqEvent, severity);

        log.error("Event {} sent to DLQ topic: {}, error type: {}, severity: {}",
                 record.value().getEventId(), dlqTopic, errorType, severity);
    }

    private String determineDlqTopic(String errorType) {
        switch (errorType) {
            case "DOWNSTREAM_TIMEOUT":
            case "TRANSIENT_ERROR":
                return "dlq-earmark-events-transient";

            case "SCHEMA_ERROR":
            case "POISON_MESSAGE":
                return "dlq-earmark-events-poison";

            case "BUSINESS_RULE_VIOLATION":
                return "dlq-earmark-events-business";

            default:
                return "dlq-earmark-events-permanent";
        }
    }

    private String determineSeverity(String errorType) {
        switch (errorType) {
            case "POISON_MESSAGE":
            case "SCHEMA_ERROR":
                return "P0";  // Critical

            case "BUSINESS_RULE_VIOLATION":
            case "DOWNSTREAM_TIMEOUT":
                return "P1";  // High

            default:
                return "P2";  // Medium
        }
    }

    private void sendAlert(DlqEvent dlqEvent, String severity) {
        if ("P0".equals(severity)) {
            // 緊急告警：簡訊 + 電話 + Slack
            alertService.sendCriticalAlert(
                "P0 DLQ Event",
                String.format("Event %s failed with %s",
                             dlqEvent.getOriginalEventId(),
                             dlqEvent.getErrorType())
            );
        } else if ("P1".equals(severity)) {
            // 高級告警：Email + Slack
            alertService.sendHighPriorityAlert(
                "P1 DLQ Event",
                String.format("Event %s sent to DLQ", dlqEvent.getOriginalEventId())
            );
        } else {
            // 一般告警：Slack
            alertService.sendInfoAlert(
                "DLQ Event",
                String.format("Event %s in DLQ", dlqEvent.getOriginalEventId())
            );
        }
    }
}
```

---

## DLQ 重放機制

### 手動重放（Admin API）

```java
@RestController
@RequestMapping("/api/admin/dlq")
public class DlqAdminController {

    @Autowired
    private DlqReplayService replayService;

    @Autowired
    private DlqRepository dlqRepository;

    @PostMapping("/replay/{dlqId}")
    public ResponseEntity<ReplayResult> replayEvent(@PathVariable String dlqId) {
        DlqRecord record = dlqRepository.findByDlqId(dlqId)
            .orElseThrow(() -> new NotFoundException("DLQ event not found"));

        // 檢查權限
        if (!hasAdminPermission()) {
            return ResponseEntity.status(403).build();
        }

        // 檢查狀態
        if ("REPLAYED".equals(record.getReplayStatus())) {
            return ResponseEntity.badRequest()
                .body(ReplayResult.error("Event already replayed"));
        }

        // 執行重放
        ReplayResult result = replayService.replay(record);

        return ResponseEntity.ok(result);
    }

    @PostMapping("/replay/batch")
    public ResponseEntity<BatchReplayResult> replayBatch(
            @RequestBody BatchReplayRequest request) {

        List<DlqRecord> records = dlqRepository.findByErrorType(
            request.getErrorType(),
            request.getFromDate(),
            request.getToDate()
        );

        BatchReplayResult result = replayService.replayBatch(records);

        return ResponseEntity.ok(result);
    }

    @GetMapping("/status")
    public ResponseEntity<DlqStatus> getStatus() {
        DlqStatus status = DlqStatus.builder()
            .pendingCount(dlqRepository.countByReplayStatus("PENDING"))
            .replayedCount(dlqRepository.countByReplayStatus("REPLAYED"))
            .failedCount(dlqRepository.countByReplayStatus("FAILED"))
            .build();

        return ResponseEntity.ok(status);
    }
}
```

### 自動重放（定時任務）

```java
@Service
public class DlqAutoReplayService {

    @Autowired
    private DlqRepository dlqRepository;

    @Autowired
    private KafkaTemplate<String, Event> kafkaTemplate;

    @Autowired
    private SystemHealthChecker healthChecker;

    @Scheduled(cron = "0 */10 * * * *")  // 每 10 分鐘執行一次
    public void autoReplayTransientErrors() {
        // 只在系統健康時重放
        if (!healthChecker.isHealthy()) {
            log.warn("System unhealthy, skipping DLQ auto-replay");
            return;
        }

        // 查詢待重放的暫時性錯誤事件
        LocalDateTime cutoffTime = LocalDateTime.now().minusMinutes(30);

        List<DlqRecord> records = dlqRepository.findByErrorTypeAndReplayStatusAndFailedAtBefore(
            "TRANSIENT_ERROR",
            "PENDING",
            cutoffTime,
            PageRequest.of(0, 100)  // 每次最多重放 100 個
        );

        if (records.isEmpty()) {
            return;
        }

        log.info("Auto-replaying {} DLQ events", records.size());

        int successCount = 0;
        int failedCount = 0;

        for (DlqRecord record : records) {
            try {
                // 檢查重放次數限制
                if (record.getReplayAttemptCount() >= 5) {
                    log.warn("DLQ event {} exceeded max replay attempts",
                            record.getDlqId());
                    record.setReplayStatus("FAILED");
                    record.setReplayResult("Exceeded max replay attempts");
                    dlqRepository.save(record);
                    failedCount++;
                    continue;
                }

                // 重放到原始 topic
                Event originalEvent = fromJson(record.getOriginalPayload(), Event.class);
                kafkaTemplate.send(record.getOriginalTopic(), originalEvent);

                // 更新狀態
                record.setReplayStatus("REPLAYED");
                record.setReplayAt(LocalDateTime.now());
                record.setReplayAttemptCount(record.getReplayAttemptCount() + 1);
                record.setReplayResult("Auto-replayed successfully");
                dlqRepository.save(record);

                successCount++;

                log.info("DLQ event {} replayed successfully", record.getDlqId());

            } catch (Exception e) {
                log.error("Failed to replay DLQ event {}", record.getDlqId(), e);

                record.setReplayAttemptCount(record.getReplayAttemptCount() + 1);
                record.setReplayResult("Replay failed: " + e.getMessage());
                dlqRepository.save(record);

                failedCount++;
            }
        }

        log.info("Auto-replay completed: {} succeeded, {} failed",
                successCount, failedCount);

        // 記錄 metrics
        metricsService.recordAutoReplay(successCount, failedCount);
    }
}
```

---

## DLQ 監控與告警

### 關鍵監控指標

```sql
-- 1. DLQ 事件總數（按錯誤類型）
SELECT
    error_type,
    COUNT(*) AS total_count,
    COUNT(CASE WHEN replay_status = 'PENDING' THEN 1 END) AS pending_count,
    COUNT(CASE WHEN replay_status = 'REPLAYED' THEN 1 END) AS replayed_count,
    COUNT(CASE WHEN replay_status = 'FAILED' THEN 1 END) AS failed_count
FROM dlq_event
WHERE DATE(failed_at) = CURDATE()
GROUP BY error_type
ORDER BY total_count DESC;

-- 2. DLQ 增長率（每小時）
SELECT
    DATE_FORMAT(failed_at, '%Y-%m-%d %H:00:00') AS hour,
    error_type,
    COUNT(*) AS event_count
FROM dlq_event
WHERE failed_at >= NOW() - INTERVAL 24 HOUR
GROUP BY hour, error_type
ORDER BY hour DESC;

-- 3. 高頻失敗的 aggregate（需重點關注）
SELECT
    aggregate_id,
    COUNT(*) AS failure_count,
    GROUP_CONCAT(DISTINCT error_type) AS error_types,
    MIN(failed_at) AS first_failed_at,
    MAX(failed_at) AS last_failed_at
FROM dlq_event
WHERE DATE(failed_at) = CURDATE()
GROUP BY aggregate_id
HAVING failure_count > 3
ORDER BY failure_count DESC
LIMIT 100;

-- 4. DLQ 重放成功率
SELECT
    DATE(failed_at) AS date,
    COUNT(*) AS total_dlq,
    COUNT(CASE WHEN replay_status = 'REPLAYED' THEN 1 END) AS replayed,
    COUNT(CASE WHEN replay_status = 'FAILED' THEN 1 END) AS replay_failed,
    ROUND(COUNT(CASE WHEN replay_status = 'REPLAYED' THEN 1 END) * 100.0 / COUNT(*), 2) AS replay_success_rate
FROM dlq_event
WHERE failed_at >= CURDATE() - INTERVAL 7 DAY
GROUP BY date
ORDER BY date DESC;

-- 5. P0/P1 DLQ 事件（需立即處理）
SELECT
    dlq_id,
    aggregate_id,
    error_type,
    severity,
    error_message,
    failed_at,
    replay_status
FROM dlq_event
WHERE severity IN ('P0', 'P1')
  AND replay_status = 'PENDING'
ORDER BY failed_at DESC
LIMIT 50;
```

### Grafana 告警規則

```yaml
groups:
  - name: dlq_alerts
    rules:
      # 1. 任何 P0 DLQ 事件都要立即告警
      - alert: DlqP0EventDetected
        expr: increase(dlq_events_total{severity="P0"}[5m]) > 0
        labels:
          severity: critical
        annotations:
          summary: "P0 DLQ event detected"
          description: "{{ $value }} P0 events in DLQ in last 5 minutes"

      # 2. DLQ 積壓過多
      - alert: DlqBacklogHigh
        expr: dlq_pending_total > 1000
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High DLQ backlog"
          description: "{{ $value }} pending DLQ events"

      # 3. DLQ 增長率異常
      - alert: DlqGrowthRateHigh
        expr: rate(dlq_events_total[5m]) > 10
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: "High DLQ growth rate"
          description: "DLQ growing at {{ $value }} events/sec"

      # 4. DLQ 重放失敗率高
      - alert: DlqReplayFailureRateHigh
        expr: rate(dlq_replay_total{status="failed"}[10m]) / rate(dlq_replay_total[10m]) > 0.2
        for: 15m
        labels:
          severity: warning
        annotations:
          summary: "High DLQ replay failure rate"
          description: "{{ $value | humanizePercentage }} of replays failing"
```

---

# 第四部分：整合架構

## Inbox + DLQ 完整流程

### 整合架構圖

```text
┌─────────────────── Service A (Producer) ──────────────────┐
│                                                             │
│  業務邏輯 → Outbox 表 → Outbox Publisher → Kafka Topic     │
│              ↓                                              │
│        (Same DB Tx)                                         │
│              ↓                                              │
│         業務表更新                                          │
└─────────────────────────────────────────────────────────────┘
                                ↓
                         Kafka Broker
                                ↓
┌─────────────────── Service B (Consumer) ──────────────────┐
│                                                             │
│  Kafka Consumer                                             │
│       ↓                                                     │
│  ┌──────────────────────────────┐                          │
│  │  Inbox 表（防重檢查）         │                          │
│  │  ✅ INSERT event_id          │                          │
│  │  ✅ **已存在**？→ **跳過**    │                          │
│  │  ✅ 新事件？→ 繼續           │                          │
│  └──────────────────────────────┘                          │
│       ↓                                                     │
│  ┌──────────────────────────────┐                          │
│  │  業務邏輯處理                 │                          │
│  │  DDA 扣帳 / 額度更新          │                          │
│  └──────────────────────────────┘                          │
│       ↓                                                     │
│   成功？                                                    │
│       ↓ Yes                                                 │
│  ┌──────────────────────────────┐                          │
│  │  更新 Inbox 狀態：PROCESSED   │                          │
│  │  Commit Kafka offset          │                          │
│  └──────────────────────────────┘                          │
│       ↓ No                                                  │
│  ┌──────────────────────────────┐                          │
│  │  Retry 機制（指數退避）       │                          │
│  │  重試 3-5 次                  │                          │
│  └──────────────────────────────┘                          │
│       ↓                                                     │
│   仍失敗？                                                  │
│       ↓ Yes                                                 │
│  ┌──────────────────────────────┐                          │
│  │  DLQ 處理                     │                          │
│  │  ✅ 送 DLQ topic              │                          │
│  │  ✅ DLQ 表記錄                │                          │
│  │  ✅ 更新 Inbox：FAILED        │                          │
│  │  ✅ Commit offset             │                          │
│  │  ✅ 告警通知                  │                          │
│  └──────────────────────────────┘                          │
└─────────────────────────────────────────────────────────────┘
                                ↓
                          DLQ Consumer
                                ↓
                ┌───────────────┼───────────────┐
                ↓               ↓               ↓
            創建工單        觸發補償      等待重放
```

### Java 整合實作範例

```java
@Service
public class IntegratedEventConsumer {

    @Autowired
    private InboxRepository inboxRepo;

    @Autowired
    private DlqService dlqService;

    @Autowired
    private BusinessService businessService;

    @Autowired
    private RetryDecisionMaker retryDecisionMaker;

    @Value("${retry.max-attempts:3}")
    private int maxRetryAttempts;

    @KafkaListener(topics = "earmark-events")
    @Transactional
    public void consume(ConsumerRecord<String, Event> record, Acknowledgment ack) {
        Event event = record.value();
        String eventId = event.getEventId();

        // ========== Step 1: Inbox 防重檢查 ==========
        try {
            inboxRepo.insert(
                eventId,
                event.getMainRef(),
                event.getEventType(),
                toJson(event),
                "RECEIVED"
            );
        } catch (DuplicateKeyException e) {
            // 重複事件，直接跳過
            log.info("Duplicate event {} detected by Inbox, skipping", eventId);
            ack.acknowledge();
            return;
        }

        // ========== Step 2: 業務邏輯處理（含 Retry）==========
        int attemptCount = 0;
        Exception lastException = null;

        while (attemptCount < maxRetryAttempts) {
            try {
                attemptCount++;
                long startTime = System.currentTimeMillis();

                // 更新 Inbox 狀態為 PROCESSING
                if (attemptCount == 1) {
                    inboxRepo.updateStatus(eventId, "PROCESSING");
                }

                // 執行業務邏輯
                businessService.process(event);

                // ========== Step 3: 成功處理 ==========
                long duration = System.currentTimeMillis() - startTime;

                // 更新 Inbox 狀態為 PROCESSED
                inboxRepo.updateStatus(eventId, "PROCESSED", LocalDateTime.now());

                // Commit Kafka offset
                ack.acknowledge();

                // 記錄 metrics
                metricsService.recordSuccess(event.getEventType(), duration);

                log.info("Event {} processed successfully in {}ms", eventId, duration);
                return;

            } catch (Exception e) {
                lastException = e;
                long duration = System.currentTimeMillis() - startTime;

                // 記錄重試次數
                inboxRepo.incrementRetryCount(eventId);
                inboxRepo.updateLastError(eventId, e.getMessage());

                // 判斷是否應該重試
                if (!retryDecisionMaker.shouldRetry(e, attemptCount, maxRetryAttempts)) {
                    log.error("Non-retryable exception for event {}, sending to DLQ",
                             eventId, e);
                    break;
                }

                // 計算退避延遲
                long backoffDelay = retryDecisionMaker.calculateBackoffDelay(attemptCount);

                log.warn("Attempt {}/{} failed for event {} after {}ms, waiting {}ms before retry",
                        attemptCount, maxRetryAttempts, eventId, duration, backoffDelay);

                metricsService.recordRetry(event.getEventType(), attemptCount);

                // 等待後重試
                try {
                    Thread.sleep(backoffDelay);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    log.error("Retry interrupted for event {}", eventId);
                    break;
                }
            }
        }

        // ========== Step 4: 所有重試失敗，送 DLQ ==========
        log.error("All {} retry attempts failed for event {}, sending to DLQ",
                 maxRetryAttempts, eventId);

        // 發送到 DLQ
        dlqService.sendToDlq(record, lastException, attemptCount);

        // 更新 Inbox 狀態為 FAILED
        inboxRepo.updateStatus(eventId, "FAILED", lastException.getMessage());

        // Commit offset（重要！避免阻塞後續事件）
        ack.acknowledge();

        log.warn("Event {} marked as FAILED in Inbox and sent to DLQ", eventId);
    }
}
```

---

## 與 Outbox 的三方整合

### 完整一致性保證

| 一致性問題           | 解決方案   | 保證能力                       |
| -------------------- | ---------- | ------------------------------ |
| **DB 更新後事件沒送**| Outbox     | 資料庫狀態改變就一定會有事件   |
| **事件重送造成重複處理**| Inbox      | 同一事件只會影響系統一次       |
| **處理失敗系統卡死** | DLQ        | 失敗事件隔離，系統保持流動     |
| **非同步流程一致性** | 三者組合   | End-to-end exactly-once effect |

### 為什麼這是「Kafka 版 XA Transaction」？

傳統 XA Transaction（兩階段提交）：

```text
Coordinator → Prepare Phase → All participants vote
           → Commit Phase  → All participants commit
```

Outbox + Inbox + DLQ Pattern：

```text
Outbox  → 確保 DB 更新 + 事件發送的原子性（本地事務）
Inbox   → 確保事件消費的冪等性（重複事件無副作用）
DLQ     → 確保失敗事件不阻塞系統（隔離 + 可重放）
結果    → End-to-end exactly-once effect（無需分散式事務協調）
```

**優勢**：

- ✅ 無需 2PC（兩階段提交）的效能損耗
- ✅ 無需分散式事務協調器
- ✅ 可擴展性高
- ✅ 故障恢復簡單
- ✅ 符合銀行級風控標準

---

## 端到端一致性保證

### 完整流程圖

```text
┌────────────────────────────────────────────────────────────────────┐
│                    Service A (Payment Service)                      │
│                                                                      │
│  ┌────────────┐                                                     │
│  │ Controller │                                                     │
│  └──────┬─────┘                                                     │
│         ↓                                                           │
│  ┌────────────────────────────────────────────────────┐            │
│  │           @Transactional Method                     │            │
│  │                                                     │            │
│  │  1. 業務表更新                                      │            │
│  │     UPDATE account SET balance = balance - 100000  │            │
│  │                                                     │            │
│  │  2. Outbox 表插入                                   │            │
│  │     INSERT INTO outbox_event (event_id, ...)       │            │
│  │                                                     │            │
│  │  3. Commit DB Transaction ✅                       │            │
│  └────────────────────────────────────────────────────┘            │
│         ↓                                                           │
│  ┌────────────────┐                                                │
│  │ Outbox Relay   │ → 定期掃描 outbox 表                            │
│  │ (Scheduler)    │ → 發送到 Kafka                                 │
│  └────────┬───────┘                                                │
│           ↓                                                         │
└───────────┼─────────────────────────────────────────────────────────┘
            ↓
    Kafka Topic: payment-events
            ↓
┌───────────┼─────────────────────────────────────────────────────────┐
│           ↓                  Service B (Notification Service)       │
│  ┌────────────────┐                                                 │
│  │ Kafka Consumer │                                                 │
│  └────────┬───────┘                                                 │
│           ↓                                                         │
│  ┌────────────────────────────────────────────────────┐            │
│  │           @Transactional Method                     │            │
│  │                                                     │            │
│  │  1. Inbox 防重檢查                                  │            │
│  │     INSERT INTO inbox_event (event_id, ...)        │            │
│  │     → 成功：第一次處理                              │            │
│  │     → 失敗：重複事件，直接 ack ✅                   │            │
│  │                                                     │            │
│  │  2. 業務邏輯處理                                    │            │
│  │     sendEmail(customer, "Payment received")        │            │
│  │                                                     │            │
│  │  3. 更新 Inbox 狀態                                 │            │
│  │     UPDATE inbox_event SET status = 'PROCESSED'    │            │
│  │                                                     │            │
│  │  4. Commit DB Transaction ✅                       │            │
│  │                                                     │            │
│  │  5. Ack Kafka offset ✅                            │            │
│  └────────────────────────────────────────────────────┘            │
│           ↓ (若失敗)                                                │
│  ┌────────────────────────────────────────────────────┐            │
│  │  Retry 3 次（指數退避）                             │            │
│  │  → 仍失敗？                                         │            │
│  │     → 送 DLQ                                        │            │
│  │     → 更新 Inbox: FAILED                            │            │
│  │     → Ack offset ✅（避免卡死）                     │            │
│  └────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
            ↓
    DLQ Topic: dlq-payment-events
            ↓
┌───────────┼─────────────────────────────────────────────────────────┐
│           ↓                  DLQ Consumer                           │
│  ┌────────────────────────────────────────────────────┐            │
│  │  分類處理：                                         │            │
│  │  • P0 錯誤 → 創建緊急工單 + 電話告警                │            │
│  │  • 暫時性錯誤 → 標記為待重放                        │            │
│  │  • 業務拒絕 → 觸發補償 + 通知客戶                   │            │
│  └────────────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────────┘
```

### 一致性保證層級

| 層級 | 模式     | 保證內容                       | 失敗場景             |
| ---- | -------- | ------------------------------ | -------------------- |
| 1    | Outbox   | DB 更新 + 事件發送原子性       | DB commit 前 crash   |
| 2    | Inbox    | 事件消費冪等性                 | Consumer crash 重送  |
| 3    | DLQ      | 失敗事件隔離 + 可追蹤          | 業務邏輯失敗         |
| 4    | Saga     | 跨服務分散式交易協調           | 多服務一致性         |
| 5    | 對帳     | 最終一致性保險                 | 長期累積錯誤         |

---

# 第五部分：最佳實踐與總結

## 常見問題 FAQ

### Q1: Inbox 表會不會無限增長？

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

### Q2: Inbox 插入和業務處理必須在同一事務中嗎？

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

### Q3: DLQ 的訊息會保留多久？

A: 建議配置：

```properties
# DLQ topic 保留策略
retention.ms=2592000000  # 30 天（金融系統推薦）
retention.bytes=-1       # 不限制大小

# 或者更長
retention.ms=7776000000  # 90 天（用於審計）
```

**同時建立清理策略**：

```java
@Scheduled(cron = "0 0 2 * * *")  // 每天凌晨 2 點
public void cleanupOldDlqEvents() {
    LocalDateTime cutoffDate = LocalDateTime.now().minusDays(90);

    int deleted = dlqRepository.deleteByReplayStatusAndFailedAtBefore(
        "REPLAYED", cutoffDate
    );

    log.info("Cleaned up {} old DLQ events", deleted);
}
```

---

### Q4: DLQ 事件應該重放到原始 topic 還是專用的 replay topic？

A: **取決於場景**：

**方案一：重放到原始 topic（推薦）**

```java
// 優點：重用原有消費邏輯，無需額外代碼
kafkaTemplate.send(record.getOriginalTopic(), originalEvent);
```

✅ 優點：簡單、重用原有邏輯
❌ 缺點：可能再次失敗

**方案二：專用 replay topic**

```java
// 優點：可以有特殊處理邏輯
kafkaTemplate.send("replay-earmark-events", originalEvent);
```

✅ 優點：可特殊處理、可限流
❌ 缺點：需維護額外的 consumer

**建議**：

- 暫時性錯誤（TRANSIENT）：重放到原始 topic
- 需人工修正的：重放到專用 replay topic

---

### Q5: 如何避免 DLQ 成為「垃圾桶」？

A: **建立嚴格的 DLQ 治理流程**：

1. **強制分類**：所有 DLQ 事件必須分類
2. **定期審查**：每週審查 DLQ 趨勢
3. **根因分析**：每月分析 Top 10 DLQ 原因
4. **自動化處理**：能自動重放的就自動化
5. **告警必處理**：P0/P1 DLQ 必須在 SLA 內處理
6. **指標驅動**：設定 DLQ 率目標（< 0.1%）

```java
// DLQ 治理指標
public class DlqGovernance {
    // 目標：DLQ 率 < 0.1%
    public double calculateDlqRate() {
        long totalEvents = eventRepository.count();
        long dlqEvents = dlqRepository.count();
        return (double) dlqEvents / totalEvents * 100;
    }

    // 目標：重放成功率 > 95%
    public double calculateReplaySuccessRate() {
        long totalReplays = dlqRepository.countByReplayStatusNotNull();
        long successReplays = dlqRepository.countByReplayStatus("REPLAYED");
        return (double) successReplays / totalReplays * 100;
    }
}
```

---

### Q6: DLQ 重放的順序重要嗎？

A: **非常重要！**特別是對同一個 aggregate 的事件。

```java
// ✅ 正確做法：按時間順序重放
public void replayByAggregateId(String aggregateId) {
    List<DlqRecord> records = dlqRepository
        .findByAggregateIdOrderByFailedAtAsc(aggregateId);  // ASC 很重要！

    for (DlqRecord record : records) {
        replayEvent(record);
        Thread.sleep(100);  // 確保順序
    }
}
```

**原因**：

- EARMARK_OK → DDA_DEBIT 必須按順序
- 版本化事件必須按版本順序重放
- 違反順序可能導致狀態錯亂

---

## Best Practices

### ✅ 必須做（Must Have）

#### Inbox Pattern

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

#### DLQ Pattern

1. **DLQ 必須有明確的分類策略**
   - Transient / Permanent / Poison / Business
   - 不同類型採取不同處置策略

2. **每個 DLQ 事件都要記錄完整上下文**
   - 原始事件 payload
   - 錯誤堆疊
   - 重試次數
   - 失敗時間

3. **DLQ 必須有監控和告警**
   - P0 事件必須立即告警
   - DLQ 增長率異常必須告警
   - 老化事件（> 24h）必須告警

4. **建立 DLQ 重放機制**
   - 手動重放 API
   - 自動重放（暫時性錯誤）
   - 批量重放能力

5. **定期清理已處理的 DLQ**
   - 避免無限增長
   - 保留 30-90 天供審計

---

### ✅ 強烈建議（Should Have）

#### Inbox Pattern

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

#### DLQ Pattern

1. **按錯誤類型分 DLQ Topic**
   - 便於管理和重放
   - 不同類型不同保留策略

2. **DLQ 事件持久化到資料庫**
   - 便於查詢和分析
   - 支援複雜的重放邏輯

3. **建立 DLQ 治理流程**
   - 每週審查 DLQ 趨勢
   - 每月根因分析
   - 設定 DLQ 率目標

4. **整合 Ticket 系統**
   - P0/P1 DLQ 自動創建工單
   - 追蹤處理進度

5. **實施重放限流**
   - 避免重放過快影響系統
   - 建議每個事件間隔 100-500ms

---

### ⭕ 可選（Nice to Have）

1. **使用 correlation ID 串連完整 Saga**
   - 追蹤端到端流程
   - 便於故障排查

2. **記錄處理主機和服務**
   - 便於分散式系統除錯
   - 分析負載分布

3. **實施分區策略**
   - 大量事件場景優化查詢
   - 簡化歷史資料清理

4. **DLQ Dashboard 視覺化**
   - 便於快速識別問題
   - 支援深入分析

5. **智能重放策略**
   - 根據系統負載自動調整重放速率
   - 根據下游系統健康狀況決定是否重放

---

## 反模式（Anti-Patterns）

### ❌ 絕對不要做

#### Inbox Pattern

1. **不在同一事務中處理 Inbox 和業務邏輯**

```java
// ❌ 錯誤做法
public void handleEvent(Event event) {
    inboxRepo.save(inbox);  // 事務 1
    // ... 業務處理 ...      // 事務 2
}
```

**後果**：Inbox 記錄但業務未執行，重複事件被跳過導致遺漏

1. **沒有定期清理 Inbox 表**

**後果**：表無限增長，查詢效能下降，最終資料庫爆滿

3. **Inbox 成功但不處理業務邏輯就 ack**

**後果**：事件永久遺失，業務未執行

#### DLQ Pattern

1. **無限重試不送 DLQ**

```java
// ❌ 錯誤做法
while (true) {
    try {
        process(event);
        break;
    } catch (Exception e) {
        // 無限循環，永遠不送 DLQ
        Thread.sleep(1000);
    }
}
```

**後果**：單一失敗事件卡死整個 consumer

2. **送 DLQ 後不告警**

```java
// ❌ 錯誤做法
kafkaTemplate.send("dlq-topic", dlqEvent);
// 沒有告警，DLQ 變成黑洞
```

**後果**：問題被掩蓋，長期累積成災難

3. **DLQ 沒有重放機制**

**後果**：DLQ 變成只進不出的「垃圾桶」

4. **所有錯誤都重試**

```java
// ❌ 錯誤做法
catch (Exception e) {
    retry();  // Schema 錯誤、業務拒絕都重試
}
```

**後果**：浪費資源，永遠不會成功

5. **DLQ 不分類**

**後果**：無法針對不同錯誤採取不同策略

---

## 總結與檢查清單

### 核心價值總結

**Inbox Pattern**（一致性控制）：

- ✅ 防止重複處理
- ✅ 確保 exactly-once effect
- ✅ 利用資料庫 ACID 特性
- ✅ 完整的事件歷史追蹤

**DLQ Pattern**（營運風險控制）：

- ✅ 隔離失敗事件，不阻塞正常流程
- ✅ 完整的失敗事件記錄和追蹤
- ✅ 支援重放和補救機制
- ✅ 滿足金融合規和審計要求

**雙保險架構**：

- ✅ 端到端 exactly-once effect
- ✅ 系統可用性保證
- ✅ 符合銀行級風控標準

### 關鍵要點（記住這五點）

1. **Inbox 防重**：利用資料庫 PK/Unique 約束實現原子性防重
2. **同一事務**：Inbox 插入與業務處理必須在同一 DB 事務中
3. **錯誤分類**：不同錯誤類型採取不同策略（重試 vs 不重試）
4. **DLQ 隔離**：失敗事件送 DLQ，commit offset，保持系統流動
5. **重放機制**：暫時性錯誤可自動重放，永久性錯誤需人工修正後重放

### 實施檢查清單

#### Inbox Pattern 檢查清單

- [ ] Inbox 表結構已設計（包含 event_id PK）
- [ ] Consumer 實作防重邏輯（try-insert pattern）
- [ ] Inbox 插入與業務處理在同一事務
- [ ] 實施狀態機（RECEIVED → PROCESSING → PROCESSED）
- [ ] 配置重試策略（含 exponential backoff）
- [ ] 設置監控告警（pending, failed events）
- [ ] 實施定期清理策略
- [ ] 提供查詢和管理 API
- [ ] 記錄完整 payload 供審計

#### DLQ Pattern 檢查清單

- [ ] DLQ Topic 已建立（含命名規範）
- [ ] DLQ 事件結構已標準化
- [ ] DLQ 表結構已設計（含重放狀態）
- [ ] 錯誤分類邏輯已實作
- [ ] Retry 策略已配置（含 exponential backoff）
- [ ] DLQ 發送邏輯已實作（含告警）
- [ ] DLQ Consumer 已實作
- [ ] 重放機制已建立（手動 + 自動）
- [ ] 監控指標已配置
- [ ] 告警規則已設定
- [ ] DLQ Dashboard 已建立
- [ ] 清理策略已實施
- [ ] 治理流程已建立

#### 整合架構檢查清單

- [ ] Outbox Pattern 已實作（確保事件發送）
- [ ] Inbox Pattern 已實作（確保冪等性）
- [ ] DLQ Pattern 已實作（確保系統流動性）
- [ ] Retry 機制已配置（指數退避）
- [ ] 錯誤分類已明確（Transient/Permanent/Business/Poison）
- [ ] 監控告警已建立（Inbox + DLQ）
- [ ] 重放機制已完善（手動 + 自動）
- [ ] 補償機制已建立（業務規則拒絕場景）
- [ ] 對帳機制已建立（最終一致性保險）
- [ ] 治理流程已建立（定期審查 + 根因分析）

### 與 Kafka 完整架構的關係

```text
┌─────────────────────────────────────────────────────┐
│           銀行級 Kafka 完整架構                      │
└─────────────────────────────────────────────────────┘
                        ↓
    ┌───────────────────┴───────────────────┐
    ↓                   ↓                   ↓
Outbox Pattern      Inbox Pattern       DLQ Pattern
確保事件發送        確保冪等性          確保流動性
    ↓                   ↓                   ↓
DB 更新 + 事件      防止重複處理        失敗事件隔離
原子性保證          exactly-once        可追蹤可重放
    ↓                   ↓                   ↓
    └───────────────────┬───────────────────┘
                        ↓
              End-to-End 一致性保證
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓               ↓
    Saga Pattern    對帳機制        監控告警
    跨服務協調      最終保險        風險預警
```

### 一句話總結

> ✅ **Inbox 確保「該處理的只處理一次」，DLQ 確保「處理不了的不會卡死系統」。**
>
> 兩者組合是 Kafka 銀行級架構的雙保險，缺一不可。
>
> **Outbox 確保「該發的一定會發」，Inbox 確保「來了只會處理一次」，DLQ 確保「失敗了不會卡死」。**
>
> 三者組合即 Kafka 版的 XA Transaction，無需 2PC 即可達到端到端 exactly-once effect。

---

## 延伸閱讀

- **Transactional Outbox Pattern**：確保事件發送一致性
- **Saga Pattern**：跨服務分散式交易協調模式
- **Event Sourcing**：以事件為真相來源的架構模式
- **CQRS (Command Query Responsibility Segregation)**：讀寫分離架構
- **Kafka Monitoring**：Consumer lag, throughput, error rate
- **Retry 策略設計**：指數退避、Circuit Breaker

---

## 真實銀行控管模型對照

| Kafka 概念       | 銀行作業          | 說明                           |
| ---------------- | ----------------- | ------------------------------ |
| Outbox           | 交易登錄簿        | 確保交易記錄與通知同時完成     |
| Inbox            | 防重檢查機制      | 確保交易單據不重複處理         |
| Retry            | 系統自動補送      | 網路抖動、暫時性故障自動重試   |
| DLQ              | 異常交易暫存池    | 失敗交易隔離，等待處理         |
| DLQ 分類         | 異常原因分類      | 系統錯誤 vs 業務拒絕 vs 資料錯誤 |
| DLQ 重放         | 補帳/沖正/重新執行| 修正後重新處理                 |
| DLQ 監控         | 風險通報          | 異常率、失敗原因統計           |
| DLQ 治理         | 異常管理會議      | 定期審查、根因分析、流程改善   |
| 對帳機制         | 日終對帳          | 最終一致性保證                 |

---

**文檔版本**: v3.0
**最後更新**: 2026-02-09
**文檔狀態**: ✅ 生產就緒（Production Ready）
**適用對象**: Kafka 架構師、後端開發工程師、金融系統開發團隊、運維團隊
**文檔級別**: 🏦 銀行級架構設計標準

**相關文檔**：

- README-JmsToKafka.md - 完整的 JMS 到 Kafka 遷移指南
- Transactional Outbox Pattern - 事件發送一致性保證
- Saga Pattern - 分散式交易協調
