# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Code Crash Course** — a branch-based learning repository where each `project/*` branch teaches one Claude Code feature through chronologically ordered commits. The **main branch** contains two working Next.js apps (`hookhub/`, `my-app/`), Python examples, and learning documentation (`README-*.md`).

**Branch navigation pattern:**
```bash
git branch -r | grep project/         # List all topic branches
git checkout project/<topic>          # Switch to a topic
git log --oneline --reverse           # View learning progression
git checkout <commit-hash>            # Step through commits
```

## Development Commands

### HookHub (primary Next.js app)
```bash
cd hookhub
npm run dev                   # http://localhost:3000
npm test                      # Run tests (must pass before committing)
npm run test:coverage         # Must stay above 90% coverage threshold
npm run lint
```

HookHub is a hook marketplace with a strict 90% test coverage requirement. See `hookhub/CLAUDE.md` for component architecture.

### Context Engineering MCP
```bash
cd context-engineering-mcp
uv sync                                        # Requires Python >=3.11 + uv
uv run python verbose_mcp_server.py            # Verbose MCP server at http://127.0.0.1:8000/mcp
claude --mcp-config .mcp.json.verbose          # Start Claude with fine-grained MCP config
```

### Python Examples
```bash
python fibonacci.py                            # Recursive / iterative / memoized comparison
python text_processor.py test.txt --clean-only # Clean invalid chars; --reformat-only also available
python debug_pattern.py                        # Demonstrates text cleaning debug patterns
python ragas_example.py                        # RAG evaluation with RAGAS framework
```

## Architecture

### Settings Hierarchy
- `.claude/settings.json` — project defaults (committed to git)
- `.claude/settings.local.json` — local overrides (git-ignored, user-specific; put personal permissions here)

MCP servers are configured in `.mcp.json`. Only `sequential-thinking` is enabled by default; enable others via `enabledMcpjsonServers` in `settings.local.json`. Context7 comes from the `context7@claude-plugins-official` plugin, not a standalone MCP entry.

### Custom Tooling (`.claude/`)
- **Agents** (`.claude/agents/`) — invoked with `@agent-name` or automatically dispatched
- **Commands** (`.claude/commands/`) — invoked with `/command-name $arguments`
- **Skills** (`.claude/skills/*/SKILL.md`) — have YAML frontmatter with `allowed-tools`; use `/skill-name`
- **Output styles** (`.claude/output-styles/`) — use `/style` to switch

Commands are simple prompt templates; skills are more powerful and can restrict tool access. The majority of available skills come from installed marketplace plugins (see `settings.json` `plugins` key).

### Progressive Skill Disclosure
Skills load in three layers to conserve context tokens: (1) name/description preloaded, (2) full SKILL.md loaded on relevance, (3) reference files loaded on demand.

### Key Directories
- `OpenClaw/` — Documentation for the OpenClaw multi-agent orchestrator framework (LLM Brain + sub-agents pattern)
- `context-engineering-mcp/` — Fine-grained MCP config examples with verbose debugging server
- `OwsapZap/` — OWASP ZAP via Docker Compose (headless on port 8086, browser GUI on port 8096)
- `examples/context-switch.sh` — Dynamic context loading based on task type

## Learning Documentation

Root-level `README-*.md` files form the course curriculum:

| File | Topic |
|------|-------|
| `README-1GistOfClaudeCode.md` | Claude Code fundamentals |
| `README-2ClaudeSlashCommands.md` | Slash commands |
| `README-2Skills.md` | Skills system |
| `README-3Mcp.md` | MCP basics |
| `README-4ContextEngineering.md` | Context management |
| `README-5PluginsAndCloudfareCodeMode.md` | Plugins and cloud |
| `README-6AdvancedWorkflow.md` | Plan mode + HookHub case study |
| `README-7Subagents.md` | Subagent architecture |
| `README-8OutputStyles.md` | Output styles + statusline |
| `README-9Skills.md` | Skills + marketplace + progressive disclosure |
| `README-A.0DeepAgents.md` | Deep agents overview |
| `README-A.1DeepAgents_ClaudeCode.md` | Claude Code deep agent architecture |
| `README-AIStages.md` | AI stages: chatbot → multi-agent systems |
| `README-BClaudeCowork.md` | Claude Chrome extension cowork patterns |
| `README-CAiEssentials.md` | Traditional AI vs Generative AI |
| `README-EvaluateRAG-RAGAS.md` | RAG evaluation with RAGAS framework |
| `RAG-architecture.md` / `RAG-Flow-Diagram.md` | RAG pipeline architecture |
| `ComplianceCheckGuidance.md` | Banking compliance enterprise use case |
| `HooksMarketplaceSpecV2.1.md` | Full HookHub specification |

`OpenClaw/` contains supplementary docs on the OpenClaw orchestrator framework (multi-agent coordination patterns).

## GitHub MCP Setup

```bash
# Windows PowerShell
$env:GITHUB_PERSONAL_ACCESS_TOKEN = "your_token_here"
claude
```

See `GITHUB-MCP-SETUP.md` for full token creation steps. The `.env` file (git-ignored) can hold `GITHUB_PERSONAL_ACCESS_TOKEN` for persistence.

## Platform Notes (Windows)

- MCP commands in `.mcp.json` use `cmd /c` prefix
- `nul` file in root is Windows null device output artifact (gitignored)
- Use Unix shell syntax (forward slashes, `/dev/null`) in bash commands within Claude Code
