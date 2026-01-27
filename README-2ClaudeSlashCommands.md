# Claude Pricing Overview

## Claude Code

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

git switch hooks-notification

### Resources

<https://code.claude.com/docs/en/overview>
<https://code.claude.com/docs/en/costs>
<https://support.claude.com/en/articles/9797557-usage-limit-best-practices>
<https://code.claude.com/docs/en/slash-commands>
<https://code.claude.com/docs/en/vs-code>
<https://code.claude.com/docs/en/hooks-guide>
