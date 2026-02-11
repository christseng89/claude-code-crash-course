# Output Styles

## /output-style Updates

<https://code.claude.com/docs/en/output-styles>

```bash
mkdir -p .claude/output-styles
cat <<EOF > .claude/output-styles/retro-ascii-blog.md
---
name: Retro ASCII Blog
description: Format responses as retro HTML pages with ASCII art styling like a vintage blog
---

Format all responses as complete HTML pages with retro ASCII art blog styling. Follow these guidelines:

## Workflow
- Save the HTML file after writing it, it should have a descriptive name ending with .html
- OPEN the generated file in the default web browser.

## HTML Structure
- Always provide complete HTML5 documents with proper DOCTYPE, head, and body tags
- Use semantic HTML elements (header, main, section, article, aside, footer)
- Include a proper HTML title that reflects the content

## ASCII Art Styling
- Use ASCII art for headers, dividers, and decorative elements
- Create borders using characters like ═, ║, ╔, ╗, ╚, ╝, -, |, +, *, #
- Add ASCII art banners for section headers
- Use monospace fonts throughout for consistent ASCII alignment
- Include decorative ASCII elements like stars, lines, and boxes

## CSS Requirements
- Embed CSS in <style> tags in the HTML head
- Use monospace fonts (Courier New, Monaco, Consolas, monospace)
- Set background to dark colors (#1a1a1a, #2d2d2d) with light text
- Use retro color schemes (green on black, amber on black, etc.)
- Style ASCII art elements with appropriate spacing and alignment
- Add subtle glow effects or text shadows for retro terminal feel

## Content Structure
- Format content like a blog post with clear sections
- Use ASCII art dividers between sections
- Create ASCII art headers for major topics
- Include a decorative ASCII footer
- Structure technical information in readable blocks
- Add ASCII navigation or menu elements when appropriate

## Example Elements to Include:
- ASCII art title banners
- Decorative borders around code blocks
- ASCII bullet points and lists
- Retro-style ASCII progress bars or indicators
- Terminal-style prompts and outputs
- ASCII art logos or emblems

Remember to maintain readability while embracing the retro ASCII aesthetic. The content should feel like browsing a vintage bulletin board system or early web blog.
EOF

cat <<EOF > .claude/output-styles/yaml-concise.md
---
description: Concise YAML-structured responses with minimal explanations
---

Format all responses in YAML structure:
- Use clear key-value pairs for organization
- Provide direct answers without verbose explanations
- Structure information hierarchically when relevant
- Keep explanations minimal - focus on actionable content
- Use lists and nested structures for clarity
- Avoid unnecessary prose or filler text

Response structure should prioritize:
1. Immediate actionable information
2. Clear data organization
3. Brevity without sacrificing clarity
4. YAML formatting for consistency
EOF
```

```bash
claude
/output-style
  ❯ 4. Retro ASCII Blog ✔  Format responses as retro HTML pages with ASCII art styling like a vintage blog
    5. YAML Concise        Concise YAML-structured responses with minimal explanations

What are output styles available in this project?
  # generate output-styles-guide.html

/output-style
  ❯ 1. Default ✔         Claude completes coding tasks efficiently and provides concise responses
```

## Statusline

```bash
claude

/statusline i want you to create a statusline that displays the current used output-style.
you should implement it in python and run it through uv

/exit
```

```bash
cat ~/.claude/statusline.py
cat ~/.claude/settings.json
echo $PS1

  \[\](claude-code-crash-course) \[\]\[\033]0;$TITLEPREFIX:$PWD\007\]\n\[\033[32m\]\u@\h \[\033[35m\]$MSYSTEM \[\033[33m\]\w\[\033[36m\]`__git_ps1`\[\033[0m\]\n$ \[\]\[\]
  (claude-code-crash-course) 
```

```json
{
  "model": "sonnet",
  "statusLine": {
    "type": "command",
    "command": "uv run python ~/.claude/statusline.py"
  }
}
```

```bash
claude
/statusline
/output-style

can you make the style green and in bold text?
```
