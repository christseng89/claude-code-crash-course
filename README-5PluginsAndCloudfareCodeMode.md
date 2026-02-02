# Claude Code Plugins

## Plugins Overview

<https://claude.com/blog/claude-code-plugins>

Plugins are a lightweight way to **package and share** any combination of:

- Slash commands: Create custom shortcuts for frequently-used operations
- Subagents: Install purpose-built agents for specialized development tasks
- MCP servers: Connect to tools and data sources through the Model Context Protocol
- Hooks: Customize Claude Code's behavior at key points in its workflow

Plugin marketplaces (similar to Google Gemini Extension) allow developers to share and distribute their plugins to other users. Users can browse, install, and manage plugins directly within Claude Code.

**Examples** of plugins

- <https://github.com/anthropics/claude-code>
- <https://github.com/anthropics/claude-code/blob/main/.claude-plugin/marketplace.json>
- <https://github.com/anthropics/claude-code/tree/main/plugins>
- <https://www.aitmpl.com/plugins>

```bash
claude
/plugin

◯ feature-dev · claude-plugins-official · 63.3K installs
◯ commit-commands · claude-plugins-official · 42.2K installs
   > Install for all collaborators on this repository (project scope)

/exit

claude

What marketplace plugins are enabled in the project?
/feature-dev:feature-dev 

```

## The BAD of MCP

- Context Bloat and “Pollution” - Loading too many tools at once
- Inefficient Execution Loops - Wasting time and resources

For example, consider a multi-step data processing task:

| Step   | What happens             | Context usage |
| ------ | ------------------------ | ------------- |
| Step 1 | Get users (10,000 rows)  | 10%           |
| Step 2 | Filter admins (500 rows) | 30%           |
| Step 3 | Get emails               | 55%           |
| Step 4 | More steps               | 80%           |
| Step 5 | 💥 **Context FULL**      | **100%**      |

- MCP forces LLMs to operate outside their native linguistic training distribution—leading to fragility, cost, and degraded reasoning if overused or poorly designed.  Such as JSON (MCP payloads), tabular data, or code snippets talks to LLM models' native language (natural text, code (python, javaScript), documentations etc.).

### **MCP Server 让 LLM 必须“讲它不熟悉的语言”，而不是它的母语，这会导致性能下降、错误变多、推理质量变差。**

MCP Server 的「工作语言」是

- JSON Schema
- Tool Call 协议
- 结构化参数
- 函数签名
- 严格字段 / enum / 类型

👉 **这些并不是 LLM 的“母语”** => **Machine-friendly ≠ LLM-friendly**

## 正确的 MCP 使用边界（图的隐含结论）

- ✅ 工具 / MCP Server 负责：

  - 过滤
  - 查询
  - 计算
  - 搜索
  - 聚合
  - 验证

- ✅ LLM 负责：

  - 决策
  - 规划
  - 解释
  - 最终判断
  - 少量、语义化结果理解

### ❌ 不要让 LLM去做这些“机器语言”任务

- 扫描 1 万行数据
- 在 JSON 里做推理
- 在多层 schema 中“想问题”

---

## 最终总结（一句话版）

**MCP Server** 迫使 LLM 在它几乎没受过训练的“工具语言”中工作，如果**使用过度或设计不当，会导致脆弱、昂贵、推理能力下降。**

## Cloudflare CODE MODE: HOW IT WORKS

<https://blog.cloudflare.com/code-mode/>

In short, LLMs are better at **writing code to call MCP**, than at calling MCP directly.

### STEP 1: YOU HAVE MCP SERVERS WITH TOOL DEFINITIONS

- **⛅ WEATHER MCP SERVER**

  - Tool: get_weather
  - description: "Get current weather..."
  - parameters: location: string...
  - returns: temperature: number...

- **🗓️ CALENDAR MCP SERVER**

  - Tool: create_event
  - description: "Create a calendar event"
  - parameters: title: string...
  - returns: event_id: string...

↓ Cloudflare Agents SDK auto-converts to TypeScript

### STEP 2: CODE MODE GENERATES TYPESCRIPT API (injected into LLM context)

<https://blog.cloudflare.com/code-mode/#converting-mcp-to-typescript>

```typescript
declare const codemode: {
  /** Get current weather... */
  get_weather: (input: { location: string; ... }) => Promise
    { temperature: number; ... }>;
  
  /** Create a calendar event */
  create_event: (input: { title: string; ... }) => Promise
    { event_id: string; ... }>;
};
```

↓ User asks: "If it's sunny in Austin tomorrow, schedule a picnic at 2pm"

### STEP 3: LLM WRITES CODE (not tool calls!)

- **TRADITIONAL WAY**
(multiple round-trips)
  - LLM → tool_call: get_weather
    ← result: {...}
  - LLM → (thinks...)
  - LLM → tool_call: create_event
    ← result: {...}
  - LLM → (formats...)

  4 round-trips...

- **CODE MODE**
(single execution)

```javascript
// LLM writes this code:
const weather = await codemode.get_weather({...});
if (weather.conditions === 'sunny') {
  const event = await codemode.create_event({...});
  
  console.log('Scheduled!', event);
}
else {
  console.log('Too cloudy, sorry');
}

// Runs in V8 JavaScript Engine isolate sandbox
```

Only **1 round-trip** to LLM!

### STEP 4: CODE RUNS IN SECURE SANDBOX

<https://blog.cloudflare.com/code-mode/#running-code-in-a-sandbox>

