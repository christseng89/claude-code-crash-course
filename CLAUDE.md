# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Code Crash Course** - a branch-based learning repository designed to teach Claude Code concepts through hands-on examples. Each topic is taught through a separate branch with chronologically ordered commits that guide learners step-by-step.

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

**Important:** The `main` branch contains only the course overview. All learning content lives in `project/*` branches. When switching between branches, be aware that:
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

### Python Project (hooks-notifications branch)

```bash
# Install dependencies with uv
uv sync

# Run Python scripts
uv run play_sound.py

# Test with specific Python version
uv run python --version
```

### MCP Server Testing (mcp branch)

```bash
# Test Context7 MCP integration
# Ask Claude about LangGraph topics to trigger MCP usage
```

## File Organization Logic

### Main Branch
- `README.md` - Course landing page with topic index
- `static/banner.png` - Course banner image
- `.claude/settings.local.json` - Base permissions (git checkout allowed)

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

Common permission configurations across branches:
```json
{
  "permissions": {
    "allow": [
      "Bash(git checkout:*)",
      "Bash(git stash:*)"
    ]
  }
}
```

### MCP Server Configuration

MCP servers can be configured at:
1. **Project level** - `.mcp.json` in branch root
2. **Settings level** - `enabledMcpjsonServers` array in `settings.local.json`

Example from hooks-notifications branch:
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

## Resources

- [Claude Code Official Documentation](https://code.claude.com/docs/)
- [Course GitHub Repository](https://github.com/christseng89/claude-code-crash-course)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs)
- [Cursor MCP Documentation](https://cursor.com/docs)
- [Udemy Course](https://www.udemy.com/course/claudecode/?referralCode=JAN-2026)
