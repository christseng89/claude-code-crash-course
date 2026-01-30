# How to Create a Custom Skill in Claude Code

## Overview

### Skills vs Commands

**Custom Skills** (`.claude/skills/*/SKILL.md`):

- More powerful than commands
- Can specify allowed tools in frontmatter
- Structured with YAML frontmatter
- Have tool permissions control
- Invoked with `/skill-name` or automatically based on description

**Custom Commands** (`.claude/commands/*.md`):

- Simple text-based prompt templates
- Use `$arguments` placeholder
- No permission control
- Just markdown files

---

## Creating a Skill

### Step 1: Create the Directory Structure

```bash
mkdir -p .claude/skills/your-skill-name
```

### Step 2: Create the SKILL.md File

Create `.claude/skills/your-skill-name/SKILL.md` with this structure:

```markdown
---
name: your-skill-name
description: Clear description of what the skill does and when it should be triggered
allowed-tools: Tool1, Tool2(specific:pattern), Tool3
model: sonnet
color: blue
---

# Skill Instructions

Detailed instructions for Claude on how to execute this skill...

## Context

What context should be gathered...

## Your Task

What Claude should do...

## Output Format

How results should be presented...
```

---

## Skill Examples

### Example 1: Git Commit Skill

```markdown
---
allowed-tools: Bash(git add:*), Bash(git status:*), Bash(git commit:*)
description: Create a git commit
---

## Context

Gather the following information:
- Current git status
- Current git diff (staged and unstaged changes)
- Current branch
- Recent commits

## Your Task

Based on the above changes, create a single git commit with an appropriate message.

## Instructions

1. Run `git status` to see what files have changed
2. Run `git diff` to see the actual changes
3. Run `git log` to see recent commit message patterns
4. Analyze the changes and create a concise commit message
5. Stage relevant files with `git add`
6. Create the commit with `git commit -m "message"`
```

### Example 2: Code Explanation Skill

```markdown
---
name: explain-code
description: Explains code with visual diagrams and analogies. Use when explaining how code works, teaching about a codebase, or when the user asks "how does this work?"
allowed-tools: Read, Glob, Grep
---

When explaining code, always include:

1. **Start with an analogy**: Compare the code to something from everyday life
2. **Draw a diagram**: Use ASCII art or mermaid to show the flow, structure, or relationships
3. **Walk through the code**: Explain step-by-step what happens
4. **Highlight a gotcha**: What's a common mistake or misconception?

## Output Format

🎯 **ANALOGY**
[Your everyday analogy here]

📊 **VISUAL DIAGRAM**
[ASCII art or mermaid diagram]

🔍 **CODE WALKTHROUGH**
[Step-by-step explanation]

⚠️ **COMMON GOTCHA**
[What to watch out for]
```

### Example 3: Security Review Skill

```markdown
---
name: security-review
description: Review code for security vulnerabilities
allowed-tools: Read, Grep, Glob
version: 1.0.0
---

# Security Review

Review the current codebase or specified files for security vulnerabilities.

## Checks to Perform

1. **Authentication & Authorization**
   - Check for proper authentication
   - Verify authorization checks
   - Look for hardcoded credentials

2. **Input Validation**
   - SQL injection vulnerabilities
   - XSS vulnerabilities
   - Command injection risks

3. **Data Protection**
   - Sensitive data exposure
   - Insecure cryptography
   - Plaintext passwords

4. **Configuration**
   - Security misconfigurations
   - Default credentials
   - Debug mode in production

## Output Format

Provide a structured report with:
- ✅ Passed checks
- ⚠️ Warnings (potential issues)
- 🚨 Critical vulnerabilities (must fix)

For each issue, include:
- File path and line number
- Description of the vulnerability
- Recommended fix
```

---

## Frontmatter Configuration

### Available Options

```yaml
---
name: skill-name                    # Required: Unique identifier
description: >                      # Required: When to trigger this skill
  Detailed description that helps Claude
  understand when to use this skill
allowed-tools: Tool1, Tool2         # Optional: Permitted tools
model: sonnet                       # Optional: Model to use (sonnet, opus, haiku)
color: blue                         # Optional: Display color in CLI
version: 1.0.0                      # Optional: Skill version
---
```

### Tool Permission Patterns

**Specific Command Patterns:**

```yaml
allowed-tools: Bash(git add:*), Bash(git commit:*), Bash(git status:*)
```

**Multiple Tools:**

```yaml
allowed-tools: Read, Write, Edit, Bash(npm:*), WebSearch
```

**All Tools** (not recommended):

```yaml
allowed-tools: "*"
```

---

## Using Your Skill

### Explicit Invocation

```bash
/your-skill-name
```

### Automatic Triggering

If your description matches the user's request, Claude will automatically suggest or use the skill:

```note
# User: "Explain how this authentication code works"
# Claude automatically triggers the explain-code skill
```

---

## Testing Your Skill

1. Create the skill in `.claude/skills/your-skill-name/SKILL.md`
2. Restart Claude Code or use `/skills` to reload
3. List available skills: `/skills`
4. Test invocation: `/your-skill-name`
5. Test auto-trigger: Ask a question matching the description

---

## Advanced: Multi-File Skills

You can include additional context files:

```directory
.claude/skills/security-review/
├── SKILL.md                 # Main skill definition
├── checklist.md            # Additional context
└── patterns/               # Reference patterns
    ├── sql-injection.md
    └── xss-patterns.md
```

Reference them in your `SKILL.md`:

```markdown
Refer to the checklist in `./checklist.md` for comprehensive checks.
```

---

## Best Practices

1. **Clear descriptions** - Help Claude understand when to use the skill
2. **Minimal permissions** - Only grant necessary tool access
3. **Structured output** - Define consistent output formats
4. **Error handling** - Include instructions for edge cases
5. **Examples** - Add examples in the skill instructions
6. **Version control** - Track skill versions for changes

---

## Verification Commands

### List all available skills

```bash
/skills
```

### View skill details

```bash
cat .claude/skills/your-skill-name/SKILL.md
```

### Check permissions in settings

```bash
cat .claude/settings.local.json
```

---

## Quick Start Example

Create `.claude/skills/hello-skill/SKILL.md`:

```markdown
---
name: hello-skill
description: A test skill that says hello
---

Say "Hello from your custom skill!" and list all files in the current directory.
```

Then test:

```bash
/hello-skill
```
