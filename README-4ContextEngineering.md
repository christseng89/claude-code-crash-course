# New File: README-ContextEngineering.md

## Context Engineering

CONTEXT WINDOW (Limited & Expensive)

GOOD CONTEXT             vs           BAD CONTEXT
✓ Fast Performance                    ✗ Poor Performance
✓ Accurate Results                    ✗ Wasted Tokens
✓ Lower Cost                          ✗ Higher Latency/Cost

### 📄 Extracted Text (Preserved Layout)

```md
CONTEXT WINDOW (200k tokens)

[███████████████████████████████████████████░░░░░░░░░]
 ↑ MCP Tools (50k+ tokens)                  ↑ Actual Work (150k tokens)

WASTED BEFORE YOU EVEN START! 😱

Tools Loaded but NOT Used:

[ Tool1 ]   [ Tool2 ]   [ Tool3 ]   [ Tool4 ]   [ Tool5 ]
    ✗          ✗          ✗          ✗          ✗

[ Tool6 ]   [ Tool7 ]   [ Tool8 ]   [ Tool9 ]   [  ...  ]
    ✗          ✗          ✗          ✗          ✗
```

---

### 🧠 Why This Matters

#### 1️⃣ Context Window Is **Limited & Expensive**

* The LLM has a fixed **context window** (here: **200k tokens**)
* Every token used:

  * Costs money 💰
  * Increases latency ⏳
  * Reduces room for real reasoning

---

#### 2️⃣ MCP Tools Are Loaded **Before Any Work Starts**

* MCP tools + schemas + descriptions can consume:

  * **50k+ tokens**
* This happens **even if the tools are never called**

Result:

> ⚠️ **25% of your context is gone before the model reasons at all**

---

#### 3️⃣ “Actual Work” Gets Squeezed

* Only **150k tokens** remain for:

  * User input
  * Reasoning
  * Planning
  * Output

Which leads to:

* Shorter reasoning chains
* Less accurate answers
* More hallucinations

---

#### 4️⃣ Unused Tools = Wasted Tokens

All of these:

```md
Tool1, Tool2, Tool3, Tool4, Tool5, Tool6, Tool7, Tool8, Tool9, ...
```

❌ Were **loaded**
❌ Were **never used**
❌ Still consumed tokens

That’s **pure waste**.

---

### 🚨 Core Message of the Diagram

> **More tools ≠ better AI**
> **Right tools, loaded at the right time = better AI**

---

## ✅ MCP Servers Best Practices

### ✔ Lazy-load tools

Only load MCP tools **when needed**

### ✔ Split MCP servers by domain

* Docs MCP
* DB MCP
* Web MCP
* Code MCP

### ✔ Context minimization

* Smaller schemas
* Short tool descriptions
* No “always-on” tools

---

## 🧩 Why This Is Especially Relevant to MCP

MCP makes tool usage easy — but:

> ❗ MCP does **not** automatically solve context bloat
> ❗ Tool orchestration still matters

This diagram is warning against:

* “Connect everything” MCP servers
* Overloaded tool registries
* One giant agent with all tools

---

## 🧠 One-Sentence Summary

> If you load 50k tokens of tools you don’t use **before running a simple prompt**, you’ve already wasted context, money, and reasoning capacity before the AI even starts thinking.

---

## The Core Problem (.mcp.json)

If 50k tokens of unused tools are loaded before executing even a simple prompt, context, cost, and reasoning capacity are already wasted before the model begins processing.

## Hands on

```bash
cd context-engineering-mcp
uv sync
uv run verbose_mcp_server.py

source .venv/Scripts/activate

fastmcp --help
fastmcp run verbose_mcp_server.py --transport http

```

```json (.mcp.json in parent directory)
      "verbose-server": {
        "type": "http",
        "url": "http://127.0.0.1:8000/mcp"
      },
```

```bash
cd context-engineering-mcp
claude --mcp-config ../.mcp.json

/mcp
/context

```

```md
⎿  Context Usage
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁   claude-sonnet-4-5-20250929 · 50k/200k tokens (25%)                                       
     ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛁ ⛀ ⛁ ⛁                                                                                            
     ⛁ ⛁ ⛁ ⛁ ⛀ ⛀ ⛀ ⛶ ⛶ ⛶   Estimated usage by category                                                                   ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System prompt: 2.8k tokens (1.4%)            
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ System tools: 16.6k tokens (8.3%)                                                      
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ MCP tools: **17.1k** tokens (8.5%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Memory files: 13.0k tokens (6.5%)
     ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶ ⛶   ⛁ Skills: 386 tokens (0.2%)
     ⛶ ⛶ ⛶ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛁ Messages: 8 tokens (0.0%)
     ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝ ⛝   ⛶ Free space: 117k (58.6%)
                           ⛝ Autocompact buffer: 33.0k tokens (16.5%)

     MCP tools · /mcp
     └ mcp__verbose-server__add_two_numbers: 327 tokens
     └ mcp__verbose-server__subtract_two_numbers: 364 tokens
     └ mcp__verbose-server__multiply_two_numbers: 439 tokens
      ...
     └ mcp__playwright__browser_tabs: 154 tokens
     └ mcp__playwright__browser_wait_for: 152 tokens

```

```bash
# Option 1
/exit
claude --mcp-config ../.mcp.json.verbose --strict-mcp-config
/mcp
/context

# Option 2
/exit
claude --mcp-config ../.mcp.json --strict-mcp-config

/mcp

   Built-in MCPs (always available)
 ❯ context7 · ✔ connected
   github · ✔ connected
   playwright · ✔ connected
   verbose-server · ✔ connected

 ❯ 3. Disable  

   Built-in MCPs (always available)
 ❯ context7 · ◯ disabled
   github · ◯ disabled
   playwright · ◯ disabled 
   verbose-server · ✔ connected    

/exit

claude --mcp-config ../.mcp.json 
/mcp
/context    
```
