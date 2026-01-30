# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Code Crash Course** - a branch-based learning repository designed to teach Claude Code concepts through hands-on examples. Each topic is taught through a separate branch with chronologically ordered commits that guide learners step-by-step.

## Getting Started

When first working with this repository:

```bash
# Clone the repository
git clone https://github.com/christseng89/claude-code-crash-course.git crash-course
cd crash-course

# Start Claude Code
claude

# Or, to use GitHub MCP server (requires .env setup):
.\start-claude.ps1

# Initialize Claude Code context (recommended)
/init
```

The `/init` command analyzes the codebase and creates [CLAUDE.md](CLAUDE.md) (this file) to help Claude understand the repository structure and conventions.

**Note:** To use the GitHub MCP server, you'll need to set up a `.env` file with your GitHub token. See the [GitHub MCP Server Setup](#github-mcp-server-setup) section below.

## Repository Architecture

### Branch-Based Learning Structure

The repository uses a unique educational pattern:

1. **Main branch** - Landing page with course overview, topic index, and two working Next.js applications
2. **Project branches** (`project/*`) - Each branch teaches a specific Claude Code feature
3. **Commit-based progression** - Within each branch, commits are ordered chronologically to create a learning path

**Available Learning Topics:**

- `project/custom-commands` - Custom slash commands (dad jokes, automated commits)
- `project/mcp` - Model Context Protocol integration with Context7 MCP server
- `project/context-engineering-mcp` - Fine-grained MCP configuration using `--mcp-config` flag
- `project/subagents` - Specialized AI agents (Code Comedy Carl, Mermaid diagram generator)
- `project/hooks-notifications` - Workflow automation with hooks and sound notifications
- `project/hookhub` - Advanced hook management systems
- `project/hookhub2` - Alternative hook management implementation
- `project/skills` - Custom skills and extensions
- `project/output-styles` - Customizing Claude Code output formatting

### Working with the Repository

**Switching between topics:**
```bash
# View available branches
git branch -r | grep project/

# Check out a topic branch
git checkout project/custom-commands

# View commits in chronological order
git log --oneline --reverse

# Step through commits
git checkout <commit_hash>
```

**Important:** The `main` branch contains:
- Course overview documentation
- Two working Next.js applications: `hookhub/` (hook marketplace) and `my-app/` (created during tutorials)
- Examples of custom commands and skills
- MCP server configurations

When switching between branches, be aware that:
- `.claude/` directory contents change per branch
- Some branches have Python code examples (e.g., `project/subagents` has `main.py`)
- Some branches include MCP configurations (e.g., `project/mcp` has `.mcp.json`)

## Branch-Specific Configurations

### project/custom-commands

**Key Files:**
- `.claude/commands/commit-code.md` - Smart git commit command using `$arguments`
- `.claude/commands/dad-joke.md` - Dad joke generator command

**Permissions:** Configured for git operations (`git checkout`, `git stash`)

### project/mcp

**Key Files:**
- `.mcp.json` - Context7 MCP server configuration for LangGraph documentation
- `CLAUDE.md` - Interaction preference to use Context7 MCP for LangGraph discussions

**MCP Configuration:**
```json
{
  "mcpServers": {
    "context7": {
      "type": "http",
      "url": "https://mcp.context7.com/mcp"
    }
  }
}
```

### project/subagents

**Key Files:**
- `.claude/agents/code-comedy-carl.md` - Humorous code review agent (staff senior engineer persona)
- `.claude/agents/mermaid-diagram-generator.md` - Diagram generation agent
- `main.py` - Example Fibonacci code for agent testing
- `README.md` - Comprehensive subagent usage guide

**Agent Usage:**
```bash
# Invoke Code Comedy Carl for entertaining code reviews
@code-comedy-carl review main.py
```

### project/hooks-notifications

