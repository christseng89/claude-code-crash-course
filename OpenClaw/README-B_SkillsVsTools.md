# OpenClaw Skills vs Tools（本質差別）

## 🧠 一、Tools vs Skills（本質差別）

### 🔧 Tools = 能力（能不能做）

👉 類似「系統底層能力 / API / OS 能力」

| 類型    | 說明          |
| ----- | ----------- |
| exec  | 執行命令（shell） |
| read  | 讀檔          |
| write | 寫檔          |
| http  | 呼叫 API      |
| db    | 存取資料庫       |

👉 如果沒有 tool：

```text
Agent = 只會說話，不會做事 ❌
```

👉 有 tool：

```text
Agent = 可以操作世界（檔案 / 系統 / API） ✅
```

---

### 📘 Skills = 流程（怎麼做）

👉 類似「業務邏輯 / SOP / Playbook」

| 類型           | 說明                    |
| ------------ | --------------------- |
| gmail skill  | 如何讀信 → 判斷 → 回信        |
| report skill | 收集資料 → 整理 → 產出報告      |
| deploy skill | build → test → deploy |

👉 Skill 本質：

```text
「教 Agent 如何組合 Tools 完成任務」
```

---

## 🔥 一句話理解

> **Tools = 手腳（能做什麼）**
> **Skills = 方法（怎麼做）**

---

## 🧩 二、用你「智能審單」場景對應

### Tools（底層能力）

* OCR API
* DB 查詢
* 文件讀寫
* LLM call
* HTTP API

---

### Skills（業務流程）

#### 🧾 審單 Skill

```text
1. 讀文件
2. OCR
3. 抽欄位
4. 比對 LC 條款
5. 呼叫 LLM 判斷
6. 產生 discrepancy report
```

👉 這就是 Skill

---

## 🏗️ 三、OpenClaw 檔案結構（重點）

### 📁 基本結構

```text
.openclaw/
│
├── config.json
├── memory/
├── logs/
│
└── workspace/
    │
    ├── AGENTS.md
    ├── SOUL.md
    ├── IDENTITY.md
    ├── HEARTBEAT.md
    │
    ├── skills/           ← ⭐ Skills 在這
    │   ├── gmail.md
    │   ├── report.md
    │   └── doc-check.md
    │
    ├── tools/            ← ⭐ Tools 在這（或由系統提供）
    │   ├── exec/
    │   ├── fs/
    │   ├── http/
    │   └── custom/
    │
    └── knowledge/
        ├── lc-rules.md
        └── discrepancy-cases.md
```

---

## 🔧 四、Tools 實際長怎樣？

### Tool（系統層）

通常不是你寫 `.md`，而是：

* 內建（exec / read / write）
* 或 MCP server 提供
* 或 plugin

例如：

```text
exec.run("ls -al")
read.file("invoice.pdf")
http.get("api.bank.com")
```

👉 Tools = function call / capability

---

## 📘 五、Skills 實際長怎樣？

### Skill = Markdown（最關鍵）

例如：

```md
# doc-check skill

## Goal
Perform document checking for LC transactions

## Steps
1. Read documents from workspace
2. Use OCR to extract text
3. Extract key fields (amount, date, beneficiary)
4. Compare with LC terms
5. Use LLM for discrepancy reasoning
6. Generate report

## Tools required
- read
- exec
- http
```

👉 Skill = Prompt + Workflow + SOP

---

## 🔥 六、Tools vs Skills 關係（最重要）

```text
        Skills（大腦）
           ↓
    組合 / 編排
           ↓
        Tools（手腳）
```

---

## 🧠 七、常見錯誤（很多人會踩）

### ❌ 錯誤 1：只有 Skill 沒 Tool

```text
寫了一個很漂亮的 skill
但沒有 exec / read / write

👉 Agent 什麼都做不了
```

---

### ❌ 錯誤 2：只有 Tool 沒 Skill

```text
有一堆工具
但沒有流程

👉 Agent 不知道怎麼用
```

---

### ❌ 錯誤 3：把 Skill 當 Tool

👉 Skill 是流程，不是能力

---

## 🚀 八、進階（你這種架構會用到）

你可以做到：

### 1️⃣ Skill = 子 Agent

```text
doc-check skill → 一個 agent
report skill → 一個 agent
monitor skill → 一個 agent
```

👉 這就是你之前說的：

> planner + executor + validator

---

### 2️⃣ Tool = MCP Server

例如：

* OCR server
* Banking API
* Risk engine

---

## 🎯 九、最佳實務（給你）

### Tools 層

* 保持通用（exec / http / db）
* 不寫業務邏輯

### Skills 層

* 寫清楚 SOP
* 可拆分（小 skill）
* 可重用

---

## ✅ 十、最終總結

👉 在 OpenClaw：

| 項目     | 本質       | 形式             |
| ------ | -------- | -------------- |
| Tools  | 能力（能做什麼） | API / function |
| Skills | 流程（怎麼做）  | Markdown       |

---

## 🔥 一句話（幫你記）

> **Tools 是「能力」，Skills 是「智慧」**

---

## 🧠 十一、對你專案的建議

👉 **「智能審單 Skills 架構（可直接落地）」**

包含：

* doc-check skill
* discrepancy skill
* report skill
* monitoring skill（Heartbeat）

👉 會非常貼合你現在這個專案 👍
