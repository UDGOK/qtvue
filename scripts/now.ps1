#Requires -Version 5.1
<#
qtvue now — PowerShell port of scripts/now.sh

Same flow as the bash version:
  1. Read public/now.json in the qtvue repo (or QTvue_REPO path).
  2. Archive the previous "current" entry to "recent".
  3. Write a new "current" entry with your text, mood, and timestamp.
  4. git commit + git push to GitHub via the GITHUB_TOKEN env var.
  5. Vercel auto-deploys in ~30s.

Usage:
  now "Your status text" [mood] [category] [tags]

Examples:
  now "Wiring the firmware auditor" shipping engineering
  now "Investigating a deploy error" investigating bugfix
  now "Reading the new Unitree paper" reading research "g1,unitree_sdk2"
  now "Wiring the firmware auditor"             # mood defaults to 'shipping'

Moods: shipping | shipping-fast | thinking | investigating | live | reading
Categories: engineering | programming | security | research | planning | etc.
Tags (optional, comma-separated): platform/SDK/technique identifiers
  e.g. "g1,lerobot,act-policy"

Setup (one-time on Windows):
  Run .\install-windows.ps1 in PowerShell — it will:
    - Prompt for your GitHub PAT (with masked input)
    - Save it permanently to your user environment
    - Add the scripts\ directory to your user PATH
    - Create a `now.cmd` shim so `now` works from any shell

Then from any folder:
  PS C:\> now "Tuning G1 gait params" shipping engineering
#>

param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string]$Text,

    [Parameter(Mandatory = $false, Position = 1)]
    [string]$Mood = "shipping",

    [Parameter(Mandatory = $false, Position = 2)]
    [string]$Category = "engineering",

    [Parameter(Mandatory = $false, Position = 3)]
    [string]$Tags = ""
)

$ErrorActionPreference = "Stop"

# ---------------------------------------------------------------- helpers
function Find-QtvueRepo {
    $cwd = (Get-Location).Path
    while ($cwd -ne "") {
        if ((Test-Path (Join-Path $cwd "public/now.json")) -and (Test-Path (Join-Path $cwd ".git"))) {
            return $cwd
        }
        $parent = Split-Path -Parent $cwd
        if ($parent -eq $cwd) { break }
        $cwd = $parent
    }

    # Fallback: script's own location
    $scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    if (Test-Path (Join-Path $scriptDir "..\public\now.json")) {
        return (Resolve-Path (Join-Path $scriptDir "..")).Path
    }
    return $null
}

function Get-GitHubToken {
    param([string]$CurrentToken)

    if ($CurrentToken -and $CurrentToken.Length -gt 0) {
        return $CurrentToken
    }

    Write-Host ""
    Write-Host "ERROR: GITHUB_TOKEN is not set." -ForegroundColor Red
    Write-Host ""
    Write-Host "Create a Personal Access Token at:"
    Write-Host "  https://github.com/settings/tokens"
    Write-Host ""
    Write-Host "Settings:"
    Write-Host "  - Name:        qtvue-now-cli"
    Write-Host "  - Expiration:  90 days"
    Write-Host "  - Scopes:      repo (only)"
    Write-Host ""
    Write-Host "Then either:" -ForegroundColor Yellow
    Write-Host "  (a) Run install-windows.ps1 to save it permanently, OR"
    Write-Host "  (b) Run this once:  [Environment]::SetEnvironmentVariable('GITHUB_TOKEN', 'ghp_xxx...', 'User')"
    Write-Host "      Then open a new PowerShell window."
    Write-Host ""
    exit 1
}

# ---------------------------------------------------------------- locate repo
$Repo = $env:QTvue_REPO
if (-not $Repo) {
    $Repo = Find-QtvueRepo
}

if (-not $Repo -or -not (Test-Path (Join-Path $Repo "public/now.json"))) {
    Write-Host "ERROR: Cannot find public/now.json." -ForegroundColor Red
    Write-Host ""
    Write-Host "Either:"
    Write-Host "  (a) Run from inside the qtvue repo, or"
    Write-Host "  (b) Set QTvue_REPO environment variable"
    Write-Host ""
    Write-Host "Get the repo:"
    Write-Host "  git clone https://github.com/UDGOK/qtvue.git C:\Users\$env:USERNAME\qtvue"
    exit 1
}

Write-Host "Repo: $Repo" -ForegroundColor DarkGray

# ---------------------------------------------------------------- token check
$Token = Get-GitHubToken -CurrentToken $env:GITHUB_TOKEN