**Key Files:**
- `.claude/settings.json` - Hooks configuration with Stop event
- `play_sound.py` - Pygame-based sound notification script
- `ulala.wav` - Sound file for notifications
- `pyproject.toml` - Python project configuration with pygame dependency
- `.python-version` - Python version specification

**Hook Configuration:**
- **Stop hook** - Plays sound when Claude Code session stops
- Command: `uv run play_sound.py` (uses uv for dependency management)

**Python Setup:**
```bash
# Install dependencies
uv sync

# Test sound playback
uv run play_sound.py
```

### Main Branch Applications

#### HookHub Next.js Application

**Directory:** `hookhub/`

A marketplace application demonstrating hook management concepts for the Claude Code community.

**Key Files:**
- `app/page.tsx` - Main page with hook grid display
- `app/layout.tsx` - Root layout with Geist fonts
- `app/components/` - Reusable components (HookCard, HookGrid, SearchBar, CategoryFilter)
- `types/hook.ts` - TypeScript type definitions for hooks
- `memory/` - Contains spec and frontend development guidelines
  - `memory/spec/CLAUDE.md` - Project specification
  - `memory/frontend/CLAUDE.md` - Frontend development rules (React, Next.js, TypeScript, TailwindCSS)

**Tech Stack:**
- Next.js 16.1.4 with App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

**Development:**
```bash
cd hookhub
npm install
npm run dev  # http://localhost:3000
```

#### My-App Next.js Application

**Directory:** `my-app/`

A secondary Next.js application created during the tutorial workflow for testing features like /rewind, checkpointing, and landing page creation.

**Development:**
```bash
cd my-app
npm install
npm run dev  # http://localhost:3000
```

## Development Commands

### Git Operations

```bash
# List all remote branches
git branch -r

# Check out a specific topic
git checkout project/<topic-name>

# View commit history chronologically
git log --oneline --reverse

# See changes in a specific commit
git show <commit_hash>

# Return to main branch
git checkout main
```

### Next.js Applications

```bash
# For hookhub
cd hookhub
npm install
npm run dev    # Start development server (http://localhost:3000)
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run linter

# For my-app
cd my-app
npm install
npm run dev    # Start development server (http://localhost:3000)
npm run build  # Build for production
npm start      # Start production server
npm run lint   # Run linter
```

### Python Projects (hooks-notifications branch)

```bash
# Install dependencies with uv
uv sync

# Run Python scripts
uv run play_sound.py

# Test with specific Python version
uv run python --version
```

### MCP Server Testing

```bash
# Main branch has weather, puppeteer, sequential-thinking, github, and playwright MCP servers
# Test by asking Claude to:
# - Get weather forecasts for a location
# - Take screenshots of websites with Puppeteer or Playwright
# - Use step-by-step reasoning for complex problems
# - Interact with GitHub API
# - Automate browser testing with Playwright

# For project/mcp branch specifically:
# Test Context7 MCP integration by asking about LangGraph topics
```

## File Organization Logic

### Main Branch Structure

```
crash-course/
├── .claude/
│   ├── commands/           # Slash commands (commit-code, dad-joke)
│   ├── skills/             # Custom skills (explain-code, git-commit)
│   └── settings.local.json # Permissions and MCP configuration
├── hookhub/                # Primary Next.js app (hook marketplace)
│   ├── app/
│   │   ├── components/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── memory/             # Context documentation
│   │   ├── spec/CLAUDE.md
│   │   └── frontend/CLAUDE.md
│   └── types/
├── my-app/                 # Tutorial Next.js app
├── examples/               # Example scripts
│   └── context-switch.sh   # Dynamic context loading
├── resources/              # Video tutorials (not tracked in git)
├── static/                 # Static assets (banner.png)
├── README.md               # Course landing page
├── README-1GistOfClaudeCode.md  # Introduction guide
├── README-2ClaudeSlashCommands.md  # Commands and skills documentation
├── .mcp.json               # MCP server configurations
├── .env                    # Environment variables (git-ignored)
└── start-claude.ps1        # PowerShell launcher with env vars
```