- **V8 JavaScript Engine ISOLATE SANDBOX**

  - [LLM's TypeScript Code]
  - codemode.get_weather(...)
  - codemode.create_event(...)
  - console.log(result)

  RPC =>
  ↓ Agent Loop (holds API keys)
  ↓ Returns to user

- No internet access
- Only MCP bindings
- No API keys exposed
- Starts in milliseconds
- Low MB memory
- Disposable per-request

## WHY THIS WORKS BETTER

LLMs have seen:

- **Millions of real TypeScript projects** from GitHub, etc.
↓
**CODE MODE uses this!**

- **Small set of contrived tool-call training examples**
↓
**TRADITIONAL MCP uses this!**

### 什么是 CODE Mode（代码模式）？

**CODE Mode** 是 **Cloudflare** 推出的一种新型 AI 代理执行方式。与传统的"工具调用"方式不同，它让 LLM（大语言模型）直接**编写并执行代码**来调用工具，而不是进行多次往返的工具调用。

#### 核心区别

传统方式：LLM → 调用工具 → 等待结果 → 再调用工具 → 等待结果...（需要多次往返）
CODE Mode：LLM → 编写完整的 TypeScript 代码 → 一次性执行所有逻辑（只需一次往返）

### 真实世界例子：智能旅行助手 🌏

**场景**：你在计划去北京旅行

**你的请求**：
> "如果明天北京天气晴朗且气温高于20度，帮我预订故宫门票，并在日历上安排上午9点参观。如果下雨，就改订国家博物馆的票。"

#### 传统工具调用方式（需要4-6次往返）：

1. LLM：调用 `get_weather("北京")`
2. 系统：返回天气数据
3. LLM：分析数据，决定下一步
4. LLM：调用 `book_ticket("故宫")`
5. 系统：返回预订结果
6. LLM：调用 `create_calendar_event(...)`
7. 系统：返回日历事件
8. LLM：格式化最终回复

⏱️ **耗时**：可能需要10-20秒

#### CODE Mode 方式（只需1次往返）

LLM 直接编写这段代码：

```typescript
// LLM 生成的代码
const weather = await codemode.get_weather({ city: "北京" });

if (weather.condition === "晴天" && weather.temperature > 20) {
  // 天气好 - 去故宫
  const ticket = await codemode.book_ticket({
    attraction: "故宫",
    date: "明天",
    quantity: 1
  });
  
  const event = await codemode.create_calendar_event({
    title: "参观故宫",
    time: "明天 09:00",
    location: "北京故宫博物院",
    notes: `门票号：${ticket.id}`
  });
  
  console.log(`✅ 已预订故宫门票，已添加到日历`);
} else {
  // 天气不好 - 去博物馆
  const ticket = await codemode.book_ticket({
    attraction: "国家博物馆",
    date: "明天"
  });
  
  console.log(`🌧️ 天气不佳，已改订国家博物馆门票`);
}
```

这段代码在安全的沙箱环境中**一次性执行完成**！

⏱️ **耗时**：可能只需要2-3秒

---

### 为什么 CODE Mode 更好？

1. **更快** - 一次往返 vs 多次往返
2. **更智能** - LLM 在数百万真实 TypeScript 项目上训练过，编写代码比学习特定工具调用格式更自然
3. **更安全** - 代码在隔离的 V8 沙箱中运行，无法访问互联网，不会暴露 API 密钥
4. **更灵活** - 可以处理复杂的条件逻辑、循环、错误处理等

这就像是让 AI 从"填空题"升级到"编程题" - 它能表达更复杂的逻辑！

## Traditional MCP vs Code Mode - 架构对比图

### **Traditional MCP**（传统 MCP）

```flow
LLM ←→ Agent (Worker) ←→ MCP server
```

**流程：**

1. **MCP server → Agent**: Provides tool schemas（提供工具模式）
2. **Agent → LLM**: Provides "functions" matching MCP tools（提供匹配 MCP 工具的"函数"）
3. **LLM → Agent**: Outputs special text sequences to express function invocations（输出特殊文本序列来表达函数调用）
4. **Agent → MCP server**: Calls MCP tools（调用 MCP 工具）

---

### **Code Mode**

```flow
LLM ←→ Agent (Worker) ←→ MCP server
         ↓           ↑
    Dynamic Isolate Sandbox
```

**流程：**

1. **MCP server → Agent**: Provides tool schemas（提供工具模式）
2. **Agent → LLM**: Provides TypeScript API matching MCP tools（提供匹配 MCP 工具的 TypeScript API）
3. **LLM → Agent**: Writes code against API（编写针对 API 的代码）
4. **Agent → Sandbox**: Executes code in sandbox（在沙箱中执行代码）
5. **Sandbox → Agent**: Calls RPC bindings provided by agent（调用代理提供的 RPC 绑定）
6. **Agent → MCP server**: Calls MCP tools（调用 MCP 工具）

---

## 关键区别：

| **Traditional MCP** | **Code Mode** |
|---------------------|---------------|
| LLM 输出特殊文本格式来调用工具 | LLM 编写真实的 TypeScript 代码 |
| 每次工具调用需要一次往返 | 代码在沙箱中连续执行多个工具调用 |
| Agent 直接解析和执行工具调用 | Agent 先在隔离沙箱中执行代码 |
| 没有沙箱层 | 有 **Dynamic Isolate Sandbox** 安全层 |

**Code Mode 的优势**体现在步骤 4-5：代码可以在沙箱中**一次性执行复杂逻辑**（包括条件判断、循环、错误处理等），而不需要每次都回到 LLM。 这就是为什么 Code Mode 能实现"**单次往返**"完成复杂任务！
