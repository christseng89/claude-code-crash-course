# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a **Claude Code Crash Course** - a branch-based learning repository designed to teach Claude Code concepts through hands-on examples. Each topic is taught through a separate branch with chronologically ordered commits that guide learners step-by-step.

**Repository Structure:**
- **Main branch**: Landing page, documentation, and two working Next.js applications (hookhub + my-app)
- **Project branches** (`project/*`): Each teaches a specific Claude Code feature through commit-based progression
- **Context engineering examples**: Demonstrates MCP integration and fine-grained configuration
- **Learning documentation**: Root-level `README-*.md` files provide topical guides

**Learning Documentation Files:**
- `README.md` - Course overview and getting started
- `README-1GistOfClaudeCode.md` - Introduction to Claude Code fundamentals
- `README-2ClaudeSlashCommands.md` - Slash commands reference
- `README-2Skills.md` - Skills system and custom skills
- `README-3Mcp.md` - Model Context Protocol basics
- `README-4ContextEngineering.md` - Advanced context management
- `README-5PluginsAndCloudfareCodeMode.md` - Extensions and cloud integration
- `README-6AdvancedWorkflow.md` - Plan mode and complex workflows
- `README-7Subagents.md` - Creating and using specialized subagents
- `README-8OutputStyles.md` - Output formatting and statusline customization
- `RAG-architecture.md` - RAG pipeline architecture diagrams
- `RAG-Flow-Diagram.md` - Detailed RAG flow with decision points
- `ComplianceCheckGuidance.md` - Banking compliance check procedures (enterprise use case)
- `HooksMarketplaceSpecV2.1.md` - Complete HookHub application specification
- `GITHUB-MCP-SETUP.md` - GitHub MCP server setup guide

## Getting Started

```bash
# Clone and start
git clone https://github.com/christseng89/claude-code-crash-course.git crash-course
cd crash-course

# Start Claude Code
claude

# Initialize context
/init
```

## Quick Reference

**Common Commands:**
```bash
# Start Claude Code and initialize
claude
/init

# HookHub development
cd hookhub && npm run dev         # Start dev server (http://localhost:3000)
cd hookhub && npm test             # Run tests
cd hookhub && npm run test:coverage # Coverage report

# My-App development
cd my-app && npm run dev          # Start dev server (http://localhost:3000)

# Python examples
python fibonacci.py               # Algorithm demos
python text_processor.py test.txt --clean-only

# Branch navigation
git checkout project/<topic>      # Switch to learning topic
git log --oneline --reverse       # View learning progression
git checkout <commit-hash>        # Step through commits

# MCP with fine-grained config
cd context-engineering-mcp
uv sync                           # Install dependencies
claude --mcp-config .mcp.json.verbose
```

**Ignored Files (.gitignore):**
- `*.mp4` - Video files (avoid large binary files in repo)
- `test*.txt` - Test text files (temporary testing artifacts)
- `.env`, `.env.local` - Environment variables (secrets and tokens)
- `.venv` - Python virtual environment
- `nul` - Windows null device output file
- `resources/` - Large resource files (documentation, images)

When working in this repository, respect these ignore patterns and avoid committing these files.

**GitHub MCP Setup:**
1. Copy `.env.example` to `.env`
2. Add your GitHub Personal Access Token to `.env`
3. On Windows PowerShell, set environment variables:
   ```powershell
   $env:GITHUB_PERSONAL_ACCESS_TOKEN = "your_token_here"
   claude
   ```
4. On Linux/Mac, export environment variables:
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
   claude
   ```
5. See [GITHUB-MCP-SETUP.md](GITHUB-MCP-SETUP.md) for detailed instructions

## Development Commands

### Next.js Applications

**HookHub** (main marketplace app in `hookhub/`):
```bash
cd hookhub
npm install
npm run dev    # http://localhost:3000
npm run build  # Production build
npm run lint   # ESLint check

# Testing (Jest + React Testing Library)
npm test              # Run tests once
npm run test:watch    # Watch mode
npm run test:coverage # Generate coverage report
npm run test:ci       # CI mode with coverage
```

**Architecture:** HookHub uses enhanced type system with comprehensive mock data (22 hooks). See `hookhub/CLAUDE.md` for detailed component architecture, filtering patterns, and planned backend features.

**Tech Stack:**
- Next.js 16.1.6 with App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- ESLint 9
- Zustand 5.0.11 (state management)
- next-themes 0.4.6 (dark mode support)
- Radix UI (accessible UI components)
- lucide-react 0.563.0 (icons)
- Jest + React Testing Library (testing)

**My-App** (tutorial app in `my-app/`):
A basic Next.js tutorial application demonstrating fundamental App Router patterns. Simpler than HookHub, useful for learning Next.js basics before diving into the marketplace.
```bash
cd my-app
npm install
npm run dev    # http://localhost:3000
npm run build
npm run lint
```

### Python Projects

**Fibonacci Calculator** (root level):
```bash
# Run with different implementations
python fibonacci.py

