#!/usr/bin/env bash
# ============================================================================
# /ui-ux-tester — Static UI/UX audit sweep (READ-ONLY, non-destructive)
# ----------------------------------------------------------------------------
# Greps src/ for the *statically detectable* design-system violations so
# they can be recorded into .agents/reports/ui_ux_tester_records.md. This does NOT
# replace the visual/browser audit (Step 8) — it front-loads the mechanical checks.
#
# Project theme system (the CORRECT way — do not flag these):
#   Plain CSS classes backed by CSS custom properties defined in src/app/globals.css
#   (--color-primary, --color-bg, --color-text, etc.) — there is NO Tailwind in this
#   project. Dark mode is `[data-theme="dark"]` (see theme-provider.tsx / theme-toggle.tsx),
#   not a `dark:` utility-class variant.
#
# Sections:
#   1. Hardcoded colors   : #hex / rgb() / hsl() literals in TSX (outside globals.css)
#   2. Inline styles      : style={{ ... }} in TSX (prefer a CSS class + var(--token))
#   3. Hardcoded fontSize : inline fontSize: / font-size:
#   4. Clickable <div>    : <div ... onClick> (should be <button>)  [a11y]
#   5. <img> without alt  : images missing an alt attribute        [a11y]
#   6. Dark-mode coverage : how many CSS files reference [data-theme="dark"]
#
# Usage (from repo root):
#   bash .agents/skills/ui-ux-tester/scripts/run_ui_audit.sh
# ============================================================================
set -uo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../../.." && pwd)"
SRC="$ROOT/src"
cd "$ROOT"

section() { printf '\n============================================================\n== %s\n============================================================\n' "$1"; }
# Component sources only (skip tests + generated files); paths printed repo-relative.
INCL=(--include='*.ts' --include='*.tsx')
strip() { sed "s#$ROOT/##"; }

section "1. HARDCODED COLORS — #hex / rgb() / hsl() literals (use a CSS class + var(--color-*) token)"
grep -rniE '(#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\()' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | strip | head -60 \
  || echo "  clean"

section "2. INLINE STYLES — style={{ ... }} (prefer a CSS class in globals.css)"
grep -rniE 'style=\{\{' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | strip | head -60 \
  || echo "  clean"

section "3. HARDCODED FONT SIZE — inline fontSize / font-size (use an existing CSS class)"
grep -rniE '(fontSize:|font-size:)' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | strip | head -40 \
  || echo "  clean"

section "4. CLICKABLE <div> — <div ... onClick> should be a <button>  [a11y HIGH]"
grep -rniE '<div[^>]*onClick' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE '/(tests?)/' | strip | head -40 \
  || echo "  clean — no clickable divs"

section "5. <img> WITHOUT alt — images missing alt attribute  [a11y]"
grep -rniE '<img' "$SRC" "${INCL[@]}" 2>/dev/null | grep -viE 'alt=' | grep -viE '/(tests?)/' | strip | head -40 \
  || echo "  clean — every <img> line has alt (verify multi-line tags manually; also check next/image)"

section "6. DARK-MODE COVERAGE — CSS files referencing [data-theme=\"dark\"]"
total=$(find "$SRC" -name '*.css' 2>/dev/null | wc -l | tr -d ' ')
withdark=$(grep -rl 'data-theme="dark"' "$SRC" --include='*.css' 2>/dev/null | wc -l | tr -d ' ')
printf '  %s of %s CSS files reference [data-theme="dark"]\n' "$withdark" "$total"
echo "  (new color tokens added outside globals.css are candidates for dark-mode gaps)"

section "UI AUDIT COMPLETE — combine with browser check (Step 8) before recording findings"
