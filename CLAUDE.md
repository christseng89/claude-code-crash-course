# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Code Crash Course** - a branch-based learning repository designed to teach Claude Code concepts through hands-on examples. Each topic is taught through a separate branch with chronologically ordered commits that guide learners step-by-step.

**Repository Structure:**
- **Main branch**: Landing page, documentation, and two working Next.js applications (hookhub + my-app)
- **Project branches** (`project/*`): Each teaches a specific Claude Code feature through commit-based progression
- **Context engineering examples**: Demonstrates MCP integration and fine-grained configuration

## Getting Started

```bash
# Clone and start
git clone https://github.com/christseng89/claude-code-crash-course.git crash-course
cd crash-course

# Start Claude Code (with GitHub MCP server)
.\start-claude.ps1

# Or without MCP
claude

# Initialize context
/init
```

**GitHub MCP Setup:** To use the GitHub MCP server, copy `.env.example` to `.env` and add your GitHub Personal Access Token. See [GITHUB-MCP-SETUP.md](GITHUB-MCP-SETUP.md).

## Development Commands

### Next.js Applications

**HookHub** (main marketplace app in `hookhub/`):
```bash
cd hookhub
npm install
npm run dev    # http://localhost:3000
npm run build  # Production build
npm run lint   # ESLint check
```

**My-App** (tutorial app in `my-app/`):
```bash
cd my-app
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

### Python Projects

**Text Processor** (root level):
```bash
# Full processing (clean + reformat)
python text_processor.py test.txt

# With output file
python text_processor.py test.txt -o output.txt

# Clean only or reformat only
python text_processor.py test.txt --clean-only
python text_processor.py test.txt --reformat-only
```

**Context Engineering MCP** (`context-engineering-mcp/`):
```bash
cd context-engineering-mcp
uv sync                    # Install dependencies
uv run python main.py      # Run main script
uv run python verbose_mcp_server.py  # Verbose MCP server
```

### Git Branch Navigation

```bash
# List available topic branches
git branch -r | grep project/

# Switch to a topic
git checkout project/custom-commands

# View commits chronologically (learning path)
git log --oneline --reverse

# Step through commits
git checkout <commit_hash>

# Return to main
git checkout main
```

## Architecture & Key Files

### Main Branch Structure

```
crash-course/
├── .claude/
│   ├── commands/              # Custom slash commands
│   ├── skills/                # Custom skills
│   └── settings.local.json    # Permissions & MCP config
├── hookhub/                   # Hook marketplace Next.js app
│   ├── app/
│   │   ├── components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── memory/                # Context documentation
│   │   ├── spec/CLAUDE.md
│   │   └── frontend/CLAUDE.md
│   └── types/hook.ts
├── my-app/                    # Tutorial Next.js app
├── context-engineering-mcp/   # MCP integration examples
│   ├── main.py
│   ├── verbose_mcp_server.py
│   └── pyproject.toml
├── examples/
│   └── context-switch.sh      # Dynamic context loading
├── static/                    # Assets (banner.png)
├── README.md                  # Course landing page
├── README-*.md                # Learning documentation
├── HooksMarketplaceSpecV2.1.md  # Detailed marketplace spec
├── text_processor.py          # Text processing utility
├── .mcp.json                  # MCP server configurations
└── start-claude.ps1           # PowerShell launcher with env
```

### Project Branches

Each `project/*` branch contains:
- Learning progression through commits (view with `git log --oneline --reverse`)
- Branch-specific `.claude/` configurations
- Example code demonstrating the feature
- Optional `CLAUDE.md` with branch-specific instructions

**Available Topics:**
- `project/custom-commands` - Custom slash commands with `$arguments`
- `project/mcp` - Context7 MCP server integration
- `project/context-engineering-mcp` - Fine-grained MCP config with `--mcp-config`
- `project/subagents` - Specialized AI agents (Code Comedy Carl, Mermaid generator)
- `project/hooks-notifications` - Workflow automation with hooks and sound
- `project/hookhub` - Advanced hook management systems
- `project/hookhub2` - Alternative hook implementation
- `project/skills` - Custom skills and extensions
- `project/output-styles` - Output formatting customization

## Custom Commands vs Skills

### Commands (`.claude/commands/*.md`)
- Simple text-based prompt templates
- Use `$arguments` placeholder for user input
- Invoked with `/command-name arguments`
- No tool permission control
- Example: `/dad-joke programming`

### Skills (`.claude/skills/*/SKILL.md`)
- More powerful with YAML frontmatter
- Can specify `allowed-tools` in frontmatter
- Auto-triggered based on description or invoked with `/skill-name`
- Example: `/git-commit`

**Available on Main Branch:**
- Commands: `commit-code`, `dad-joke`
- Skills: `explain-code`, `git-commit`

## MCP Server Configuration

**Enabled Servers** (see `.mcp.json` and `settings.local.json`):
- **weather** - Weather forecasts and alerts
- **puppeteer-mcp-server** - Browser automation and screenshots
- **sequential-thinking** - Step-by-step reasoning for complex problems
- **github** - GitHub API integration (requires `.env` with `GITHUB_PERSONAL_ACCESS_TOKEN`)
- **playwright** - Microsoft Playwright browser automation

**Adding New MCP Servers:**
1. Edit `.mcp.json` to add server configuration
2. Update `enabledMcpjsonServers` array in `settings.local.json`
3. Restart Claude Code
4. Test with relevant MCP tool calls

## Key Development Patterns

### HookHub Application

**Tech Stack:**
- Next.js 16.1.4 with App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

**Architecture:**
- Component-based UI in `app/components/`
- TypeScript types in `types/hook.ts`
- Memory-based context in `memory/spec/` and `memory/frontend/`

**Specification:** See [HooksMarketplaceSpecV2.1.md](HooksMarketplaceSpecV2.1.md) for comprehensive marketplace specification including:
- Hook types and categories
- Card design and layout
- API endpoints
- Security and authentication
- Testing strategy
- Accessibility standards (WCAG 2.1 AA)

### Context Engineering

The `context-engineering-mcp/` directory demonstrates:
- **Fine-grained MCP configuration** using `--mcp-config` flag
- **Verbose MCP server** for debugging MCP interactions
- **Python-based MCP tools** with `uv` dependency management

**Key Files:**
- `main.py` - Example MCP client usage
- `verbose_mcp_server.py` - Debugging MCP server with detailed logging
- `pyproject.toml` - Python dependencies (FastAPI, MCP SDK)

### Text Processing Utility

The `text_processor.py` demonstrates:
- Clean invalid character sequences from text files
- Reformat text with proper paragraph breaks
- CLI argument parsing with `argparse`
- Step-by-step processing pipeline

**Usage Pattern:**
```python
# Full processing pipeline
process_all(input_file, output_file)  # Clean + reformat

