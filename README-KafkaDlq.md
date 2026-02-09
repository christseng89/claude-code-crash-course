# Kafka DLQ（Dead Letter Queue）設計與實踐指南

> 💡 **核心理念**：DLQ 不是垃圾桶，而是 Kafka 系統的「異常交易處理中心」與風險控制點

**DLQ = Dead Letter Queue** (在 Kafka 中通常稱為 **Dead Letter Topic**)

**類比理解**：就像銀行的異常交易暫存池：
- 🚫 處理失敗的事件不會卡死整個系統
- 📋 所有失敗事件可追蹤、可補救、可審計
- ✅ 滿足金融風控與合規要求

---

## 目錄

- [一、為什麼 Kafka 一定需要 DLQ？](#一為什麼-kafka-一定需要-dlq)
  - [1.1 沒有 DLQ 的災難場景](#11-沒有-dlq-的災難場景)
  - [1.2 DLQ 的核心價值](#12-dlq-的核心價值)
- [二、銀行級實際場景案例](#二銀行級實際場景案例)
  - [2.1 EARMARK + DDA 扣帳流程](#21-earmark--dda-扣帳流程)
  - [2.2 常見失敗場景](#22-常見失敗場景)
- [三、DLQ 事件分類與處置策略](#三dlq-事件分類與處置策略)
  - [3.1 錯誤類型分類](#31-錯誤類型分類)
  - [3.2 處置決策樹](#32-處置決策樹)
- [四、DLQ 標準設計](#四dlq-標準設計)
  - [4.1 DLQ Topic 命名規範](#41-dlq-topic-命名規範)
  - [4.2 DLQ 事件結構](#42-dlq-事件結構)
  - [4.3 DLQ 表結構（資料庫）](#43-dlq-表結構資料庫)
- [五、Retry 策略與 DLQ 配合](#五retry-策略與-dlq-配合)
  - [5.1 重試策略設計](#51-重試策略設計)
  - [5.2 Exponential Backoff 實作](#52-exponential-backoff-實作)
  - [5.3 重試決策邏輯](#53-重試決策邏輯)
- [六、Java 實作範例](#六java-實作範例)
  - [6.1 基礎版本（簡單 DLQ）](#61-基礎版本簡單-dlq)
  - [6.2 生產級版本（含分類與告警）](#62-生產級版本含分類與告警)
  - [6.3 DLQ Consumer 實作](#63-dlq-consumer-實作)
- [七、DLQ 重放機制](#七dlq-重放機制)
  - [7.1 手動重放（Admin API）](#71-手動重放admin-api)
  - [7.2 自動重放（定時任務）](#72-自動重放定時任務)
  - [7.3 批量重放策略](#73-批量重放策略)
- [八、監控與告警](#八監控與告警)
  - [8.1 關鍵監控指標](#81-關鍵監控指標)
  - [8.2 告警規則配置](#82-告警規則配置)
  - [8.3 DLQ Dashboard 設計](#83-dlq-dashboard-設計)
- [九、與 Inbox/Outbox 的整合](#九與-inboxoutbox-的整合)
- [十、常見問題與最佳實踐](#十常見問題與最佳實踐)
  - [10.1 FAQ](#101-faq)
  - [10.2 Best Practices](#102-best-practices)
  - [10.3 反模式（Anti-Patterns）](#103-反模式anti-patterns)
- [十一、總結](#十一總結)

---

## 一、為什麼 Kafka 一定需要 DLQ？

### 1.1 沒有 DLQ 的災難場景

#### 場景：DDA 核心系統當機

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

#### 影響範圍

| 影響層面         | 具體後果                       | 嚴重程度 |
| ---------------- | ------------------------------ | -------- |
| **系統可用性**   | Consumer 完全堵塞，無法處理新事件 | 🔴 P0    |
| **業務連續性**   | 正常交易無法執行               | 🔴 P0    |
| **客戶體驗**     | 交易卡住，客戶無法操作         | 🔴 P0    |
| **運維壓力**     | 需緊急人工介入重啟 Consumer    | 🟡 P1    |
| **資料一致性**   | 可能造成狀態不一致             | 🔴 P0    |

> 💥 **真實案例**：某銀行在 Kafka 上線初期，因下游支付系統故障，單一失敗事件導致整個支付處理鏈路停擺 4 小時，影響 50,000+ 筆交易，造成 P0 生產事故。

### 1.2 DLQ 的核心價值

✅ **隔離失敗事件**：不讓單一壞事件影響整個系統
✅ **保持系統流動**：Consumer 可繼續處理後續正常事件
✅ **可追蹤審計**：所有失敗事件完整記錄，符合金融合規要求
✅ **支援補救**：失敗事件可重放、可人工處理、可補償
✅ **風險可控**：失敗率、失敗原因一目了然，便於改進

---

## 二、銀行級實際場景案例

### 2.1 EARMARK + DDA 扣帳流程

**業務流程**：

```text
EARMARK_REQUESTED → EARMARK_OK → DDA_DEBIT_REQUESTED → DDA_OK → COMPLETED
```

**Kafka 事件範例**：

```json
{
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
```

**事件語意**：額度凍結已成功，可以開始扣帳。

### 2.2 常見失敗場景

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

---

## 三、DLQ 事件分類與處置策略

### 3.1 錯誤類型分類

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

### 3.2 處置決策樹

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

## 四、DLQ 標準設計

### 4.1 DLQ Topic 命名規範

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

### 4.2 DLQ 事件結構

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

### 4.3 DLQ 表結構（資料庫）

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

#### 狀態說明

| replay_status | 說明                   | 下一步                 |
| ------------- | ---------------------- | ---------------------- |
| `PENDING`     | 待重放                 | → REPLAYED / FAILED    |
| `REPLAYED`    | 已成功重放             | （終態）               |
| `FAILED`      | 重放失敗               | → 人工介入             |
| `SKIPPED`     | 標記為跳過（不需重放） | （終態）               |

---

## 五、Retry 策略與 DLQ 配合

### 5.1 重試策略設計

**推薦配置**：

| 錯誤類型             | 重試次數 | 初始延遲 | 最大延遲 | 退避倍數 |
| -------------------- | -------- | -------- | -------- | -------- |
| Transient Error      | 5        | 1s       | 60s      | 2.0      |
| Downstream Timeout   | 3        | 2s       | 30s      | 2.0      |
| Rate Limit           | 10       | 5s       | 300s     | 1.5      |
| Schema Error         | 0        | -        | -        | -        |
| Business Exception   | 0        | -        | -        | -        |
| Poison Message       | 0        | -        | -        | -        |

### 5.2 Exponential Backoff 實作

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

### 5.3 重試決策邏輯

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

## 六、Java 實作範例

### 6.1 基礎版本（簡單 DLQ）

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
        int attemptCount = 0;

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

### 6.2 生產級版本（含分類與告警）

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

### 6.3 DLQ Consumer 實作

```java
@Service
public class DlqConsumer {

    @Autowired
    private DlqRepository dlqRepository;

    @Autowired
    private TicketService ticketService;

    @Autowired
    private NotificationService notificationService;

    @KafkaListener(topics = {
        "dlq-earmark-events-transient",
        "dlq-earmark-events-permanent",
        "dlq-earmark-events-poison",
        "dlq-earmark-events-business"
    })
    public void processDlq(DlqEvent dlqEvent) {
        log.warn("DLQ event received: {}, error type: {}, severity: {}",
                dlqEvent.getDlqId(),
                dlqEvent.getErrorType(),
                dlqEvent.getSeverity());

        // 1. 更新 DLQ 表狀態
        DlqRecord record = dlqRepository.findByDlqId(dlqEvent.getDlqId())
            .orElseGet(() -> createDlqRecord(dlqEvent));

        // 2. 根據錯誤類型處理
        switch (dlqEvent.getErrorType()) {
            case "POISON_MESSAGE":
            case "SCHEMA_ERROR":
                // 毒藥訊息和 Schema 錯誤：創建 P0 工單
                createCriticalTicket(dlqEvent);
                break;

            case "BUSINESS_RULE_VIOLATION":
                // 業務規則拒絕：觸發補償流程
                triggerCompensation(dlqEvent);
                notifyCustomer(dlqEvent);
                break;

            case "DOWNSTREAM_TIMEOUT":
            case "TRANSIENT_ERROR":
                // 暫時性錯誤：標記為待重放
                record.setReplayStatus("PENDING");
                dlqRepository.save(record);
                break;

            default:
                // 未知錯誤：創建工單
                createInvestigationTicket(dlqEvent);
        }

        // 3. 發送通知
        notifyStakeholders(dlqEvent);
    }

    private void createCriticalTicket(DlqEvent dlqEvent) {
        Ticket ticket = Ticket.builder()
            .title("P0: DLQ Critical Event - " + dlqEvent.getErrorType())
            .description(String.format(
                "Event ID: %s\n" +
                "Error Type: %s\n" +
                "Error Message: %s\n" +
                "Failed At: %s\n" +
                "Aggregate ID: %s",
                dlqEvent.getOriginalEventId(),
                dlqEvent.getErrorType(),
                dlqEvent.getErrorMessage(),
                dlqEvent.getFailedAt(),
                dlqEvent.getAggregateId()
            ))
            .priority("P0")
            .assignee("on-call-engineer")
            .category("DLQ_CRITICAL")
            .build();

        ticketService.create(ticket);
    }

    private void triggerCompensation(DlqEvent dlqEvent) {
        // 發送補償事件
        CompensationEvent compensation = CompensationEvent.builder()
            .correlationId(dlqEvent.getOriginalEvent().getCorrelationId())
            .mainRef(dlqEvent.getAggregateId())
            .action("RELEASE_EARMARK")
            .reason(dlqEvent.getErrorMessage())
            .build();

        kafkaTemplate.send("compensation-events", compensation);

        log.info("Compensation triggered for DLQ event {}", dlqEvent.getDlqId());
    }

    private void notifyCustomer(DlqEvent dlqEvent) {
        CustomerNotification notification = CustomerNotification.builder()
            .transactionRef(dlqEvent.getAggregateId())
            .message("Your transaction could not be completed. " +
                    "Reason: " + dlqEvent.getErrorMessage())
            .channel("EMAIL")
            .build();

        notificationService.send(notification);
    }
}
```

---

## 七、DLQ 重放機制

### 7.1 手動重放（Admin API）

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

### 7.2 自動重放（定時任務）

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

### 7.3 批量重放策略

```java
@Service
public class DlqBatchReplayService {

    @Autowired
    private DlqRepository dlqRepository;

    @Autowired
    private KafkaTemplate<String, Event> kafkaTemplate;

    public BatchReplayResult replayByErrorType(
            String errorType,
            LocalDateTime fromDate,
            LocalDateTime toDate) {

        List<DlqRecord> records = dlqRepository.findByErrorTypeAndFailedAtBetween(
            errorType, fromDate, toDate
        );

        return replayBatch(records);
    }

    public BatchReplayResult replayByAggregateId(String aggregateId) {
        List<DlqRecord> records = dlqRepository.findByAggregateIdOrderByFailedAtAsc(
            aggregateId
        );

        return replayBatch(records);
    }

    private BatchReplayResult replayBatch(List<DlqRecord> records) {
        int totalCount = records.size();
        int successCount = 0;
        int failedCount = 0;
        List<String> failedDlqIds = new ArrayList<>();

        for (DlqRecord record : records) {
            try {
                // 重放到原始 topic
                Event originalEvent = fromJson(record.getOriginalPayload(), Event.class);
                kafkaTemplate.send(record.getOriginalTopic(), originalEvent);

                // 更新狀態
                record.setReplayStatus("REPLAYED");
                record.setReplayAt(LocalDateTime.now());
                record.setReplayAttemptCount(record.getReplayAttemptCount() + 1);
                dlqRepository.save(record);

                successCount++;

            } catch (Exception e) {
                log.error("Failed to replay DLQ event {}", record.getDlqId(), e);

                record.setReplayAttemptCount(record.getReplayAttemptCount() + 1);
                record.setReplayResult("Batch replay failed: " + e.getMessage());
                dlqRepository.save(record);

                failedCount++;
                failedDlqIds.add(record.getDlqId());
            }

            // 限流：避免重放過快
            try {
                Thread.sleep(100);  // 每個事件間隔 100ms
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                break;
            }
        }

        return BatchReplayResult.builder()
            .totalCount(totalCount)
            .successCount(successCount)
            .failedCount(failedCount)
            .failedDlqIds(failedDlqIds)
            .build();
    }
}
```

---

## 八、監控與告警

### 8.1 關鍵監控指標

**必須監控的 DLQ 指標**：

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

-- 6. DLQ 老化分析（長期未處理）
SELECT
    error_type,
    COUNT(*) AS aged_count,
    AVG(TIMESTAMPDIFF(HOUR, failed_at, NOW())) AS avg_age_hours,
    MAX(TIMESTAMPDIFF(HOUR, failed_at, NOW())) AS max_age_hours
FROM dlq_event
WHERE replay_status = 'PENDING'
  AND failed_at < NOW() - INTERVAL 24 HOUR
GROUP BY error_type
ORDER BY aged_count DESC;
```

### 8.2 告警規則配置

#### Prometheus Metrics

```java
@Component
public class DlqMetrics {

    private final MeterRegistry meterRegistry;

    @Autowired
    public DlqMetrics(MeterRegistry meterRegistry) {
        this.meterRegistry = meterRegistry;
    }

    public void recordDlqEvent(String errorType, String severity) {
        meterRegistry.counter("dlq.events.total",
                             "error_type", errorType,
                             "severity", severity)
                    .increment();
    }

    public void recordDlqReplay(String status) {
        meterRegistry.counter("dlq.replay.total",
                             "status", status)
                    .increment();
    }

    @Scheduled(fixedDelay = 60000)  // 每分鐘
    public void reportDlqCounts() {
        long pendingCount = dlqRepository.countByReplayStatus("PENDING");
        long p0Count = dlqRepository.countBySeverityAndReplayStatus("P0", "PENDING");
        long p1Count = dlqRepository.countBySeverityAndReplayStatus("P1", "PENDING");

        meterRegistry.gauge("dlq.pending.total", pendingCount);
        meterRegistry.gauge("dlq.pending.p0", p0Count);
        meterRegistry.gauge("dlq.pending.p1", p1Count);
    }
}
```

#### Grafana 告警規則

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

      # 5. DLQ 老化事件
      - alert: DlqAgedEvents
        expr: dlq_pending_total{age_hours=">24"} > 100
        labels:
          severity: info
        annotations:
          summary: "DLQ has aged events"
          description: "{{ $value }} events pending for > 24 hours"
```

### 8.3 DLQ Dashboard 設計

**推薦 Grafana Dashboard 面板**：

1. **總覽面板**：
   - DLQ 事件總數（24h）
   - 待處理 DLQ 數量
   - P0/P1/P2 分布
   - DLQ 增長趨勢圖

2. **錯誤分類面板**：
   - 按錯誤類型分布（餅圖）
   - 各類型趨勢（折線圖）
   - Top 10 錯誤訊息

3. **重放效能面板**：
   - 重放成功率
   - 重放延遲（P99）
   - 重放吞吐量

4. **業務影響面板**：
   - 受影響的 aggregate 數量
   - 高頻失敗的交易
   - 業務分類分布

5. **告警面板**：
   - 當前告警列表
   - 告警歷史
   - P0/P1 事件列表

---

## 九、與 Inbox/Outbox 的整合

### DLQ 在完整架構中的位置

```text
┌────────────────── Service A (Producer) ──────────────────┐
│                                                           │
│  業務邏輯 → Outbox 表 → Outbox Publisher → Kafka Topic   │
│              ↓                                            │
│        (Same DB Tx)                                       │
│              ↓                                            │
│         業務表更新                                        │
└───────────────────────────────────────────────────────────┘
                                ↓
                         Kafka Broker
                                ↓
┌────────────────── Service B (Consumer) ──────────────────┐
│                                                           │
│  Kafka Consumer → Inbox 表 → 業務邏輯處理                │
│                      ↓           ↓                        │
│                (防重檢查)    (可能失敗)                   │
│                      ↓           ↓                        │
│                  已處理過？   處理失敗？                  │
│                      ↓           ↓                        │
│                  跳過     Retry N 次                      │
│                                ↓                          │
│                          仍然失敗？                       │
│                                ↓                          │
│                        ✅ 送 DLQ Topic                    │
│                                ↓                          │
│                        DLQ 表記錄                         │
└───────────────────────────────────────────────────────────┘
                                ↓
                          DLQ Consumer
                                ↓
                ┌───────────────┼───────────────┐
                ↓               ↓               ↓
            創建工單        觸發補償      等待重放
```

### 三者配合的完整流程

```java
@Service
public class IntegratedEventConsumer {

    @Autowired
    private InboxRepository inboxRepo;

    @Autowired
    private DlqService dlqService;

    @Autowired
    private BusinessService businessService;

    @KafkaListener(topics = "earmark-events")
    @Transactional
    public void consume(ConsumerRecord<String, Event> record, Acknowledgment ack) {
        Event event = record.value();

        // 1. Inbox 防重檢查
        try {
            inboxRepo.insert(event.getEventId(), event.getMainRef(),
                            event.getEventType(), "RECEIVED");
        } catch (DuplicateKeyException e) {
            log.info("Duplicate event {}, skipping", event.getEventId());
            ack.acknowledge();
            return;
        }

        // 2. 嘗試處理業務邏輯（含重試）
        int attemptCount = 0;
        Exception lastException = null;

        while (attemptCount < MAX_RETRY) {
            try {
                attemptCount++;
                businessService.process(event);

                // 成功：更新 Inbox 狀態
                inboxRepo.updateStatus(event.getEventId(), "PROCESSED");
                ack.acknowledge();
                return;

            } catch (Exception e) {
                lastException = e;

                if (!shouldRetry(e, attemptCount)) {
                    break;
                }

                // 等待後重試
                Thread.sleep(calculateBackoff(attemptCount));
            }
        }

        // 3. 所有重試失敗，送 DLQ
        dlqService.sendToDlq(record, lastException, attemptCount);

        // 4. 更新 Inbox 為失敗狀態
        inboxRepo.updateStatus(event.getEventId(), "FAILED",
                              lastException.getMessage());

        // 5. Commit offset（避免阻塞後續事件）
        ack.acknowledge();
    }
}
```

---

## 十、常見問題與最佳實踐

### 10.1 FAQ

**Q1: DLQ 的訊息會保留多久？**

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

**Q2: DLQ 事件應該重放到原始 topic 還是專用的 replay topic？**

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

**Q3: 如何避免 DLQ 成為「垃圾桶」？**

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

**Q4: DLQ 重放的順序重要嗎？**

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

**Q5: 如何處理「反覆進 DLQ」的事件？**

A: **建立惡性循環檢測**：

```java
@Service
public class DlqLoopDetector {

    public boolean isInLoop(String eventId) {
        // 檢查該 eventId 是否在 24 小時內進 DLQ 超過 3 次
        long count = dlqRepository.countByOriginalEventIdAndFailedAtAfter(
            eventId,
            LocalDateTime.now().minusHours(24)
        );

        return count > 3;
    }

    public void handleLoopingEvent(DlqEvent dlqEvent) {
        // 1. 標記為「需人工介入」
        dlqEvent.setReplayStatus("MANUAL_REVIEW_REQUIRED");
        dlqRepository.save(dlqEvent);

        // 2. 創建 P0 工單
        ticketService.createLoopingEventTicket(dlqEvent);

        // 3. 告警
        alertService.sendCriticalAlert(
            "Looping DLQ Event Detected",
            "Event " + dlqEvent.getOriginalEventId() +
            " failed multiple times"
        );
    }
}
```

---

### 10.2 Best Practices

#### ✅ 必須做（Must Have）

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

#### ✅ 強烈建議（Should Have）

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

#### ⭕ 可選（Nice to Have）

1. **DLQ Dashboard 視覺化**
   - 便於快速識別問題
   - 支援深入分析

2. **DLQ 事件去重**
   - 避免同一事件多次進 DLQ
   - 節省存儲空間

3. **智能重放策略**
   - 根據系統負載自動調整重放速率
   - 根據下游系統健康狀況決定是否重放

---

### 10.3 反模式（Anti-Patterns）

#### ❌ 絕對不要做

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

## 十一、總結

### 核心價值

DLQ 是 Kafka 事件驅動架構中的 **異常處理中心** 與 **風險控制點**，解決了：
- ✅ 失敗事件隔離，不阻塞正常流程
- ✅ 完整的失敗事件記錄和追蹤
- ✅ 支援重放和補救機制
- ✅ 滿足金融合規和審計要求

### 關鍵要點（記住這五點）

1. **分類處理**：不同錯誤類型採取不同策略（重試 vs 不重試）
2. **完整記錄**：保留原始事件和錯誤上下文，便於排查和重放
3. **監控告警**：P0/P1 事件必須立即告警，DLQ 增長異常必須關注
4. **重放機制**：暫時性錯誤可自動重放，永久性錯誤需人工修正後重放
5. **定期治理**：DLQ 不是垃圾桶，需要定期審查、分析、優化

### 實施檢查清單

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

### 與 Kafka 完整架構的關係

```text
Outbox Pattern  → 確保 DB 更新 + 事件發送的原子性
    ↓
Kafka Topic     → 事件傳遞
    ↓
Inbox Pattern   → 確保事件消費的冪等性
    ↓
Business Logic  → 可能失敗
    ↓
DLQ Pattern     → 隔離失敗事件，保持系統流動性
```

### 一句話總結

> ✅ **DLQ 不是垃圾桶，而是 Kafka 系統的「異常交易處理中心」**
>
> 透過分類、監控、重放機制，確保失敗事件可追蹤、可補救、可審計，
> 同時不影響系統的可用性和業務連續性。

---

## 延伸閱讀

- **Transactional Outbox Pattern**：確保事件發送一致性
- **Inbox Pattern**：確保事件消費冪等性
- **Saga Pattern**：跨服務分散式交易協調
- **Retry 策略設計**：指數退避、Circuit Breaker
- **Kafka Monitoring**：Consumer lag, throughput, error rate

---

## 真實銀行控管模型對照

| Kafka 概念  | 銀行作業          | 說明                           |
| ----------- | ----------------- | ------------------------------ |
| Retry       | 系統自動補送      | 網路抖動、暫時性故障自動重試   |
| DLQ         | 異常交易暫存池    | 失敗交易隔離，等待處理         |
| DLQ 分類    | 異常原因分類      | 系統錯誤 vs 業務拒絕 vs 資料錯誤 |
| DLQ 重放    | 補帳/沖正/重新執行| 修正後重新處理                 |
| DLQ 監控    | 風險通報          | 異常率、失敗原因統計           |
| DLQ 治理    | 異常管理會議      | 定期審查、根因分析、流程改善   |

---

**文檔版本**: v2.0
**最後更新**: 2026-02-09
**文檔狀態**: ✅ 生產就緒（Production Ready）
**適用對象**: Kafka 架構師、後端開發工程師、金融系統開發團隊、運維團隊
**文檔級別**: 🏦 銀行級架構設計標準

**相關文檔**：
- [README-JmsToKafka.md](README-JmsToKafka.md) - 完整的 JMS 到 Kafka 遷移指南
- [README-KafkaInbox.md](README-KafkaInbox.md) - Inbox Pattern 防重機制
- Transactional Outbox Pattern - 事件發送一致性保證
