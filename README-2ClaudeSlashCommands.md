# Claude Pricing Overview

## Claude Code

### Resources

<https://code.claude.com/docs/en/overview>
<https://code.claude.com/docs/en/costs>
<https://support.claude.com/en/articles/9797557-usage-limit-best-practices>
<https://code.claude.com/docs/en/slash-commands>
<https://code.claude.com/docs/en/vs-code>
<https://code.claude.com/docs/en/hooks-guide>
<https://code.claude.com/docs/en/memory#manage-claudes-memory>
<https://code.claude.com/docs/en/checkpointing#rewinding-changes>

### Using Claude Subscription

When you log in to Claude Code using a Claude account with an active subscription (Pro, Max, Team, or Enterprise), you can access the features of Claude Code without incurring additional costs for API usage. Your subscription covers the usage of Claude Code.

```bash
claude
/logout

claude
/login

 Select login method:

 ❯ 1. Claude account with subscription · Pro, Max, Team, or Enterprise
   2. Anthropic Console account · API usage billing
   3. 3rd-party platform · Amazon Bedrock, Microsoft Foundry, or Vertex AI

  Haiku 4.5 · Claude Pro · samfire5200@gmail.com Organization

/model
   1. Default (recommended)  Use the default model (currently Sonnet 4.5) · $3/$15 per Mtok
   2. Opus                   Opus 4.5 · Most capable for complex work · $5/$25 per Mtok
 ❯ 3. Haiku ✔                Haiku 4.5 · Fastest for quick answers · $1/$5 per Mtok

Hello, Claude!
/cost 
# n/a
/logout
```

### Using Anthropic Console Account via API Billing

If you log in to Claude Code using an Anthropic Console account, your usage will be billed based on the API pricing for the models you use within Claude Code.

```bash
export ANTHROPIC_API_KEY=OUR_API_KEY_HERE
echo $ANTHROPIC_API_KEY
claude
/login

   1. Claude account with subscription · Pro, Max, Team, or Enterprise
 ❯ 2. Anthropic Console account · API usage billing
   3. 3rd-party platform · Amazon Bedrock, Microsoft Foundry, or Vertex AI

/model
   1. Default (recommended)  Use the default model (currently Sonnet 4.5) · $3/$15 per Mtok
   2. Opus                   Opus 4.5 · Most capable for complex work · $5/$25 per Mtok
 ❯ 3. Haiku ✔                Haiku 4.5 · Fastest for quick answers · $1/$5 per Mtok

Hello, Claude!
/cost

```

## Hooks Hands on

```bash
git branch
git switch project/hooks-notifications

pyenv global 3.12.10
pyenv local 3.12.10

uv run play_sound.py
```

```bash
claude
Hello, how r u?

/hooks

    5.  UserPromptSubmit - When the user submits a prompt                                                                              
    6.  SessionStart - When a new session is started                                                                                   
    ❯ 7.  Stop - Right before Claude concludes its response
    ↓ 8.  SubagentStart - When a subagent (Task tool call) is started


    ❯ 1. + Add new hook…                                                                                                                 
    2. uv run play_sound.py  Local Settings
                                                
```

```json (settings.local.json)
  "hooks": {
    "Stop": [
      {
        "matcher": "",
        "hooks": [
          {
            "type": "command",
            "command": "uv run play_sound.py"
          }
        ]
      }
    ]
  }
```

## Hook Output

There are two ways for hooks to return output back to Claude Code. The output communicates whether to block and any feedback that should be shown to Claude and the user.

### Simple: Exit Code

Hooks communicate status through exit codes, stdout, and stderr:

* **Exit code 0: Success.** `stdout` is shown to the user in transcript mode (CTRL-R), except for `UserPromptSubmit`, where `stdout` is added to the context.

* **Exit code 2: Blocking error.** `stderr` is fed back to Claude to process automatically. See per-hook-event behavior below.

* **Other exit codes: Non-blocking error.** `stderr` is shown to the user and execution continues.

