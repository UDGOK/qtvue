# qtvue now — Windows setup

You need a GitHub Personal Access Token (PAT) with `repo` scope,
and the qtvue repo cloned locally. After a 3-minute install, you
can post a "now" status from any shell on your PC.

## 1. Get a GitHub Personal Access Token (1 minute)

1. Go to **https://github.com/settings/tokens** -> **Generate new token** -> **Classic**
2. Name: `qtvue-now-cli`
3. Expiration: 90 days (or no expiration)
4. Scopes: **repo** (only this — full repo access)
5. Click **Generate token** -> copy it (you only see it once!)

It looks like: `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 2. Clone the repo (30 seconds)

```powershell
cd C:\Users\$env:USERNAME
git clone https://github.com/UDGOK/qtvue.git qtvue
```

## 3. Run the installer (60 seconds)

```powershell
cd C:\Users\$env:USERNAME\qtvue
git pull
powershell -ExecutionPolicy Bypass -File .\scripts\install-windows.ps1
```

The installer will:
- Prompt for your GitHub PAT (input is hidden)
- Save it permanently to your user environment
- Add `scripts\` to your user PATH
- Verify the install

## 4. Open a new PowerShell window

The PATH changes only apply to new windows. Press **Win+R**, type `powershell`, hit Enter.

## 5. Post your first status

From anywhere:

```powershell
now "Tuning H1 footstep planner for 12cm obstacles" shipping-fast engineering
```

Output:
```
Repo: C:\Users\Yasir\qtvue
  id:        now-1234abcd
  text:      Tuning H1 footstep planner for 12cm obstacles
  mood:      shipping-fast
  category:  engineering
  postedAt:  2026-06-22T20:30:00Z

-> Committing and pushing...
 [OK] Pushed. Vercel will deploy in ~30s.
  Live at: https://qtvue.com/now
```

Refresh qtvue.com in 30-60s — your status is in the header + on /now.

## With tags

The 4th argument is an optional comma-separated list of engineering tags
that show up as small chips below each timeline entry:

```powershell
now "Deployed ACT policy to 4 Go2s. 67% -> 89% at 8cm." shipping-fast programming "go2,lerobot,act-policy,imitation-learning"
```

## Moods

| Mood | Color on site | When to use |
|---|---|---|
| `shipping` | forest green | default — actively shipping something |
| `shipping-fast` | mint accent | urgent deliver, look at this |
| `investigating` | amber | digging into a bug |
| `thinking` | dark ink | heads-down on a design problem |
| `live` | red | customer-impacting, urgent |
| `reading` | neutral | consuming a paper / doc |

## Useful patterns

```powershell
# PowerShell history is gold - Up arrow to recall the last `now` command
now "Patched 12 G1s in customer fleet to firmware 1.5.3" shipping-fast security "g1,unipwn-2025,firmware-1.5.3"

# Use quotes for any text with spaces
now "Tracking Go2 IMU drift under cold-start" investigating engineering "go2,imu,magnetometer"

# Different shell? Use now.cmd from cmd.exe, or call the .ps1 directly
powershell -ExecutionPolicy Bypass -File C:\Users\Yasir\qtvue\scripts\now.ps1 "Reading the new paper" reading research
```

## Troubleshooting

**`now` not recognized after install:**
- Open a NEW PowerShell window (PATH changes don't retroactively apply)
- Or run `now` with full path: `C:\Users\Yasir\qtvue\scripts\now.cmd`

**`ERROR: GITHUB_TOKEN is not set`:**
- Run the installer again: `.\scripts\install-windows.ps1`
- Or check: `[Environment]::GetEnvironmentVariable("GITHUB_TOKEN", "User")`

**Push fails with 403:**
- Token expired or missing `repo` scope
- Regenerate at https://github.com/settings/tokens

**Push fails with 404:**
- Branch name wrong (default `main`)
- Set: `$env:QTvue_BRANCH = "master"` (or whatever your branch is)

**Status doesn't appear after 1 min:**
- Vercel build failed. Check https://vercel.com/dashboard -> qtvue -> Deployments

## Why the parser error happened (and why it's fixed)

PowerShell 5.1 (the version that ships with Windows 10/11) reads `.ps1`
files as **Windows-1252** by default. Any Unicode characters like
arrows (`->`), check marks (`[OK]`), or box drawing (`+===+`) get
mangled into multi-byte mojibake (`a->`, etc.) and break the parser.

The fix is two-part:
1. **ASCII-only script content** — works regardless of encoding
2. **UTF-8 BOM at the start of the file** — tells PowerShell 5.1 to
   read the file as UTF-8 from the start

Both files now have a 3-byte UTF-8 BOM (`EF BB BF`) at the start AND
only ASCII content. They'll parse cleanly in any PowerShell version.

## Files

```
scripts/
├── install-windows.ps1   <- one-time installer (run this)
├── now.ps1               <- the actual script (called by now.cmd)
├── now.cmd               <- cmd.exe wrapper
├── now.sh                <- Mac/Linux version (works in WSL / Git Bash too)
└── README-windows.md     <- you are here
```