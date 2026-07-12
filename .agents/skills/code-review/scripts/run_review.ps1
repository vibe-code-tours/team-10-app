# ============================================================================
# /code-review - Automated static-analysis sweep (READ-ONLY)  [Windows PS 5.1]
# ----------------------------------------------------------------------------
# PowerShell equivalent of run_review.sh. NEVER modifies source (eslint/prettier
# run in CHECK mode only; everything else is Select-String / git / line counts).
#
# Usage (from repo root):
#   powershell -File .agents/skills/code-review/scripts/run_review.ps1              # vs origin/main
#   powershell -File .agents/skills/code-review/scripts/run_review.ps1 main         # vs a base ref
#   powershell -File .agents/skills/code-review/scripts/run_review.ps1 --working    # uncommitted only
# ============================================================================
param([string]$Base = 'origin/main')

$ErrorActionPreference = 'Continue'
$Root = (Resolve-Path "$PSScriptRoot\..\..\..\..").Path
$Src  = Join-Path $Root 'src'
Set-Location $Root

$Range = "$Base...HEAD"
$Working = ($Base -eq '--working')

function Section($t) { Write-Host "`n============================================================"; Write-Host "== $t"; Write-Host "============================================================" }
function Scan($paths, $pattern, $cleanMsg) {
  $files = Get-ChildItem -Path $paths -Recurse -Include *.ts,*.tsx -File -ErrorAction SilentlyContinue
  $hits = $files | Select-String -Pattern $pattern -AllMatches -ErrorAction SilentlyContinue
  if ($hits) { $hits | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.Path.Replace("$Root\",''), $_.LineNumber, $_.Line.Trim()) } } else { Write-Host "  $cleanMsg" }
}

Section "1. CHANGED FILES + DIFF STAT"
if ($Working) { git diff --stat } else { git diff --stat $Range }

Section "2. LINT - npm run lint (NO write)"
npm run lint

Section "3. FORMAT CHECK - prettier --check (NO write)"
npx prettier --check "src/**/*.{ts,tsx,css,md}"

Section "4. DOMAIN COMPLIANCE - money must never be trusted from the client"
Scan @($Src) '(price|total|amount|subtotal)\s*[:=]\s*(Number\(|parseFloat\(|parseInt\(|formData\.get|body\.|params\.)' 'clean - no client-supplied price/total assignments found'

Section "5. HARDCODED URLS - localhost / raw API endpoints outside src/lib/supabase/"
$u = Get-ChildItem $Src -Recurse -Include *.ts,*.tsx -File -ErrorAction SilentlyContinue | Select-String -Pattern '(localhost:[0-9]+|127\.0\.0\.1|https?://[^"'' ]*\.supabase\.co)' -ErrorAction SilentlyContinue | Where-Object { $_.Path -notmatch 'src[\\/]lib[\\/]supabase' }
if ($u) { $u | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.Path.Replace("$Root\",''), $_.LineNumber, $_.Line.Trim()) } } else { Write-Host "  clean - no hardcoded URLs outside src/lib/supabase/" }

Section "6. HARDCODED SECRETS (obvious patterns)"
$s = Get-ChildItem $Src -Recurse -Include *.ts,*.tsx -File -ErrorAction SilentlyContinue | Select-String -Pattern '(secret_key|api_key|password|passwd|token)\s*[:=]\s*["''][^"'']{6,}' -ErrorAction SilentlyContinue | Where-Object { $_.Line -notmatch '(process\.env|:\s*string)' }
if ($s) { $s | ForEach-Object { Write-Host ("  {0}:{1}: {2}" -f $_.Path.Replace("$Root\",''), $_.LineNumber, $_.Line.Trim()) } } else { Write-Host "  clean - no obvious hardcoded secrets" }

Section "7. FILE-SIZE GUARD - soft thresholds 300 (warn) / 500 (flag)"
$big = $false
Get-ChildItem $Src -Recurse -Include *.ts,*.tsx -File -ErrorAction SilentlyContinue | ForEach-Object {
  $n = (Get-Content $_.FullName | Measure-Object -Line).Lines
  if ($n -gt 500) { Write-Host ("  [FLAG] {0,5}  {1}" -f $n, $_.FullName.Replace("$Root\",'')); $big = $true }
  elseif ($n -gt 300) { Write-Host ("  [warn] {0,5}  {1}" -f $n, $_.FullName.Replace("$Root\",'')); $big = $true }
}
if (-not $big) { Write-Host "  all files within thresholds" }

Section "8. DEPENDENCY GUARD - package.json changes"
if ($Working) { $d = git diff -- package.json } else { $d = git diff $Range -- package.json }
if ($d) { Write-Host "`n--- package.json changed ---"; $d } else { Write-Host "  package.json - unchanged" }

Section "REVIEW SWEEP COMPLETE - record findings into .agents/reports/code_review_records.md"