> ⚠️ **Reminder:** Claude Code does not see `stdout` if the exit code is 0, except for the `UserPromptSubmit` hook where `stdout` is injected as context.

<https://ntfy.sh/> You can use ntfy to send notifications to your phone or desktop when a hook is triggered.

## Memory Hand on

```bash
cd ..
git clone https://github.com/christseng89/IceBreaker.git
cd IceBreaker
code .

pyenv global 3.12.10
pyenv local 3.12.10

pip install -r requirements.txt
uv run icebreaker.py
```

```bash
claude
/init

What stack the project is using?
Write it to a Project_stack.md file.
/clear
```

## Manage Claude's Memory

```bash
claude
/memory
```

Claude Code Memory Priority

┌─────────────────────────────────────────────────────────┐
│ Type 1: INSTRUCTIONS/RULES (Strict Hierarchy)           │
├─────────────────────────────────────────────────────────┤
│ 1. Enterprise Policy                                    │
│ 2. CLAUDE.local.md (project-specific)                   │
│ 3. CLAUDE.md (project)                                  │
│ 4. .claude/rules/*.md                                   │
│ 5. ~/.claude/CLAUDE.md (global)                         │
│ 6. Session prompts ← Lowest for instructions            │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ Type 2: FACTUAL INFORMATION (Recency Bias)              │
├─────────────────────────────────────────────────────────┤
│ 1. Current session statements ← HIGHEST for facts!      │
│ 2. Recent conversation context                          │
│ 3. File-based memories (CLAUDE.md, etc.)                │
└─────────────────────────────────────────────────────────┘

INSTRUCTION PRIORITY: File memory > Session
FACTUAL INFORMATION: Session > File memory

### Examples

* For INSTRUCTIONS (Hierarchy Enforced):

  ```markdown
  # CLAUDE.md
  Always use TypeScript for this project
  ```

  Session: "Use JavaScript for this file"
  → **Result**: Claude uses TypeScript (file wins)

* For FACTS (Recency Wins)

  ```markdown
  # CLAUDE.md
  I DO NOT like to eat Pizza
  ```

  Session: "I like to eat Pizza"
  → **Result**: Claude says you like pizza (session wins)

Memory hierarchy should really be:

```markdown
INSTRUCTION PRIORITY (指令類型優先順序): File memory > Session
FACTUAL INFORMATION (事實類型優先順序): Session > File memory
```

## Claude Code 如何查找記憶檔案

### 📍 啟動時立即載入（按順序）

1. **全域記憶**：~/.claude/CLAUDE.md
   * 適用於所有專案的個人偏好

2. **向上遞迴搜尋**：從當前工作目錄（cwd）開始
   * 向上遞迴到根目錄 `/`（但不包含根目錄本身）
   * 讀取路徑上所有的 CLAUDE.md 和 CLAUDE.local.md
   * 例如：在 `foo/bar/` 執行時，會讀取：
     * `foo/CLAUDE.md`
     * `foo/CLAUDE.local.md`
     * `foo/bar/CLAUDE.md`
     * `foo/bar/CLAUDE.local.md`

3. **專案規則**：.claude/rules/*.md
   * 所有 .md 檔案都會被載入
   * 可使用 YAML frontmatter 限制適用範圍

4. ⏳ 延遲載入（按需載入）-> **子目錄記憶**：當前目錄的子樹中的 CLAUDE.md
   * **不會**在啟動時載入
   * **只在** Claude 讀取該子目錄中的檔案時才載入
   * 節省啟動時的 token 消耗

### 📝 補充細節

1 **@import 遞迴限制**：最多 **5 層**深度
2. **檔案格式**：僅支援 **.md** 檔案
3. **自動忽略**：CLAUDE.local.md 自動加入 .gitignore

## Example Context Switch

./examples/load-context.sh "I need help with database migration"
-> 結果：CLAUDE.md 會加入 @./context/database-context.md

./examples/load-context.sh "Create a new API endpoint"
-> 結果：CLAUDE.md 會加入 @./context/api-context.md
