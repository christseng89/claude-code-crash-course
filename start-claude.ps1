# Load environment variables from .env file and start Claude Code
# This ensures the GitHub MCP server can access the GITHUB_PERSONAL_ACCESS_TOKEN

$envFile = Join-Path $PSScriptRoot ".env"

if (Test-Path $envFile) {
    Write-Host "Loading environment variables from .env..." -ForegroundColor Green

    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()

            # Remove quotes if present
            $value = $value -replace '^["'']|["'']$', ''

            if ($name -and $value) {
                [Environment]::SetEnvironmentVariable($name, $value, "Process")
                Write-Host "  Set: $name" -ForegroundColor Cyan
            }
        }
    }

    Write-Host "`nStarting Claude Code..." -ForegroundColor Green
    & claude
} else {
    Write-Host "Error: .env file not found at $envFile" -ForegroundColor Red
    Write-Host "Please create a .env file with your GITHUB_PERSONAL_ACCESS_TOKEN" -ForegroundColor Yellow
}
