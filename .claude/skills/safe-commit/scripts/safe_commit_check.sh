#!/usr/bin/env bash
# ============================================================================
# /safe-commit — Phase automation helper
# ----------------------------------------------------------------------------
# Automates the mechanical parts of the safe-commit workflow. Approval gates
# stay with the agent/user — this script only GATHERS EVIDENCE and RUNS CHECKS.
#
#   safety     (Phase 1, read-only)  Sensitive-file sweep:
#                - tracked files matching secret/db patterns (already in git!)
#                - untracked-but-not-ignored sensitive files (one `git add -A` from leaking)
#                - .gitignore coverage gaps
#   format     (Phase 2, WRITE)      Prettier-format the touched src/ files.
#   precheck   (Phase 3, read-only)  `npm run lint` if the change touches src/.
#   summary    (Phase 6, read-only)  git status + diff stat grouped by top-level area,
#                                    to help propose atomic commit groups.
#
# Usage (from repo root):
#   bash .agents/skills/safe-commit/scripts/safe_commit_check.sh safety
#   bash .agents/skills/safe-commit/scripts/safe_commit_check.sh format
#   bash .agents/skills/safe-commit/scripts/safe_commit_check.sh precheck
#   bash .agents/skills/safe-commit/scripts/safe_commit_check.sh summary
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
cd "$ROOT"

# Patterns that indicate a sensitive or data file. Tune here, not inline.
# NOTE: `.env.example` / `.env.sample` are templates and intentionally tracked — excluded.
SENSITIVE_RE='(\.env($|\.local|\.production|\.development)|\.db$|\.sqlite3?$|\.pem$|\.key$|service_account.*\.json|credentials/|secrets?\.|token.*\.json|\.p12$)'
# ALLOWLIST: intentionally-versioned files that match SENSITIVE_RE but are approved
# source-of-truth data — NOT a leak. See git_workflow.md §4 + database_rules.
ALLOWLIST_RE='\.env\.example$'

section() { printf '\n============================================================\n== %s\n============================================================\n' "$1"; }
run()     { printf '\n$ %s\n' "$*"; "$@" || printf '\n[exit %s] (non-fatal — treat as finding)\n' "$?"; }

# Does the current change touch app code? (staged + unstaged + untracked)
touched() {
  { git diff --name-only; git diff --cached --name-only; git ls-files --others --exclude-standard; } | sort -u
}
touches_app() { touched | grep -q '^src/'; }

cmd_safety() {
  section "PHASE 1 — DATA SAFETY SWEEP (read-only)"
  local bad=0

  echo "--- 1a. TRACKED files matching sensitive patterns (already in git history!) ---"
  local tracked; tracked=$(git ls-files | grep -iE "$SENSITIVE_RE" | grep -ivE "$ALLOWLIST_RE" || true)
  if [ -n "$tracked" ]; then printf '%s\n' "$tracked" | sed 's/^/  🔴 /'; bad=1
  else echo "  ✅ none"; fi

  echo ""
  echo "--- 1b. UNTRACKED + NOT-IGNORED sensitive files (one 'git add -A' from leaking) ---"
  local loose; loose=$(git ls-files --others --exclude-standard | grep -iE "$SENSITIVE_RE" | grep -ivE "$ALLOWLIST_RE" || true)
  if [ -n "$loose" ]; then printf '%s\n' "$loose" | sed 's/^/  🟡 /'; bad=1
  else echo "  ✅ none"; fi

  echo ""
  echo "--- 1c. .gitignore coverage of common sensitive patterns ---"
  for pat in '.env' '*.db' 'credentials/' 'service_account' '*.pem' '*.key'; do
    if grep -qF -- "$pat" .gitignore 2>/dev/null; then printf '  ✅ %s\n' "$pat"
    else printf '  ⚠️  %s — not in .gitignore\n' "$pat"; fi
  done

  echo ""
  if [ "$bad" -eq 1 ]; then
    echo "RESULT: 🔴 STOP — alert the user before proceeding to Phase 2."
    echo "  Untrack a leaked file :  git rm --cached <file>   (keeps it on disk)"
    echo "  Then add its pattern to .gitignore. NEVER auto-run these without approval."
  else
    echo "RESULT: ✅ clean — proceed to Phase 2."
  fi
}

cmd_format() {
  section "PHASE 2 — AUTO-FORMAT (writes files; only if src/ touched)"
  if touches_app; then
    echo "src/ touched → npx prettier --write \"src/**/*.{js,jsx,ts,tsx,css,md}\""
    run npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,md}"
  else echo "src/ untouched — skipped"; fi
}

cmd_precheck() {
  section "PHASE 3 — PRE-CHECK (lint; read-only)"
  if touches_app; then
    run npm run lint
  else echo "src/ untouched — lint skipped"; fi
}

cmd_summary() {
  section "PHASE 6 — CHANGE SUMMARY (for atomic commit grouping)"
  git status --short 2>/dev/null
  echo ""
  echo "--- diff stat (working tree + staged) ---"
  git diff HEAD --stat 2>/dev/null   # 2>/dev/null silences CRLF line-ending warnings
  echo ""
  echo "--- files grouped by top-level area ---"
  touched | awk -F/ '{ if (NF>=2) print $1"/"$2; else print $1 }' | sort | uniq -c | sort -rn | sed 's/^/  /'
}

case "${1:-}" in
  safety)   cmd_safety ;;
  format)   cmd_format ;;
  precheck) cmd_precheck ;;
  summary)  cmd_summary ;;
  *) echo "Usage: safe_commit_check.sh <safety|format|precheck|summary>"; exit 0 ;;
esac
