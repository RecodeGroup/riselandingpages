#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Rise Dashboard → GitHub push (one-time)
# Dubbelklik dit bestand om uit te voeren.
# ═══════════════════════════════════════════════════════════

set -e
cd "$(dirname "$0")"

REPO_URL="https://github.com/RecodeGroup/riselandingpages.git"

echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  Rise Dashboard → GitHub                     ║"
echo "╚══════════════════════════════════════════════╝"
echo ""

# ── 0. Clean up stale lock file if present ──
if [ -f ".git/index.lock" ]; then
  rm -f ".git/index.lock"
  echo "✓ Stale lock file verwijderd"
fi

# ── 1. Init git ──
if [ ! -d ".git" ]; then
  git init -b main
  echo "✓ Git repo geïnitialiseerd"
elif ! git log --oneline -1 &>/dev/null 2>&1; then
  # .git exists but no commits (leftover from failed init)
  rm -rf .git
  git init -b main
  echo "✓ Git repo opnieuw geïnitialiseerd"
else
  echo "✓ Git repo bestaat al"
fi

# ── 2. Set remote ──
if ! git remote get-url origin &>/dev/null 2>&1; then
  git remote add origin "$REPO_URL"
  echo "✓ Remote ingesteld: $REPO_URL"
else
  echo "✓ Remote bestaat al"
fi

# ── 3. Stage & commit ──
git add -A
if git diff --cached --quiet 2>/dev/null; then
  echo "✓ Geen nieuwe wijzigingen om te committen"
else
  git commit -m "Initial commit: Rise onboarding dashboard

All landing pages, assets and admin tools for rise-onboarding.netlify.app"
  echo "✓ Commit gemaakt"
fi

# ── 4. Push ──
echo ""
echo "→ Pushen naar GitHub..."
echo "  (Als dit de eerste keer is, vraagt Git om je GitHub-login)"
echo ""
git push -u origin main
echo ""
echo "✓ Code staat op GitHub!"

# ── 5. Done ──
echo ""
echo "╔══════════════════════════════════════════════╗"
echo "║  ✓ Klaar!                                    ║"
echo "╚══════════════════════════════════════════════╝"
echo ""
echo "  Repo: https://github.com/RecodeGroup/riselandingpages"
echo ""
echo "  VOLGENDE STAP: Netlify koppelen"
echo "  ─────────────────────────────────"
echo "  1. Ga naar je Netlify site → Site configuration"
echo "     → Build & deploy → Link site to Git"
echo "  2. Kies GitHub → riselandingpages"
echo "  3. Branch: main  |  Publish directory: /"
echo "  4. Klik Deploy"
echo ""
echo "  COLLEGA'S TOEVOEGEN:"
echo "  ─────────────────────────────────"
echo "  github.com/RecodeGroup/riselandingpages/settings/access"
echo "  → Add people → hun GitHub username of e-mail"
echo ""

open "https://github.com/RecodeGroup/riselandingpages"

read -p "Druk Enter om dit venster te sluiten..."