### Project Branches
Each branch may contain:
- `.claude/commands/` - Custom slash commands
- `.claude/agents/` - Custom subagent definitions
- `.claude/settings.json` - Hook configurations
- `.claude/settings.local.json` - Permission configurations
- `.mcp.json` - MCP server configurations (project-specific)
- `CLAUDE.md` - Branch-specific interaction preferences
- Example code files (`main.py`, etc.)
- Dependencies (`pyproject.toml`, `uv.lock`, `.python-version`)

## Custom Commands, Skills, and Agents

### Commands vs Skills

**Custom Commands** (`.claude/commands/*.md`):
- Simple text-based prompt templates
- Use `$arguments` placeholder for user input
- Invoked with `/command-name arguments`
- No permission control
- Example: `/dad-joke programming`

**Custom Skills** (`.claude/skills/*/SKILL.md`):
- More powerful, can specify allowed tools in frontmatter
- Structured with YAML frontmatter
- Invoked with `/skill-name` or automatically based on description
- Can have tool permissions
- Example: `/git-commit`

### Available Commands (Main Branch)

**commit-code** - Smart git commit with user hints
```bash
/commit-code Add new feature for user authentication
```

**dad-joke** - Generate dad jokes about any topic
```bash
/dad-joke programming
```

### Available Skills (Main Branch)

**explain-code** - Code explanation with visual diagrams and analogies
```markdown
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
---

When explaining code, always include:
1. Start with an analogy: Compare the code to something from everyday life
2. Draw a diagram: Use ASCII art to show the flow, structure, or relationships
3. Walk through the code: Explain step-by-step what happens
4. Highlight a gotcha: What's a common mistake or misconception?
```

Usage:
```bash
# Ask about code and skill is triggered automatically
How does the code page.tsx in hookhub directory work?
```

**git-commit** - Automated git commit creation
```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

Gathers git context (status, diff, branch, recent commits) and creates
a commit with an appropriate message.
```

Usage:
```bash
/git-commit
```

### Custom Agents

**Syntax:** Agent files use frontmatter with metadata

Example structure:
```yaml
---
name: agent-name
description: >
  Agent description and activation triggers
tools: Glob, Grep, Read, WebSearch
model: sonnet
color: yellow
---

Agent instructions and personality...
```

Available on other branches (see branch-specific sections above).

## Settings and Permissions

### Permission Patterns

**Main Branch Permissions:**
```json
{
  "permissions": {
    "allow": [
      "Bash(git checkout:*)",
      "Bash(git stash:*)",
      "Bash(git add:*)",
      "Bash(git commit:*)",
      "Bash(git reset:*)",
      "Bash(git rev-parse:*)",
      "Bash(npm audit:*)",
      "Bash(npm run build:*)",
      "Bash(npm install:*)",
      "Bash(powershell -Command:*)",
      "Bash(python:*)",
      "Bash(curl:*)",
      "WebFetch(domain:www.tt1069.com)",
      "mcp__puppeteer-mcp-server__puppeteer_navigate",
      "mcp__puppeteer-mcp-server__puppeteer_screenshot",
      "mcp__puppeteer-mcp-server__puppeteer_evaluate",
      "mcp__puppeteer-mcp-server__puppeteer_fill",
      "mcp__puppeteer-mcp-server__puppeteer_click",
      "mcp__playwright__browser_navigate",
      "mcp__playwright__browser_close",
      "mcp__playwright__browser_snapshot"
    ]
  }
}
```

Other branches may have different permission configurations. Check `.claude/settings.local.json` when switching branches.

### MCP Server Configuration

MCP servers can be configured at:
1. **Project level** - `.mcp.json` in branch root
2. **Settings level** - `enabledMcpjsonServers` array in `settings.local.json`

**Enabled MCP Servers (Main Branch):**

