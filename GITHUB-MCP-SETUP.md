# GitHub MCP Server Setup

This guide explains how to set up the GitHub MCP server with secure token management.

## Setup Steps

### 1. Add Your GitHub Token to .env

Edit the `.env` file and add your GitHub Personal Access Token:

```env
GITHUB_PERSONAL_ACCESS_TOKEN=your_actual_token_here
```

**Generate a token:**
1. Go to https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Select scopes: `repo`, `read:org`, `read:user`
4. Copy the generated token

### 2. Start Claude Code with Environment Variables

**Option A: Use the PowerShell script (Recommended)**

```powershell
.\start-claude.ps1
```

This script:
- Loads environment variables from `.env`
- Starts Claude Code with the GitHub token available

**Option B: Set environment variable manually**

```powershell
# PowerShell
$env:GITHUB_PERSONAL_ACCESS_TOKEN = "your_token_here"
claude

# Or load from .env
Get-Content .env | ForEach-Object {
    if ($_ -match '^([^#][^=]+)=(.+)$') {
        [Environment]::SetEnvironmentVariable($matches[1].Trim(), $matches[2].Trim(), "Process")
    }
}
claude
```

**Option C: Set system environment variable (Permanent)**

1. Open System Properties > Environment Variables
2. Add a new User or System variable:
   - Name: `GITHUB_PERSONAL_ACCESS_TOKEN`
   - Value: Your GitHub token
3. Restart Claude Code

### 3. Verify the Connection

Once Claude Code starts, test the GitHub MCP connection:

```bash
/mcp
```

You should see the GitHub MCP server listed as connected.

## Using GitHub MCP Tools

The GitHub MCP server provides tools for:
- Creating and managing issues
- Working with pull requests
- Searching repositories
- Managing branches
- And more...

Example usage:
```
@claude List the open issues in this repository
@claude Create a new issue about [topic]
```

## Security Notes

- **.env is git-ignored** - Your token won't be committed to version control
- **.env.example** - Template file for others to use (no actual token)
- **Never commit your actual token** - Always use environment variables
- **Rotate tokens regularly** - Generate new tokens periodically for security

## Troubleshooting

**"Failed to reconnect to github"**
- Ensure `.env` file exists with your token
- Use `start-claude.ps1` to load environment variables
- Verify token has correct GitHub scopes
- Check that token hasn't expired

**Token not being recognized**
- Restart Claude Code after setting environment variables
- Verify the token is set: `echo $env:GITHUB_PERSONAL_ACCESS_TOKEN` (PowerShell)
- Ensure no extra spaces or quotes around the token in `.env`
