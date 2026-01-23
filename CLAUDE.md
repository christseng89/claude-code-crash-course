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

# Initialize Claude Code context (recommended)
/init
```

The `/init` command analyzes the codebase and creates [CLAUDE.md](CLAUDE.md) (this file) to help Claude understand the repository structure and conventions.

## Repository Architecture

### Branch-Based Learning Structure

The repository uses a unique educational pattern:

1. **Main branch** - Landing page with course overview and topic index
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

**Important:** The `main` branch contains the course overview plus a working Next.js application (`hookhub/`). Most learning content lives in `project/*` branches. When switching between branches, be aware that:
- `.claude/` directory contents change per branch
- Some branches have Python code examples (e.g., `project/subagents` has `main.py`)
- Some branches include MCP configurations (e.g., `project/mcp` has `.mcp.json`)
- The `hookhub/` Next.js application exists on main and demonstrates hook management concepts

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

### Main Branch: HookHub Next.js Application

**Key Files:**

- `hookhub/` - Next.js 16.1.4 application demonstrating hook management concepts
- `hookhub/app/page.tsx` - Main page component
- `hookhub/app/layout.tsx` - Root layout with Geist fonts
- `hookhub/package.json` - Project dependencies and scripts

**Tech Stack:**

- Next.js 16.1.4 with App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- ESLint 9

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

### Next.js Application (main branch)

```bash
# Navigate to hookhub directory
cd hookhub

# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Python Project (hooks-notifications branch)

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
# Main branch has weather, puppeteer, sequential-thinking, and github MCP servers
# Test by asking Claude to:
# - Get weather forecasts for a location
# - Take screenshots of websites
# - Use step-by-step reasoning for complex problems
# - Interact with GitHub API

# For mcp branch specifically:
# Test Context7 MCP integration by asking about LangGraph topics
```

## File Organization Logic

### Main Branch

- `README.md` - Course landing page with topic index
- `README-1GistOfClaudeCode.md` - Bilingual introduction to Claude Code (Chinese/English)
- `static/banner.png` - Course banner image
- `.claude/settings.local.json` - Base permissions and MCP server configuration
- `.gitignore` - Excludes video files (*.mp4) from version control
- `hookhub/` - Next.js application for hook management demonstration
- `resources/` - Video tutorials on Context Engineering (not tracked in git)

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

## Custom Commands and Agents

### Custom Commands

**Syntax:** Commands use `$arguments` placeholder for user input

Example from `commit-code.md`:
```markdown
# Commit Code

Review the files that have changed, and create a commit with a commit message
summarizing the changes made. Always try to give short and concise messages
that convey the business logic.

Use user hints to be the message main subject $arguments
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
      "Bash(git commit:*)"
    ]
  }
}
```

Other branches may have different permission configurations. Check [.claude/settings.local.json](.claude/settings.local.json) when switching branches.

### MCP Server Configuration

MCP servers can be configured at:
1. **Project level** - `.mcp.json` in branch root
2. **Settings level** - `enabledMcpjsonServers` array in `settings.local.json`

**Enabled MCP Servers (Main Branch):**

- **weather** - Weather forecasts and alerts
- **puppeteer-mcp-server** - Browser automation and screenshots
- **sequential-thinking** - Step-by-step reasoning for complex problems
- **github** - GitHub API integration

Configuration example:
```json
{
  "enabledMcpjsonServers": [
    "weather",
    "puppeteer-mcp-server",
    "sequential-thinking",
    "github"
  ],
  "enableAllProjectMcpServers": true
}
```

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

## Contributing

When adding new content:
1. Fork the repository
2. Create a new `project/*` branch
3. Make commits that tell a learning story (each commit = one concept)
4. Open PR against main branch
5. Update README.md topic table

## Video Resources

The `resources/` directory contains video tutorials on Context Engineering (not tracked in git due to file size):

1. **Context Engineering: The Key to Building and Using Successful AI Agents**
2. **Context Engineering: From Principles to Practice with Claude Code**
3. **Context Engineering: System Prompt**

These videos provide in-depth explanations of context engineering concepts that complement the hands-on examples in this repository.

**Note:** Video files (*.mp4) are excluded from git via [.gitignore](.gitignore) to keep the repository size manageable.

## Resources

- [Claude Code Official Documentation](https://code.claude.com/docs/)
- [Course GitHub Repository](https://github.com/christseng89/claude-code-crash-course)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs)
- [Cursor MCP Documentation](https://cursor.com/docs)
- [Udemy Course](https://www.udemy.com/course/claudecode/?referralCode=JAN-2026)