- **weather** - Weather forecasts and alerts
- **puppeteer-mcp-server** - Browser automation and screenshots
- **sequential-thinking** - Step-by-step reasoning for complex problems
- **github** - GitHub API integration (requires .env setup)
- **playwright** - Microsoft Playwright browser automation and testing

Configuration in `settings.local.json`:
```json
{
  "enabledMcpjsonServers": [
    "weather",
    "puppeteer-mcp-server",
    "sequential-thinking",
    "github",
    "playwright"
  ],
  "enableAllProjectMcpServers": true
}
```

Configuration in `.mcp.json`:
```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    },
    "playwright": {
      "command": "npx",
      "args": ["-y", "@playwright/mcp@latest"]
    }
  }
}
```

#### GitHub MCP Server Setup

The GitHub MCP server requires a Personal Access Token for authentication. This is configured using environment variables for security.

**Files:**
- `.env` - Contains your actual GitHub token (git-ignored)
- `.env.example` - Template file showing required variables
- `.mcp.json` - MCP server configuration (no hardcoded tokens)
- `start-claude.ps1` - PowerShell script to load .env and start Claude Code

**Quick Setup:**
1. Add your GitHub token to `.env`:
   ```env
   GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
   ```
2. Start Claude Code with environment variables loaded:
   ```powershell
   .\start-claude.ps1
   ```

**Generate a token:**
- Visit: https://github.com/settings/tokens
- Required scopes: `repo`, `read:org`, `read:user`

For detailed setup instructions, see [GITHUB-MCP-SETUP.md](GITHUB-MCP-SETUP.md).

#### Context7 MCP Server Integration

The Context7 MCP server provides up-to-date documentation for libraries and frameworks. It's already configured in the `.mcp.json` file.

**LangGraph Documentation Preference:**

When discussing LangGraph topics (agents, workflows, checkpoints, state management, etc.), always use the Context7 MCP server to fetch current documentation before answering questions.

**Primary Library IDs:**
- `/langchain-ai/langgraph` - Official repository (latest version: 1.0.6)
- `/llmstxt/langchain-ai_github_io_langgraph_llms-full_txt` - Full documentation (3115 snippets, 91.9 benchmark score)
- `/websites/langchain_oss_python_langgraph` - Python OSS docs (880 snippets, 82 score)
- `/websites/langchain-ai_github_io_langgraphjs` - JavaScript docs (2177 snippets, 90 score)

**Query Pattern:**
```bash
# Step 1: Resolve library ID (if unknown)
mcp__context7__resolve-library-id(libraryName="LangGraph", query="user question")

# Step 2: Query specific documentation
mcp__context7__query-docs(
  libraryId="/llmstxt/langchain-ai_github_io_langgraph_llms-full_txt",
  query="specific question about LangGraph feature"
)
```

**Best Practices:**
- Use the full docs library (`/llmstxt/...`) for comprehensive coverage (highest code snippet count)
- Query specific version if needed: `/langchain-ai/langgraph/1.0.6`
- Limit Context7 calls to 3 per question to manage token usage
- Always cite sources from Context7 responses

**Example Questions:**
- "How do I implement checkpoints in LangGraph?"
- "What's the latest LangGraph version?"
- "Show me examples of state management in LangGraph"
- "How do I create a multi-agent workflow with LangGraph?"

This preference aligns with the pattern demonstrated in the `project/mcp` branch, where Context7 integration for LangGraph is already configured and documented.

## Context Management

### Memory System

Claude Code uses a hierarchical memory system:

