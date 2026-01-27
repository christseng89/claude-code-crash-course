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
