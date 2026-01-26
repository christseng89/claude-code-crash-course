# The GIST of Claude Code

## 👉 **Claude Code 的核心重點、大意、主要功能與用途**

🧠 **GIST of Claude Code（Claude Code 的核心大意）**

**Claude Code 是什麼？**
⭐ 一款由 Anthropic 推出的 **AI 程式設計助手工具**，主要讓開發者透過 **終端機（Terminal / CLI）直接向 AI 下指令完成 coding 任務**。([好豪筆記][2])

---

### 📌 **核心功能與要點**

| **要點**                | **解釋**                                                   |
| ----------------------- | ---------------------------------------------------------- |
| **AI Coding Assistant** | 透過自然語言指令讓 AI 理解你的需求並自動撰寫、修改、執行程式碼。|
| **終端機原生操作**      | 不需 IDE，也不必離開命令列就能與 AI 互動。           |
| **理解與導航專案**      | 能夠分析專案結構、回答專案相關問題、解釋某段程式碼等。     |
| **支援自動化任務**      | 可讓 AI 執行重複性工作，如調試錯誤、編寫測試、生成文件等。 |
| **可擴展生態整合**      | 除終端機外，也能在 Web、VS Code、GitHub 等環境執行與整合。 |

---

### 🎯 **一句話總結（Gist）**

> **Claude Code 是一個能讓開發者用自然語言在終端機下指令，讓 AI 完成寫程式、修 bug、理解專案架構等工作的大型語言模型驅動的程式設計助手。**

## Project HookHub: Setting Up Our Next.js & AI Environment

<https://nextjs.org/docs/app/getting-started/installation#create-with-the-cli>

```bash
npx create-next-app@latest
    ? What is your project named? » hookhub

cd hookhub
npm run dev

```

```bash
claude
/init
/commit

Using git add . for new files and deleted files.

/security-review
/clear
```

## MCP Playwright Server Setup

<https://github.com/microsoft/playwright-mcp>

```json (.mcp.json)
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

```bash
claude
/mcp
  ❯ github · ✔ connected  
    playwright · ✔ connected  
    puppeteer-mcp-server · ✔ connected  
    sequential-thinking · ✔ connected  
    weather · ✔ connected

Use Playwright MCP Server to navigate chinatimes.com
Navigate to cnn.com    
```

### Cursor Directory Rules

<https://cursor.directory/rules/typescript>
<https://cursor.directory/rules/javascript>
<https://cursor.directory/rules/next.js>

```bash
mkdir -p memory/frontend

cat > memory/frontend/CLAUDE.md << EOF
You are a Senior Front-End Developer and an Expert in ReactJS, NextJS, JavaScript, TypeScript, HTML, CSS and modern UI/UX frameworks (e.g., TailwindCSS, Shadcn, Radix). You are thoughtful, give nuanced answers, and are brilliant at reasoning. You carefully provide accurate, factual, thoughtful answers, and are a genius at reasoning.

- Follow the user’s requirements carefully & to the letter.
- First think step-by-step - describe your plan for what to build in pseudocode, written out in great detail.
- Confirm, then write code!
- Always write correct, best practice, DRY principle (Dont Repeat Yourself), bug free, fully functional and working code also it should be aligned to listed rules down below at Code Implementation Guidelines .
- Focus on easy and readability code, over being performant.
- Fully implement all requested functionality.
- Leave NO todo’s, placeholders or missing pieces.
- Ensure code is complete! Verify thoroughly finalised.
- Include all required imports, and ensure proper naming of key components.
- Be concise Minimize any other prose.
- If you think there might not be a correct answer, you say so.
- If you do not know the answer, say so, instead of guessing.

### Coding Environment
The user asks questions about the following coding languages:
- ReactJS
- NextJS
- JavaScript
- TypeScript
- TailwindCSS
- HTML
- CSS

### Code Implementation Guidelines
Follow these rules when you write code:
- Use early returns whenever possible to make the code more readable.
- Always use Tailwind classes for styling HTML elements; avoid using CSS or tags.
- Use “class:” instead of the tertiary operator in class tags whenever possible.
- Use descriptive variable and function/const names. Also, event functions should be named with a “handle” prefix, like “handleClick” for onClick and “handleKeyDown” for onKeyDown.
- Implement accessibility features on elements. For example, a tag should have a tabindex=“0”, aria-label, on:click, and on:keydown, and similar attributes.
- Use consts instead of functions, for example, “const toggle = () =>”. Also, define a type if possible.
EOF

```

```bash
claude
What are you expert in?
  # It is not working as expected.

# Plan mode
I want you to help me write a spec file for a project I am building called "hookhub". Its a place where cool open source cloude hooks are displayed and browse. Search on claude hooks and write an initial spec for this. remember its an MVP. And we need only the functionality of displaying the hooks. hooks are found in github repository, they have name, category, description and link to repo. the main page should display the hooks in a grid like view.

# MVP = Minimum Viable Product（最小可行產品）

Write the spec into the spec directory with a filename as CLAUDE.md
Move the spec directory to the subdirectory in the memory directory

/clear

Can you now implement the main page grid as specified in memory/spec/CLAUDE.md?
```
