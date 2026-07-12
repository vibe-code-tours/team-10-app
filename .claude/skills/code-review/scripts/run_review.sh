#!/usr/bin/env bash
# ============================================================================
# /code-review — Automated static-analysis sweep (READ-ONLY, non-destructive)
# ----------------------------------------------------------------------------
# Gathers the mechanical evidence a reviewer needs so findings can be recorded
# into .agents/reports/code_review_records.md. NEVER modifies source:
#   eslint/prettier run in CHECK mode only; everything else is grep/git/wc.
#
# Sections:
#   1. Changed files + diff stat (review scope)
#   2. Lint            : npm run lint
#   3. Format check    : prettier --check "src/**/*.{ts,tsx,css,md}"
#   4. Domain compliance : money handled as numeric, no client-trusted prices
#   5. Hardcoded URLs  : localhost/raw API endpoints outside src/lib/supabase/
#   6. Hardcoded secrets : obvious secret patterns
#   7. File-size guard : .ts/.tsx over soft thresholds (300 warn / 500 flag)
#   8. Dependency guard : diff of package.json vs the base ref
#
# Usage (from repo root):
#   bash .agents/skills/code-review/scripts/run_review.sh              # vs origin/main
#   bash .agents/skills/code-review/scripts/run_review.sh main         # vs a given base ref
#   bash .agents/skills/code-review/scripts/run_review.sh --working    # uncommitted changes only
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
SRC="$ROOT/src"
cd "$ROOT"

BASE="${1:-origin/main}"
DIFF_RANGE="$BASE...HEAD"
if [ "$BASE" = "--working" ]; then DIFF_RANGE=""; fi

section() { printf '\n============================================================\n== %s\n============================================================\n' "$1"; }
run()     { printf '\n$ %s\n' "$*"; "$@" || printf '\n[exit %s] (non-fatal — recorded as finding)\n' "$?"; }

# ---------------------------------------------------------------------------
section "1. CHANGED FILES + DIFF STAT  (range: ${DIFF_RANGE:-working tree})"
if [ -z "$DIFF_RANGE" ]; then run git diff --stat; else run git diff --stat "$DIFF_RANGE"; fi

# ---------------------------------------------------------------------------
section "2. LINT — npm run lint (NO write)"
run npm run lint

# ---------------------------------------------------------------------------
section "3. FORMAT CHECK — prettier --check (NO write)"
run npx prettier --check "src/**/*.{ts,tsx,css,md}"

# ---------------------------------------------------------------------------
section "4. DOMAIN COMPLIANCE — money must never be trusted from the client"
# Prices/totals must be read from the DB inside a Server Action, never taken from form input.
run grep -rniE '(price|total|amount|subtotal)\s*[:=]\s*(Number\(|parseFloat\(|parseInt\(|formData\.get|body\.|params\.)' \
  "$SRC" --include='*.ts' --include='*.tsx' \
  || echo "  clean — no client-supplied price/total assignments found"

# ---------------------------------------------------------------------------
section "5. HARDCODED URLS — localhost / raw API endpoints outside src/lib/supabase/"
run grep -rniE '(localhost:[0-9]+|127\.0\.0\.1|https?://[^"'"'"' ]*\.supabase\.co)' \
  "$SRC" --include='*.ts' --include='*.tsx' \
  | grep -v 'src/lib/supabase/' \
  || echo "  clean — no hardcoded URLs outside src/lib/supabase/"

# ---------------------------------------------------------------------------
section "6. HARDCODED SECRETS (obvious patterns)"
run grep -rniE '(secret_key|api_key|password|passwd|token)\s*[:=]\s*["'"'"'][^"'"'"']{6,}' \
  "$SRC" --include='*.ts' --include='*.tsx' \
  | grep -viE '(process\.env|=\s*""|:\s*string)' \
  || echo "  clean — no obvious hardcoded secrets"

# ---------------------------------------------------------------------------
section "7. FILE-SIZE GUARD — soft thresholds 300 (warn) / 500 (flag)"
found_big=0
while IFS= read -r f; do
  [ -f "$f" ] || continue
  n=$(wc -l < "$f" | tr -d ' ')
  if   [ "$n" -gt 500 ]; then printf '  🔴 %5s  %s\n' "$n" "${f#$ROOT/}"; found_big=1
  elif [ "$n" -gt 300 ]; then printf '  🟡 %5s  %s\n' "$n" "${f#$ROOT/}"; found_big=1
  fi
done < <(find "$SRC" \( -name '*.ts' -o -name '*.tsx' \) 2>/dev/null)
[ "$found_big" -eq 0 ] && echo "  all files within thresholds"

# ---------------------------------------------------------------------------
section "8. DEPENDENCY GUARD — changes to package.json"
if [ -z "$DIFF_RANGE" ]; then d=$(git diff -- package.json); else d=$(git diff "$DIFF_RANGE" -- package.json); fi
if [ -n "$d" ]; then printf '\n--- package.json changed ---\n%s\n' "$d"; else echo "  package.json — unchanged"; fi

section "REVIEW SWEEP COMPLETE — record findings into .agents/reports/code_review_records.md"
