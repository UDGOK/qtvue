#!/usr/bin/env bash
#
# qtvue now — post a daily update to qtvue.com from your PC.
#
# What this does:
#   1. Reads public/now.json in the qtvue repo (or a path you specify).
#   2. Archives the previous "current" entry to the "recent" list.
#   3. Writes a new "current" entry with your text, mood, and timestamp.
#   4. git commit + git push to GitHub.
#   5. Vercel auto-deploys in ~30s. Status appears on qtvue.com.
#
# Setup (once):
#   1. Create a GitHub PAT at https://github.com/settings/tokens
#      with 'repo' scope.
#   2. Add it to your shell rc:
#        echo 'export GITHUB_TOKEN=ghp_...' >> ~/.zshrc   (or ~/.bashrc)
#        source ~/.zshrc
#   3. Clone the qtvue repo locally:
#        git clone https://github.com/UDGOK/qtvue.git ~/qtvue
#   4. (Optional) Alias the script globally:
#        ln -s ~/qtvue/scripts/now.sh /usr/local/bin/now
#
# Usage:
#   now "Your status text here" [mood] [category]
#
# Examples:
#   now "Wiring up the firmware auditor" shipping engineering
#   now "Investigating a deploy error" investigating bugfix
#   now "Reading the new Unitree paper" reading
#   now "Wiring up the firmware auditor" shipping  # mood defaults to 'shipping'
#   now "" shipping  # error: empty text
#
# Moods (color-coded on the site):
#   shipping       (default, forest green)  — actively shipping something
#   shipping-fast  (mint accent)            — shipping fast, look at this
#   thinking       (neutral ink)            — heads-down on a design problem
#   investigating  (amber)                  — digging into a bug
#   live           (red)                     — urgent, customer-impacting
#   reading        (text-secondary)         — consuming a paper / doc
#
# Environment variables:
#   GITHUB_TOKEN   (required) GitHub PAT with 'repo' scope.
#   QTvue_REPO     (optional) Path to qtvue repo. Default: ~/qtvue
#                   or $PWD if it contains public/now.json.
#
set -euo pipefail

# ---------------------------------------------------------------- locate repo
find_repo() {
  local cwd="$PWD"
  while [[ "$cwd" != "/" ]]; do
    if [[ -f "$cwd/public/now.json" && -d "$cwd/.git" ]]; then
      echo "$cwd"
      return 0
    fi
    cwd="$(dirname "$cwd")"
  done
  echo ""
  return 1
}

REPO="${QTvue_REPO:-$(find_repo || true)}"
if [[ -z "$REPO" ]]; then
  # Fall back to script's own location
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  if [[ -f "$SCRIPT_DIR/../public/now.json" ]]; then
    REPO="$(cd "$SCRIPT_DIR/.." && pwd)"
  fi
fi

if [[ -z "$REPO" || ! -f "$REPO/public/now.json" ]]; then
  cat >&2 <<'EOF'
ERROR: Cannot find public/now.json.

Either:
  (a) Run this script from inside the qtvue repo, or
  (b) Set QTvue_REPO=/path/to/qtvue

Get the repo:
  git clone https://github.com/UDGOK/qtvue.git ~/qtvue
EOF
  exit 1
fi

# ---------------------------------------------------------------- token check
if [[ -z "${GITHUB_TOKEN:-}" ]]; then
  cat >&2 <<'EOF'
ERROR: GITHUB_TOKEN is not set.

Create a PAT at https://github.com/settings/tokens with 'repo' scope,
then add it to your shell:

  echo 'export GITHUB_TOKEN=ghp_xxx...' >> ~/.zshrc
  source ~/.zshrc
EOF
  exit 1
fi

# ---------------------------------------------------------------- args
TEXT="${1:-}"
MOOD="${2:-shipping}"
CATEGORY="${3:-engineering}"

if [[ -z "$TEXT" ]]; then
  cat <<EOF
qtvue now — post a daily update

Usage:
  now "your status text" [mood] [category]

Moods: shipping | shipping-fast | thinking | investigating | live | reading
Categories: engineering | bugfix | seo | research | etc.

Examples:
  now "Wiring up the firmware auditor" shipping engineering
  now "Investigating a deploy error" investigating bugfix
  now "Reading the new Unitree paper" reading
EOF
  exit 1
fi

# ---------------------------------------------------------------- validate
case "$MOOD" in
  shipping|shipping-fast|thinking|investigating|live|reading) ;;
  *)
    echo "WARN: unknown mood '$MOOD' (using as-is; expected: shipping|shipping-fast|thinking|investigating|live|reading)" >&2
    ;;
esac

# ---------------------------------------------------------------- update JSON
JSON="$REPO/public/now.json"

python3 - "$JSON" "$TEXT" "$MOOD" "$CATEGORY" <<'PYEOF'
import json
import sys
import datetime
import uuid

json_path, text, mood, category = sys.argv[1:5]

with open(json_path, "r", encoding="utf-8") as f:
    data = json.load(f)

# Build new entry
now_iso = datetime.datetime.utcnow().strftime("%Y-%m-%dT%H:%M:%SZ")
expires_iso = (datetime.datetime.utcnow() + datetime.timedelta(days=2)).strftime("%Y-%m-%dT%H:%M:%SZ")
new_id = "now-" + uuid.uuid4().hex[:8]

new_entry = {
    "id": new_id,
    "text": text,
    "mood": mood,
    "category": category,
    "link": None,
    "postedAt": now_iso,
    "expiresAt": expires_iso,
}

# Archive previous current to top of recent
if data.get("current"):
    if "recent" not in data:
        data["recent"] = []
    data["recent"].insert(0, data["current"])
    data["recent"] = data["recent"][:20]  # keep last 20

data["current"] = new_entry
data["updated"] = now_iso
data.setdefault("version", 1)

with open(json_path, "w", encoding="utf-8") as f:
    json.dump(data, f, indent=2, ensure_ascii=False)
    f.write("\n")

print(f"  id:        {new_id}")
print(f"  text:      {text}")
print(f"  mood:      {mood}")
print(f"  category:  {category}")
print(f"  postedAt:  {now_iso}")
PYEOF

# ---------------------------------------------------------------- commit + push
echo ""
echo "→ Committing and pushing..."

cd "$REPO"
git add public/now.json
git -c user.email="now@qtvue.com" -c user.name="qtvue now CLI" commit -m "now: $TEXT" --no-verify >/dev/null

# Push via HTTPS + token (works on any PC, no SSH setup needed)
REMOTE_URL="https://x-access-token:${GITHUB_TOKEN}@github.com/UDGOK/qtvue.git"
BRANCH="main"

if git push "$REMOTE_URL" "$BRANCH" --no-verify 2>&1 | tail -5; then
  echo ""
  echo "✓ Pushed. Vercel will deploy in ~30s."
  echo "  Live at: https://qtvue.com/now"
else
  echo ""
  echo "✗ Push failed. The commit is local — you can retry with:"
  echo "    cd $REPO && git push https://x-access-token:\$GITHUB_TOKEN@github.com/UDGOK/qtvue.git main"
  exit 1
fi