# Individual operations
clean_invalid_chars(input_file, output_file)
reformat_text(input_file, output_file)
```

## Permission Management

**Configured Permissions** (in `settings.local.json`):
- Git operations: `checkout`, `stash`, `add`, `commit`, `reset`, `rev-parse`
- npm operations: `audit`, `run build`, `install`
- Python: `python:*`
- Browser automation: Puppeteer and Playwright tools
- Web: `WebFetch` (restricted domains), `WebSearch`
- System: `powershell`, `curl`, `ls`, `xargs`

When adding new workflows requiring tools, add permissions to `settings.local.json`.

## Memory System

**Priority Hierarchy:**
1. Enterprise Policy (highest)
2. `CLAUDE.local.md` (project-specific, git-ignored)
3. `CLAUDE.md` (this file)
4. `.claude/rules/*.md`
5. `~/.claude/CLAUDE.md` (global)
6. Session prompts (lowest)

**Factual Information:** Current session statements override file-based memories.

**Commands:**
- `/memory` - View loaded memory
- `/clear` - Clear conversation history
- `#` - Add temporary session context (e.g., `# use camelCase for Python`)

## Common Workflows

### Adding a New Learning Topic

1. Create `project/<topic-name>` branch from main
2. Add commits in logical progression (one concept per commit)
3. Include `.claude/` configurations relevant to the topic
4. Add example code demonstrating the feature
5. Update main branch README.md topic table
6. Open PR with learning story description

### Creating Custom Commands

1. Create `.claude/commands/<command-name>.md`
2. Write prompt template with `$arguments` placeholder
3. Test with `/command-name test arguments`

Example:
```markdown
# Command Title

Your detailed instructions here.

User input: $arguments

Expected output format...
```

### Creating Custom Skills

1. Create `.claude/skills/<skill-name>/SKILL.md`
2. Add YAML frontmatter with `allowed-tools` and `description`
3. Write detailed instructions
4. Test invocation

Example frontmatter:
```yaml
---
allowed-tools: Bash(git add:*), Bash(git commit:*)
description: Create a git commit
---
```

### Working with Hooks (see project/hooks-notifications branch)

1. Create hook script (bash/python)
2. Add to `.claude/settings.json`:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Write|Edit",
      "hooks": [{"type": "command", "command": "/absolute/path/to/script.sh"}]
    }]
  }
}
```
3. Restart Claude Code
4. Test hook triggers

**Note:** Hooks require absolute paths and need adjustment when cloning the repository.

## Testing Approach

When making changes:
1. **Next.js apps**: Run `npm run lint` before committing
2. **Python code**: Test with example inputs/outputs
3. **Commands/Skills**: Test invocation with various arguments
4. **MCP servers**: Verify with test tool calls
5. **Documentation**: Check markdown formatting and links

## Useful Slash Commands

```bash
/init           # Initialize Claude Code context
/clear          # Clear conversation history
/cost           # Check API usage costs
/config         # View configuration
/agents         # List available agents
/mcp            # View MCP server status
/hooks          # Manage hooks
/skills         # List available skills
/memory         # View loaded memory
/rewind         # Rewind code changes and conversation
/model          # Switch between Claude models
```

## Contributing

When adding content:
1. Fork the repository
2. Create `project/*` branch for new topics
3. Use descriptive commit messages (one concept per commit)
4. Open PR against main branch
5. Update README.md with new topic entry

## Resources

- [Claude Code Documentation](https://code.claude.com/docs/)
- [Course GitHub Repository](https://github.com/christseng89/claude-code-crash-course)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs)
- [Cursor MCP Documentation](https://cursor.com/docs)
- [Udemy Course](https://www.udemy.com/course/claudecode/?referralCode=JAN-2026)