# ---------------------------------------------------------------- validate mood
$ValidMoods = @("shipping", "shipping-fast", "thinking", "investigating", "live", "reading")
if ($ValidMoods -notcontains $Mood) {
    Write-Host "WARN: unknown mood '$Mood' (using as-is; expected: $($ValidMoods -join ', '))" -ForegroundColor Yellow
}

# ---------------------------------------------------------------- update JSON
$JsonPath = Join-Path $Repo "public/now.json"

try {
    $Data = Get-Content $JsonPath -Raw -Encoding UTF8 | ConvertFrom-Json
} catch {
    Write-Host "ERROR: failed to parse $JsonPath" -ForegroundColor Red
    Write-Host $_.Exception.Message
    exit 1
}

# Build new entry
$Now = (Get-Date).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$Expires = (Get-Date).AddDays(2).ToUniversalTime().ToString("yyyy-MM-ddTHH:mm:ssZ")
$Id = "now-" + [guid]::NewGuid().ToString("N").Substring(0, 8)

$TagsArray = @()
if ($Tags -and $Tags.Trim().Length -gt 0) {
    $TagsArray = $Tags -split "," | ForEach-Object { $_.Trim() } | Where-Object { $_ -ne "" }
}

$NewEntry = [ordered]@{
    id        = $Id
    text      = $Text
    mood      = $Mood
    category  = $Category
    link      = $null
    postedAt  = $Now
    expiresAt = $Expires
}
if ($TagsArray.Count -gt 0) {
    $NewEntry["tags"] = $TagsArray
}

# Archive previous current → top of recent
if ($Data.current) {
    if (-not $Data.recent) { $Data.recent = @() }
    # Convert PSCustomObject → ordered hashtable to preserve insertion order
    $PrevCurrent = [ordered]@{}
    foreach ($prop in $Data.current.PSObject.Properties) {
        $PrevCurrent[$prop.Name] = $prop.Value
    }
    $Data.recent = @($PrevCurrent) + @($Data.recent | Select-Object)
    $Data.recent = @($Data.recent | Select-Object -First 20)
}

$Data.current = $NewEntry
$Data.updated = $Now
if (-not $Data.version) { $Data.version = 1 }

# Write back with stable field ordering
$Ordered = [ordered]@{}
foreach ($prop in "version", "updated", "current", "recent") {
    if ($null -ne $Data.$prop) { $Ordered[$prop] = $Data.$prop }
}
$Json = $Ordered | ConvertTo-Json -Depth 20
# PowerShell 5.1 emits UTF-8 with BOM by default; ConvertFrom-Json
# tolerates it, but git diff is cleaner without. Strip the BOM.
if ($Json.StartsWith([char]0xFEFF)) { $Json = $Json.Substring(1) }
$Json | Out-File -FilePath $JsonPath -Encoding utf8 -NoNewline

Write-Host ""
Write-Host "  id:        $Id"
Write-Host "  text:      $Text"
Write-Host "  mood:      $Mood"
Write-Host "  category:  $Category"
if ($TagsArray.Count -gt 0) {
    Write-Host "  tags:      $($TagsArray -join ', ')"
}
Write-Host "  postedAt:  $Now"

# ---------------------------------------------------------------- commit + push
Write-Host ""
Write-Host "→ Committing and pushing..."

Push-Location $Repo
try {
    git add public/now.json 2>&1 | Out-Null

    $CommitMsg = "now: $Text"
    $CommitOutput = git -c user.email="now@qtvue.com" -c user.name="qtvue now CLI" commit -m $CommitMsg --no-verify 2>&1
    if ($LASTEXITCODE -ne 0) {
        # Could be 'nothing to commit' — handle gracefully
        if ($CommitOutput -match "nothing to commit") {
            Write-Host "WARN: nothing to commit (entry text identical to last?)" -ForegroundColor Yellow
        } else {
            Write-Host $CommitOutput
            throw "git commit failed"
        }
    }

    $Remote = "https://x-access-token:${Token}@github.com/UDGOK/qtvue.git"
    $Branch = if ($env:QTvue_BRANCH) { $env:QTvue_BRANCH } else { "main" }

    $PushOutput = git push $Remote $Branch --no-verify 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host ""
        Write-Host "✗ Push failed." -ForegroundColor Red
        Write-Host $PushOutput
        Write-Host ""
        Write-Host "The commit is local — retry manually:"
        Write-Host "  cd $Repo"
        Write-Host "  git push https://x-access-token:`$GITHUB_TOKEN@github.com/UDGOK/qtvue.git $Branch"
        exit 1
    }

    Write-Host ""
    Write-Host "✓ Pushed. Vercel will deploy in ~30s." -ForegroundColor Green
    Write-Host "  Live at: https://qtvue.com/now"
}
finally {
    Pop-Location
}