**INSTRUCTION PRIORITY (File memory > Session):**
1. Enterprise Policy (highest)
2. CLAUDE.local.md (project-specific, git-ignored)
3. CLAUDE.md (project)
4. .claude/rules/*.md
5. ~/.claude/CLAUDE.md (global)
6. Session prompts (lowest)

**FACTUAL INFORMATION (Session > File memory):**
- Current session statements have highest priority for facts
- Recent conversation context
- File-based memories

### Memory Commands

```bash
/memory  # View currently loaded memory
/clear   # Clear conversation history
```

### Dynamic Context Loading

The `examples/context-switch.sh` script demonstrates dynamic context loading based on user input:

```bash
./examples/context-switch.sh "I need help with database migration"
# Result: Adds @./context/database-context.md to CLAUDE.md

./examples/context-switch.sh "Create a new API endpoint"
# Result: Adds @./context/api-context.md to CLAUDE.md
```

This pattern can be used to load relevant context files based on the task at hand.

## Learning Path Workflow

When contributing new topics or working with this repository:

1. **Check out the branch** for the topic you're studying/modifying
2. **Follow commits chronologically** using `git log --oneline --reverse`
3. **Examine `.claude/` directory** to understand configurations
4. **Test features** as you progress through commits
5. **Return to main** when switching topics

## Common Patterns

### Creating New Learning Topics

1. Create a new `project/<topic-name>` branch
2. Add commits in logical learning progression
3. Include `.claude/` configurations relevant to the topic
4. Add example code that demonstrates the feature
5. Update main branch README.md with new topic entry

### Hook Integration Pattern

Hooks use absolute paths in `settings.json`:
```json
{
  "hooks": {
    "Stop": [{
      "matcher": "",
      "hooks": [{
        "type": "command",
        "command": "/absolute/path/to/script.py"
      }]
    }]
  }
}
```

**Note:** Hooks require absolute paths, which may need adjustment when cloning the repository.

### Creating Custom Commands

1. Create a markdown file in `.claude/commands/`
2. Write the prompt with `$arguments` placeholder
3. Invoke with `/command-name arguments`

Example:
```bash
cat > .claude/commands/commit-code.md << EOF
# Commit Code

Review the files that have changed, and create a commit with a commit message
summarizing the changes made. Always try to give short and concise messages
that convey the business logic.

Use user hints to be the message main subject $arguments
EOF
```

### Creating Custom Skills

1. Create a directory in `.claude/skills/<skill-name>/`
2. Create `SKILL.md` with YAML frontmatter
3. Specify allowed-tools if needed
4. Write detailed instructions

Example:
```bash
mkdir -p .claude/skills/git-commit
cat > .claude/skills/git-commit/SKILL.md << EOF
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

- Current git status:
- Current git diff (staged and unstaged changes):
- Current branch:
- Recent commits:

## Your task

Based on the above changes, create a single git commit.
EOF
```

## Contributing

When adding new content:
1. Fork the repository
2. Create a new `project/*` branch
3. Make commits that tell a learning story (each commit = one concept)
4. Open PR against main branch
5. Update README.md topic table

## Useful Slash Commands

```bash
/init           # Initialize Claude Code context
/clear          # Clear conversation history
/cost           # Check API usage costs
/config         # View configuration
/agents         # List available agents
/ide            # IDE integration commands
/mcp            # View MCP server status
/hooks          # Manage hooks
/skills         # List available skills
/memory         # View loaded memory
/rewind         # Rewind code changes and conversation
/model          # Switch between Claude models
```

## Video Resources

The `resources/` directory contains video tutorials on Context Engineering (not tracked in git due to file size):

1. **Context Engineering: The Key to Building and Using Successful AI Agents**
2. **Context Engineering: From Principles to Practice with Claude Code**
3. **Context Engineering: System Prompt**

These videos provide in-depth explanations of context engineering concepts that complement the hands-on examples in this repository.

**Note:** Video files (*.mp4) are excluded from git via `.gitignore` to keep the repository size manageable.

## Resources

- [Claude Code Official Documentation](https://code.claude.com/docs/)
- [Course GitHub Repository](https://github.com/christseng89/claude-code-crash-course)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs)
- [Cursor MCP Documentation](https://cursor.com/docs)
- [Udemy Course](https://www.udemy.com/course/claudecode/?referralCode=JAN-2026)
