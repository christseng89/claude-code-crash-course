# OpenClaw 安全指南

## **The 5 Essential Security Settings**

### **1. Set LLM Spending Limits**

Agent errors can cause infinite loops. Set hard caps at the provider level.

---

### **2. Enable Exec Approval Mode**

Every shell command requires your manual confirmation before execution.

---

### **3. Use Tool Allowlists**

Only enable the specific tools your agent actually needs.

---

### **4. Configure Sender Restrictions**

Only authorized users can message your agent.

---

### **5. Network Isolation**

Run on a dedicated machine or VM. Never on your primary personal computer.

---

## Configuration Checklist

很好 👍 這 5 個安全設定其實就是把 OpenClaw 從「玩具」變成「企業級 Agent 平台」的關鍵。
我直接給你 **可落地（Windows + 內網 + 你現在架構）實作方式**。

---

### 🔐 1️⃣ Set LLM Spending Limits（最重要）

👉 這個不是 OpenClaw 設，而是 **模型供應商層設定**

---

#### ✅ Anthropic（Claude）

👉 進： <https://console.anthropic.com>

路徑：

```menu
Settings → Billing → Spending Limits
```

設定：

```text
Hard Limit: $20 / month（建議）
Soft Alert: $10
```

---

#### ✅ OpenAI

👉 進： <https://platform.openai.com>

路徑：

```menu
Billing → Usage Limits
```

---

### 🔥 企業建議（你這種場景）

```text
Dev: $10
Test: $20
Prod: $50（或按部門）
```

👉 避免 infinite loop（Agentic AI 很容易踩）

---

### 🔧 2️⃣ Enable Exec Approval Mode

👉 防止 agent 自動執行危險命令（rm / del / curl 等）

---

#### ✅ config.json 設定

```json
{
  "tools": {
    "exec": {
      "enabled": true,
      "approval": "manual"
    }
  }
}
```

---

#### 🧠 效果

```text
Agent 想執行：
rm -rf /

👉 會變成：

⚠️ Approve this command? (y/n)
```

---

#### 🚀 進階（企業）

```json
{
  "tools": {
    "exec": {
      "approval": "manual",
      "deny": ["rm", "del", "format"],
      "allow": ["dir", "ls", "echo"]
    }
  }
}
```

---

### 🧰 3️⃣ Use Tool Allowlists（白名單）

👉 原則：**最小權限**

---

#### ✅ config.json

```json
{
  "tools": {
    "enabled": true,
    "allow": ["read", "write", "http"],
    "deny": ["exec"]
  }
}
```

---

#### 🔥 你這個項目建議

##### 智能審單：

```json
{
  "tools": {
    "allow": ["read", "write", "http"],
    "deny": ["exec"]
  }
}
```

👉 不需要 shell，就不要開

---

#### 🧠 關鍵觀念

```text
Tool = attack surface
```

👉 越少越安全

---

### 👤 4️⃣ Configure Sender Restrictions

👉 防止「誰都可以控制你的 agent」

---

#### 方法 1️⃣（簡單版：API Gateway）

👉 在你外層加一層：

* NGINX / API Gateway
* JWT / Token 驗證

---

### 範例（NGINX）

```nginx
location /openclaw {
    if ($http_authorization != "Bearer SECRET_TOKEN") {
        return 403;
    }
}
```

---

#### 方法 2️⃣（企業版）

👉 整合：

* Keycloak / Azure AD / LDAP

---

#### 方法 3️⃣（簡單內網）

👉 config.json 加：

```json
{
  "auth": {
    "token": "internal-secret-key"
  }
}
```

---

### 🌐 5️⃣ Network Isolation（強烈建議）

👉 這是你這個專案最應該做的

---

#### ❌ 不建議

```text
直接跑在你筆電
```

---

#### ✅ 建議架構

```text
[User]
   ↓
[Gateway / API]
   ↓
[OpenClaw VM / Container]
   ↓
[LLM / Tools]
```

---

#### 🧱 Windows 簡單做法

##### 方法 1️⃣ VM（推薦）

* Hyper-V / VMware
* 建一台 VM 跑 OpenClaw

---

##### 方法 2️⃣ Docker

```bash
docker run -d \
  --name openclaw \
  --network internal_net \
  openclaw
```

---

##### 方法 3️⃣ 內網隔離

```text
OpenClaw Server:
- 無外網
- 只允許內部 API
```

---

### 🔥 企業級（你適合）

```text
Kubernetes + NetworkPolicy
```

---

### 🧠 最佳實務（你這個場景）

#### 🔐 安全配置總結

```json
{
  "tools": {
    "allow": ["read", "write", "http"],
    "exec": {
      "enabled": false
    }
  },
  "auth": {
    "token": "internal-secret"
  }
}
```

---

### 📊 你這種智能審單系統

👉 建議：

| 項目         | 建議          |
| ---------- | ----------- |
| exec       | ❌ 關閉        |
| http       | ✅ 開         |
| read/write | ✅ 開         |
| LLM limit  | ✅ 必設        |
| network    | VM / K8s    |
| auth       | API Gateway |

---

### 🚀 Bonus（你會用到）

#### 加一層「Agent Guard」

👉 Validator Agent（你前面講的）

```text
User → Agent → Validator → Tools
```

👉 防止：

* prompt injection
* 錯誤操作
* 資料外洩

---

### 🎯 最終總結

👉 這 5 個安全設定對應：

| 安全項目               | 本質    |
| ------------------ | ----- |
| Spending limit     | 防爆錢   |
| Exec approval      | 防亂操作  |
| Tool allowlist     | 防過度權限 |
| Sender restriction | 防未授權  |
| Network isolation  | 防整體風險 |

---

### 🔥 一句話（幫你記）

> **Agent 不可怕，可怕的是給它太多權限 + 沒有限制**

---