# Demonstrates recursive, iterative, and memoized approaches
# Output shows performance comparison
```

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
Demonstrates fine-grained MCP configuration and verbose debugging server.

**Requirements:**
- Python >=3.11
- `uv` package manager (modern Python package installer)
- Install uv: `pip install uv` or `curl -LsSf https://astral.sh/uv/install.sh | sh`

```bash
cd context-engineering-mcp
uv sync                          # Install dependencies
uv run python main.py            # Run main script
uv run python verbose_mcp_server.py  # Start verbose MCP server on http://127.0.0.1:8000/mcp

# With fine-grained MCP config
claude --mcp-config .mcp.json.verbose  # Use specific MCP configuration
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

**Key Directories:**
- `.claude/` - Commands, skills, agents, settings, output styles
  - `settings.local.json` - Local overrides (git-ignored, user-specific)
  - `settings.json` - Project defaults (checked into git)
- `hookhub/` - Hook marketplace Next.js app (see `hookhub/CLAUDE.md` for detailed architecture)
- `my-app/` - Tutorial Next.js app (basic App Router patterns)
- `context-engineering-mcp/` - MCP integration examples with fine-grained config
- `examples/` - Advanced patterns (context-switch.sh)
- Root-level README files - Numbered learning documentation (README-1.md through README-8.md)
- Python examples - `fibonacci.py`, `text_processor.py`
- RAG documentation - Architecture diagrams and flow charts
- `.mcp.json` - MCP server configurations
- `start-claude.ps1` - PowerShell launcher with environment setup

**Note:** Modify `settings.local.json` for your personal configuration. The `settings.json` file contains project-wide defaults that are committed to git.

### Project Branches

Each `project/*` branch contains:
- Learning progression through commits (view with `git log --oneline --reverse`)
- Branch-specific `.claude/` configurations
- Example code demonstrating the feature
- Optional `CLAUDE.md` with branch-specific instructions

**Available Topics (Project Branches):**
- `project/custom-commands` - Custom slash commands with `$arguments`
- `project/mcp` - Context7 MCP server integration
- `project/context-engineering-mcp` - Fine-grained MCP config with `--mcp-config`
- `project/subagents` - Specialized AI agents (Code Comedy Carl, Mermaid generator)
- `project/hooks-notifications` - Workflow automation with hooks and sound
- `project/hookhub` - Advanced hook management systems (Phase 1)
- `project/hookhub2` - Alternative hook implementation (Phase 2)
- `project/skills` - Custom skills and extensions
- `project/output-styles` - Output formatting customization

**Note:** The `project/hookhub` and `project/hookhub2` branches demonstrate different architectural approaches to building the marketplace application. Compare commits across both branches to understand trade-offs.

**Branch Navigation Pattern:**
Each branch is self-contained with chronological commits. Use `git log --oneline --reverse` to see the learning progression, then `git checkout <commit-hash>` to step through each concept.

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
- **Commands**:
  - `commit-code` - Automated commit message generation
  - `dad-joke` - Generate programming-related dad jokes
  - `infinite` - Infinite agentic loop (experimental)
- **Skills**:
  - `explain-code` - Visual code explanations with diagrams
  - `git-commit` - Interactive commit workflow
- **Agents**:
  - `code-reviewer` - Quality, security, and maintainability review
  - `code-roast-reviewer` - Humorous code critique
  - `debugger` - Error and test failure handler
  - `mermaid-diagram-generator` - Diagram generation
  - `performance-optimizer` - Performance analysis
  - `test-runner` - Automated testing
- **Output Styles**:
  - `retro-ascii-blog` - ASCII art formatting
  - `yaml-concise` - Compact YAML output

## MCP Server Configuration

**Enabled Servers** (see `.mcp.json`):
- **github** - GitHub API integration (requires `.env` with `GITHUB_PERSONAL_ACCESS_TOKEN`)
- **playwright** - Microsoft Playwright browser automation and screenshots
- **context7** - Context7 HTTP-based MCP server for documentation queries (`https://mcp.context7.com/mcp`)
- **verbose-server** (development) - HTTP-based verbose MCP server for debugging (`http://127.0.0.1:8000/mcp`)

**Other Available Servers** (configured but not enabled by default):
- **puppeteer-mcp-server** - Browser automation via Puppeteer (alternative to Playwright)
- **sequential-thinking** - Step-by-step reasoning for complex problem-solving

**Environment Setup for MCP Servers:**

The `.env` file (git-ignored) should contain:
```bash
GITHUB_PERSONAL_ACCESS_TOKEN=your_token_here
```

To set up:
1. Copy `.env.example` to `.env`
2. Add your GitHub Personal Access Token
3. On Windows PowerShell:
   ```powershell
   $env:GITHUB_PERSONAL_ACCESS_TOKEN = "your_token_here"
   claude
   ```
4. On Linux/Mac:
   ```bash
   export GITHUB_PERSONAL_ACCESS_TOKEN="your_token_here"
   claude
   ```

See [GITHUB-MCP-SETUP.md](GITHUB-MCP-SETUP.md) for detailed token creation and setup instructions.

**Adding New MCP Servers:**
1. Edit `.mcp.json` to add server configuration
2. Update `enabledMcpjsonServers` array in `settings.local.json` if needed
3. Restart Claude Code
4. Test with relevant MCP tool calls

## Key Development Patterns

### HookHub Application

**Tech Stack:**
- Next.js 16.1.6 with App Router
- React 19.2.3
- TypeScript 5
- Tailwind CSS 4
- ESLint 9
- Zustand 5.0.11 (state management)
- next-themes 0.4.6 (dark mode)
- Radix UI (accessible components)
- Jest + React Testing Library

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

### Dynamic Context Loading

The `examples/` directory contains advanced patterns:
- `context-switch.sh` - Shell script demonstrating dynamic context loading based on task type
- Shows how to programmatically switch between different CLAUDE.md files or context configurations

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

### Example Projects

**fibonacci.py** - Demonstrates multiple algorithm implementations:
- **Recursive approach**: Simple but exponential time complexity O(2^n)
- **Iterative approach**: Linear time O(n), constant space O(1)
- **Memoized approach**: Linear time O(n) with caching
- **Sequence generation**: Creates list of Fibonacci numbers
- **Performance comparison**: Shows practical differences

**Key Learning Points:**
- Type hints throughout (Python 3.8+)
- Comprehensive docstrings
- Error handling with custom exceptions
- Performance benchmarking
- Multiple algorithmic approaches to same problem

**Use Case:** Demonstrates code quality patterns and serves as test input for code review agents (`funny review @fibonacci.py`).

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

### Creating Custom Agents

1. Use `/agents` command and select "Create new agent"
2. Choose project or user scope
3. Generate with Claude (recommended) or write manually
4. Configure tool permissions and model selection
5. Test agent invocation

**Agent Creation Flow:**
```bash
/agents
❯ Create new agent
❯ 1. Project (.claude/agents/)
❯ 1. Generate with Claude (recommended)
# Provide agent prompt description
# Select read-only, edit, and/or execution tools
# Choose model (Sonnet recommended for balanced performance)
# Select color for visual identification
```

**Agent Frontmatter Example:**
```yaml
---
name: mermaid-diagram-generator
description: Converts textual descriptions into Mermaid diagrams
tools: Glob, Grep, Read, WebFetch, WebSearch, Edit, Write, Bash
model: sonnet
color: cyan
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

## Subagent Architecture

### Available Agents

**Code Quality Agents:**
- **code-reviewer** - Proactive code review for quality, security, and maintainability
- **code-roast-reviewer** - Humorous code review with constructive feedback (use when user asks for "roast" or "funny review")
- **debugger** - Handles errors, test failures, and anomalous behavior
- **performance-optimizer** - Analyzes and improves code performance
- **test-runner** - Automated test execution and failure fixing

**Specialized Agents:**
- **mermaid-diagram-generator** - Converts textual descriptions into Mermaid diagrams (architecture, flowcharts, sequence diagrams, etc.)

### When to Use Subagents

Subagents provide **independent context windows** (separate from main 200k token limit) for specialized tasks:

```bash
# Invoke by name
create a mermaid diagram of a RAG architecture

# Coordinate multiple agents
Use code-reviewer, then performance-optimizer, then debugger for refactoring hookhub

# Funny code review (triggers code-roast-reviewer)
funny review @fibonacci.py
```

**Key Benefits:**
- Fresh context for each run (not limited by main conversation history)
- Task-specific tool access and permissions
- Specialized system prompts and expertise
- Return condensed results to main agent

See [README-7Subagents.md](README-7Subagents.md) for agent orchestration patterns and hierarchy examples.

## Testing Approach

When making changes:
1. **Next.js apps**: Run `npm run lint` before committing, optionally run test suite with `npm test`
   - **HookHub**: Has comprehensive Jest test suite - **REQUIRED WORKFLOW:**
     - Run `npm test` after every file change
     - Run `npm run test:coverage` to verify coverage meets 90% threshold
     - Do not commit if coverage drops below 90%
   - **my-app**: Linting only (no tests configured)
2. **Python code**: Test with example inputs/outputs
3. **Commands/Skills**: Test invocation with various arguments
4. **MCP servers**: Verify with test tool calls
5. **Documentation**: Check markdown formatting and links
6. **Branch changes**: Ensure commit progression is logical and educational

## Platform Considerations

**Windows-Specific Configuration:**
- MCP server commands in `.mcp.json` use `cmd /c` prefix (e.g., `["cmd", "/c", "npx", "-y", ...]`)
- PowerShell scripts for environment variable setup
- Path separators use backslashes in Windows paths
- `nul` file (Windows null device) may appear in root directory

**Cross-Platform Notes:**
- Git Bash provides Unix-like commands on Windows
- Use `chmod +x` equivalent when creating executable scripts
- statusline scripts should be tested on target platform

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
/style          # Change output style
```

## Output Styles & Customization

Claude Code supports custom output formatting through `.claude/output-styles/` directory:

**Available Styles:**
- `default` - Standard Claude Code output
- `retro-ascii-blog` - ASCII art blog-style headers and formatting
- `yaml-concise` - Compact YAML-style structured output

**Statusline Customization:**
The statusline can be customized with shell scripts (configured in `settings.local.json`):
```json
{
  "statusLine": {
    "type": "command",
    "command": "~/.claude/scripts/statusline.sh"
  }
}
```

**Note:** The statusline script is located in the user-level `.claude` directory (`~/.claude/scripts/`), not the project directory. Statusline scripts are shared across all Claude Code projects for a consistent experience.

See [README-8OutputStyles.md](README-8OutputStyles.md) for comprehensive output style documentation and examples.

## Plan Mode (Advanced Workflow)

Plan mode is activated with `Alt + M` (or `Meta + M`) and allows Claude Code to think through complex problems before implementing:

```bash
# Example: HookHub specification development
claude
# Press Alt + M to enter plan mode
⏸ plan mode on (meta+m to cycle)

# Give high-level instructions - Claude will think and plan
I want you to help me come up with a spec for a NEW web application...
a marketplace displaying all of the hooks that are available...

# Claude will create a comprehensive spec
# Review the spec, then exit plan mode and implement

# Start fresh implementation session
/clear
/init
Refer to ./HooksMarketplaceSpecV2.1.md update the project hookhub for me.
```

**Use Plan Mode For:**
- Architecture planning for new features
- Specification creation before implementation
- Complex refactoring strategies
- Multi-step workflow design

See [README-6AdvancedWorkflow.md](README-6AdvancedWorkflow.md) for the complete HookHub case study.

## Working with Project Branches

This repository uses a unique branch-based learning structure. Each `project/*` branch teaches a specific concept through chronological commits:

**Navigation Pattern:**
```bash
# List all learning topics
git branch -r | grep project/

# Checkout a topic branch
git checkout project/custom-commands

# View learning progression
git log --oneline --reverse

# Step through commits one by one
git checkout <commit-hash>

# Move forward/backward
git checkout HEAD~1  # Go back one commit
git checkout <next-commit-hash>  # Go forward

# Return to latest
git checkout project/custom-commands
```

**Branch-Specific Context:**
- Each branch may have its own `.claude/` configurations
- Branch-specific `CLAUDE.md` files may exist
- Commit messages describe learning objectives
- Each commit builds on previous concepts

**Example Learning Flow:**
```bash
# Start with MCP integration
git checkout project/mcp
git log --oneline --reverse
# Follow commits to learn Context7 integration

# Then explore subagents
git checkout project/subagents
git log --oneline --reverse
# Step through agent creation examples
```

## Contributing

When adding content:
1. Fork the repository
2. Create `project/*` branch for new topics
3. Use descriptive commit messages (one concept per commit)
4. Open PR against main branch
5. Update README.md with new topic entry

**Branch-Based Learning Philosophy:**
This repository uses a unique pedagogical approach where each `project/*` branch teaches through progressive commits. When creating new learning branches:
- Each commit should introduce exactly one concept
- Commits should build on each other logically
- Include working code at each step (avoid broken intermediate states)
- Add branch-specific `.claude/` configuration if relevant
- Consider adding a branch-specific CLAUDE.md for complex topics
- Test the entire commit sequence from a learner's perspective

**Quality Checklist for New Branches:**
- [ ] Branch name follows `project/<topic-name>` convention
- [ ] Each commit has a clear, educational message
- [ ] Code works at every commit point
- [ ] README.md updated with branch description
- [ ] Appropriate `.claude/` configurations included
- [ ] Example code demonstrates the feature practically
- [ ] No sensitive data or large binaries committed

## Resources

- [Claude Code Documentation](https://code.claude.com/docs/)
- [Course GitHub Repository](https://github.com/christseng89/claude-code-crash-course)
- [Model Context Protocol Documentation](https://modelcontextprotocol.io/docs)
- [Cursor MCP Documentation](https://cursor.com/docs)
- [Udemy Course](https://www.udemy.com/course/claudecode/?referralCode=JAN-2026)
