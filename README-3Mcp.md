# MCP (Multi-Client Protocol) Overview

## MCP Introduction

<https://modelcontextprotocol.io/docs/getting-started/intro>
<https://modelcontextprotocol.io/docs/sdk>

🟦 MCP HOSTS
──────────────────
🤖 Claude Desktop  ─🟣 MCP Client ─┐                        ┌─── 🟥 MCP Server A ───▶ ☁️ Google Drive
💻 IDE             ─🟣 MCP Client ─┼── 🟡 MCP Protocol ──▶ ├─── 🟥 MCP Server B ───▶ 🐘 PostgreSQL DB
🛠️ AI Tools        ─🟣 MCP Client ─┘                        └─── 🟥 MCP Server C ───▶ 🌐 Web APIs
                                                                                              ├─ 🐙 GitHub
                                                                                              ├─ 💬 Slack
                                                                                              └─ 🌍 Internet
──────────────────

### Example Uber Eat MCP

<https://github.com/ericzakariasson/uber-eats-mcp-server>

## Config Context7 MCP Server

Up-to-date Code Docs For Any Prompt, Context7 MCP pulls up-to-date, version-specific documentation and code examples straight from the source — and places them directly into your prompt.

<https://context7.com/>
<https://github.com/upstash/context7>
<https://github.com/upstash/context7?tab=readme-ov-file#installation>

```bash
claude
how to add context7 mcp server?
```

```plaintext
  Create or edit .mcp.json in your project root:

  {
    "mcpServers": {
      "context7": {
        "type": "http",
        "url": "https://mcp.context7.com/mcp"
      }
    }
  }

```

### Install Context7 MCP Skill

<https://context7.com/docs/clients/claude-code>

```bash
npx ctx7 skills install <owner/repo>

#claude mcp add --header "CONTEXT7_API_KEY: YOUR_API_KEY" --transport http context7 https://mcp.context7.com/mcp
claude mcp add --transport http context7 https://mcp.context7.com/mcp --help
claude mcp add --transport http context7 https://mcp.context7.com/mcp --scope project

```

### Use Context7 MCP Skill

```bash
/exit

claude
/mcp

 ❯ context7 · ✔ connected
   github · ✔ connected
   playwright · ✔ connected
   ... other MCP servers

How do I set up Next.js 14 middleware? use context7  
How to use Claude Code Skills via context7?
What is the latest LangGraph version using context7?
What is the latest Claude Code version using context7   
# Every time I ask LangGraph related questions, use context7

/exit
claude

What is LangGraph interrupt?
/clear
```
