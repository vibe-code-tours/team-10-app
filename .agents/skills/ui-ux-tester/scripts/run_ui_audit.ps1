# ============================================================================
# /ui-ux-tester - Static UI/UX audit sweep (READ-ONLY)  [Windows PowerShell 5.1]
# ----------------------------------------------------------------------------
# PowerShell equivalent of run_ui_audit.sh. Greps src/ for statically
# detectable design-system violations. Does NOT replace the browser audit (Step 8).
#
# Project theme system (the CORRECT way - do not flag these): plain CSS classes backed
# by CSS custom properties in src/app/globals.css (--color-primary, --color-bg, etc.) -
# there is NO Tailwind in this project. Dark mode is [data-theme="dark"], not a
# `dark:` utility-class variant.
#
# Usage (from repo root):
#   powershell -File .agents/skills/ui-ux-tester/scripts/run_ui_audit.ps1
# ============================================================================
$ErrorActionPreference = 'Continue'
$Root = (Resolve-Path "$PSScriptRoot\..\..\..\..").Path
$Src  = Join-Path $Root 'src'
Set-Location $Root

function Section($t) { Write-Host "`n============================================================"; Write-Host "== $t"; Write-Host "============================================================" }

# Component sources only (skip test folders).
$files = Get-ChildItem $Src -Recurse -Include *.ts,*.tsx -File -ErrorAction SilentlyContinue | Where-Object { $_.FullName -notmatch '\\tests?\\' }

function Scan($pattern, $cleanMsg, $limit = 60) {
  $hits = $files | Select-String -Pattern $pattern -ErrorAction SilentlyContinue
  if ($hits) { $hits | Select-Object -First $limit | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.Path.Replace("$Root\",''), $_.LineNumber, $_.Line.Trim()) } }
  else { Write-Host "  $cleanMsg" }
}

Section "1. HARDCODED COLORS - #hex / rgb() / hsl() literals (use a CSS class + var(--color-*) token)"
Scan '(#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\()' 'clean'

Section "2. INLINE STYLES - style={{ ... }} (prefer a CSS class in globals.css)"
Scan 'style=\{\{' 'clean'

Section "3. HARDCODED FONT SIZE - inline fontSize / font-size (use an existing CSS class)"
Scan '(fontSize:|font-size:)' 'clean' 40

Section "4. CLICKABLE <div> - <div ... onClick> should be a <button>  [a11y HIGH]"
Scan '<div[^>]*onClick' 'clean - no clickable divs' 40

Section "5. <img> WITHOUT alt - images missing alt attribute  [a11y]"
$imgs = $files | Select-String -Pattern '<img' -ErrorAction SilentlyContinue | Where-Object { $_.Line -notmatch 'alt=' }
if ($imgs) { $imgs | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.Path.Replace("$Root\",''), $_.LineNumber, $_.Line.Trim()) } }
else { Write-Host "  clean - every <img> line has alt (verify multi-line tags manually; also check next/image)" }

Section "6. DARK-MODE COVERAGE - CSS files referencing [data-theme=`"dark`"]"
$cssFiles = Get-ChildItem $Src -Recurse -Include *.css -File -ErrorAction SilentlyContinue
$withdark = ($cssFiles | Select-String -Pattern 'data-theme="dark"' -List -ErrorAction SilentlyContinue).Count
Write-Host ("  {0} of {1} CSS files reference [data-theme=`"dark`"]" -f $withdark, $cssFiles.Count)
Write-Host "  (new color tokens added outside globals.css are candidates for dark-mode gaps)"

Section "UI AUDIT COMPLETE - combine with browser check (Step 8) before recording findings"
