# ============================================================================
# /safe-commit - Phase automation helper  [Windows PowerShell 5.1]
# ----------------------------------------------------------------------------
# PowerShell equivalent of safe_commit_check.sh. Gathers evidence and runs
# checks; approval gates stay with the agent/user.
#
#   safety     (Phase 1, read-only)  Sensitive-file sweep (tracked / loose / .gitignore gaps)
#   format     (Phase 2, WRITE)      Prettier-format the touched src/ files
#   precheck   (Phase 3, read-only)  `npm run lint` if the change touches src/
#   summary    (Phase 6, read-only)  Change summary for atomic commit grouping
#
# Usage (from repo root):
#   powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 safety
#   powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 format
#   powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 precheck
#   powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 summary
# ============================================================================
param([ValidateSet('safety','format','precheck','summary')][string]$Cmd = 'safety')

$ErrorActionPreference = 'Continue'
$Root = (Resolve-Path "$PSScriptRoot\..\..\..\..").Path
Set-Location $Root

# .env.example / .env.sample are templates and intentionally tracked - excluded.
$SensitiveRe = '(\.env($|\.local|\.production|\.development)|\.db$|\.sqlite3?$|\.pem$|\.key$|service_account.*\.json|credentials/|secrets?\.|token.*\.json|\.p12$)'
# ALLOWLIST: intentionally-versioned template files (not a leak).
$AllowlistRe = '\.env\.example$'

function Section($t) { Write-Host "`n============================================================"; Write-Host "== $t"; Write-Host "============================================================" }

function Touched { @(git diff --name-only) + @(git diff --cached --name-only) + @(git ls-files --others --exclude-standard) | Sort-Object -Unique }
function Touches-App { (Touched) -match '^src/' }

function Cmd-Safety {
  Section "PHASE 1 - DATA SAFETY SWEEP (read-only)"
  $bad = $false

  Write-Host "--- 1a. TRACKED files matching sensitive patterns (already in git history!) ---"
  $tracked = git ls-files | Where-Object { $_ -match $SensitiveRe -and $_ -notmatch $AllowlistRe }
  if ($tracked) { $tracked | ForEach-Object { Write-Host "  [LEAKED] $_" }; $bad = $true } else { Write-Host "  [OK] none" }

  Write-Host "`n--- 1b. UNTRACKED + NOT-IGNORED sensitive files (one 'git add -A' from leaking) ---"
  $loose = git ls-files --others --exclude-standard | Where-Object { $_ -match $SensitiveRe -and $_ -notmatch $AllowlistRe }
  if ($loose) { $loose | ForEach-Object { Write-Host "  [RISK]   $_" }; $bad = $true } else { Write-Host "  [OK] none" }

  Write-Host "`n--- 1c. .gitignore coverage of common sensitive patterns ---"
  $gi = if (Test-Path .gitignore) { Get-Content .gitignore -Raw } else { '' }
  foreach ($pat in @('.env','*.db','credentials/','service_account','*.pem','*.key')) {
    if ($gi.Contains($pat)) { Write-Host "  [OK]   $pat" } else { Write-Host "  [GAP]  $pat - not in .gitignore" }
  }

  Write-Host ""
  if ($bad) {
    Write-Host "RESULT: STOP - alert the user before proceeding to Phase 2."
    Write-Host "  Untrack a leaked file :  git rm --cached <file>   (keeps it on disk)"
    Write-Host "  Then add its pattern to .gitignore. NEVER auto-run these without approval."
  } else { Write-Host "RESULT: clean - proceed to Phase 2." }
}

function Cmd-Format {
  Section "PHASE 2 - AUTO-FORMAT (writes files; only if src/ touched)"
  if (Touches-App) { Write-Host "src/ touched -> npx prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md}'"; npx prettier --write 'src/**/*.{js,jsx,ts,tsx,css,md}' } else { Write-Host "src/ untouched - skipped" }
}

function Cmd-Precheck {
  Section "PHASE 3 - PRE-CHECK (lint; read-only)"
  if (Touches-App) { npm run lint } else { Write-Host "src/ untouched - lint skipped" }
}

function Cmd-Summary {
  Section "PHASE 6 - CHANGE SUMMARY (for atomic commit grouping)"
  git -c core.safecrlf=false status --short
  Write-Host "`n--- diff stat (working tree + staged) ---"
  git -c core.safecrlf=false diff HEAD --stat
  Write-Host "`n--- files grouped by top-level area ---"
  Touched | ForEach-Object { ($_ -split '/')[0..([Math]::Min(1, ($_ -split '/').Count - 1))] -join '/' } | Group-Object | Sort-Object Count -Descending | ForEach-Object { Write-Host ("  {0,4}  {1}" -f $_.Count, $_.Name) }
}

switch ($Cmd) {
  'safety'   { Cmd-Safety }
  'format'   { Cmd-Format }
  'precheck' { Cmd-Precheck }
  'summary'  { Cmd-Summary }
}
