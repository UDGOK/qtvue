#Requires -Version 5.1
<#
qtvue now — Windows installer

Run once from PowerShell. It will:
  1. Prompt for your GitHub Personal Access Token (masked input).
  2. Save it permanently to your user environment (HKEY_CURRENT_USER).
  3. Add the scripts\ directory to your user PATH so `now`
     works from any folder in any PowerShell / cmd window.
  4. Verify the install.

Usage (from inside the qtvue repo, or anywhere after cloning):
  PS> .\scripts\install-windows.ps1

If you cloned to a non-standard location, pass it:
  PS> .\scripts\install-windows.ps1 -RepoPath C:\code\qtvue
#>

param(
    [string]$RepoPath
)

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  qtvue now — Windows installer                       ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

# ---------------------------------------------------------------- locate repo
if (-not $RepoPath) {
    $cwd = (Get-Location).Path
    while ($cwd -ne "") {
        if ((Test-Path (Join-Path $cwd "public/now.json")) -and (Test-Path (Join-Path $cwd ".git"))) {
            $RepoPath = $cwd
            break
        }
        $parent = Split-Path -Parent $cwd
        if ($parent -eq $cwd) { break }
        $cwd = $parent
    }
}

if (-not $RepoPath -or -not (Test-Path (Join-Path $RepoPath "public/now.json"))) {
    Write-Host "Cannot find public/now.json." -ForegroundColor Red
    Write-Host ""
    Write-Host "Either:" -ForegroundColor Yellow
    Write-Host "  (a) cd into the qtvue repo first, or"
    Write-Host "  (b) pass the path:  .\install-windows.ps1 -RepoPath C:\code\qtvue"
    Write-Host ""
    Write-Host "Clone the repo if you haven't:" -ForegroundColor Cyan
    Write-Host "  git clone https://github.com/UDGOK/qtvue.git C:\Users\$env:USERNAME\qtvue"
    exit 1
}

Write-Host "Repo: $RepoPath" -ForegroundColor DarkGray
Write-Host ""

# ---------------------------------------------------------------- existing token?
$ExistingToken = [Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "User")

if ($ExistingToken -and $ExistingToken.Length -gt 0) {
    Write-Host "GITHUB_TOKEN already set in your user environment." -ForegroundColor Yellow
    $Resp = Read-Host "Keep it? [Y/n]"
    if ($Resp -eq "" -or $Resp -match "^[Yy]") {
        Write-Host "Keeping existing token." -ForegroundColor Green
        $Token = $ExistingToken
    } else {
        $Token = $null  # prompt below
    }
}

# ---------------------------------------------------------------- prompt for token
if (-not $Token) {
    Write-Host ""
    Write-Host "Create a GitHub Personal Access Token at:" -ForegroundColor Cyan
    Write-Host "  https://github.com/settings/tokens" -ForegroundColor White
    Write-Host ""
    Write-Host "Settings:" -ForegroundColor Cyan
    Write-Host "  Name:        qtvue-now-cli" -ForegroundColor White
    Write-Host "  Expiration:  90 days (or no expiration)" -ForegroundColor White
    Write-Host "  Scopes:      repo (only this is needed)" -ForegroundColor White
    Write-Host ""

    $SecureToken = Read-Host "Paste your GitHub PAT (input hidden)" -AsSecureString
    if (-not $SecureToken -or $SecureToken.Length -eq 0) {
        Write-Host "No token entered. Aborting." -ForegroundColor Red
        exit 1
    }
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($SecureToken)
    try {
        $Token = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    } finally {
        [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    }

    if (-not $Token.StartsWith("ghp_") -and -not $Token.StartsWith("github_pat_")) {
        Write-Host ""
        Write-Host "WARNING: token doesn't start with 'ghp_' or 'github_pat_'." -ForegroundColor Yellow
        Write-Host "It might be invalid. Continuing anyway — you can fix it later." -ForegroundColor Yellow
    }

    # Save to user environment (persistent)
    [Environment]::SetEnvironmentVariable("GITHUB_TOKEN", $Token, "User")
    Write-Host ""
    Write-Host "✓ Token saved to your user environment." -ForegroundColor Green
    Write-Host "  (Stored in HKEY_CURRENT_USER\Environment — visible to all your apps.)" -ForegroundColor DarkGray
}

# ---------------------------------------------------------------- add scripts/ to PATH
$ScriptsDir = Join-Path $RepoPath "scripts"
$UserPath = [Environment]::GetEnvironmentVariable("Path", "User")

Write-Host ""
if ($UserPath -and ($UserPath -split ";" -contains $ScriptsDir)) {
    Write-Host "scripts\ already on user PATH." -ForegroundColor Green
} else {
    # Avoid duplicates
    $PathParts = if ($UserPath) { $UserPath -split ";" } else { @() }
    $PathParts = @($PathParts | Where-Object { $_ -and $_ -ne "" })

    if ($PathParts -contains $ScriptsDir) {
        Write-Host "scripts\ already on user PATH." -ForegroundColor Green
    } else {
        $NewPath = if ($UserPath) { "$UserPath;$ScriptsDir" } else { $ScriptsDir }
        [Environment]::SetEnvironmentVariable("Path", $NewPath, "User")
        Write-Host "✓ Added scripts\ to your user PATH:" -ForegroundColor Green
        Write-Host "  $ScriptsDir" -ForegroundColor DarkGray
    }
}

# ---------------------------------------------------------------- update current session
$env:GITHUB_TOKEN = $Token
$env:Path = [Environment]::GetEnvironmentVariable("Path", "User") + ";" + $env:Path

# ---------------------------------------------------------------- verify install
Write-Host ""
Write-Host "→ Verifying install..." -ForegroundColor Cyan
Write-Host ""

$TestNow = Get-Command now -ErrorAction SilentlyContinue
if ($TestNow) {
    Write-Host "✓ 'now' command resolved:" -ForegroundColor Green
    Write-Host "  $($TestNow.Source)" -ForegroundColor DarkGray
} else {
    Write-Host "⚠ 'now' not yet on PATH in this session." -ForegroundColor Yellow
    Write-Host "  Open a new PowerShell window and try again." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "→ Testing JSON parse + git status..." -ForegroundColor Cyan
Write-Host ""

Push-Location $RepoPath
try {
    $Json = Get-Content "public/now.json" -Raw -Encoding UTF8 | ConvertFrom-Json
    Write-Host "✓ public/now.json parsed:" -ForegroundColor Green
    Write-Host "  current: $($Json.current.text)" -ForegroundColor DarkGray
    Write-Host "  recent:  $($Json.recent.Count) archived entries" -ForegroundColor DarkGray
    Write-Host ""

    $GitStatus = git status --short 2>&1
    if ($GitStatus) {
        Write-Host "Uncommitted changes:" -ForegroundColor Yellow
        Write-Host $GitStatus
    } else {
        Write-Host "✓ Working tree clean." -ForegroundColor Green
    }
}
finally {
    Pop-Location
}

# ---------------------------------------------------------------- done
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✓ Install complete                                   ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Open a NEW PowerShell window (so PATH updates apply), then from anywhere:"
Write-Host ""
Write-Host "  PS> now `"Tuning H1 footstep planner for 12cm obstacles`" shipping-fast engineering" -ForegroundColor Yellow
Write-Host ""
Write-Host "Or with tags:" -ForegroundColor Cyan
Write-Host "  PS> now `"Deployed ACT policy to Go2s`" shipping-fast programming `"go2,lerobot,act`"" -ForegroundColor Yellow
Write-Host ""
Write-Host "Tip: hit Up arrow in PowerShell to recall the last command — just edit the text."