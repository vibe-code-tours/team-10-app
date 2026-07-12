---
name: safe-commit
description: Master "Finish Feature" workflow. Ensures data safety, auto-formats code, runs tests, orchestrates docs/memory updates, executes atomic commits, and pushes to remote with human approval at each stage.
---

# safe-commit — Master Workflow for Finishing a Task

> **Why this exists:** To ensure that before any code is committed, sensitive data is protected, code is properly formatted, tests pass, documentation is updated, decisions are persisted, commits are atomic, and work is synced online.

## Helper script (automates Phases 1, 2, 3, 6-prep)

```bash
bash .agents/skills/safe-commit/scripts/safe_commit_check.sh safety     # Phase 1 (read-only)
bash .agents/skills/safe-commit/scripts/safe_commit_check.sh format    # Phase 2 (writes files)
bash .agents/skills/safe-commit/scripts/safe_commit_check.sh precheck  # Phase 3 (read-only)
bash .agents/skills/safe-commit/scripts/safe_commit_check.sh summary   # Phase 6 grouping aid
```
```powershell
powershell -File .agents/skills/safe-commit/scripts/safe_commit_check.ps1 <safety|format|precheck|summary>
```

The script only gathers evidence and runs checks — **every approval gate below still belongs
to the user**. The `format`/`precheck` subcommands only run when the change actually touches `src/`.

## Steps (do in order)

### Phase 1: Data Safety Check
1. Run the `safety` subcommand above (or manually: `git status` + `git ls-files`). It sweeps for:
   - **tracked** sensitive files (API keys, `.env`, `.db`, `service_account*.json`, `credentials/` …) already in git,
   - **untracked-but-not-ignored** sensitive files (one `git add -A` away from leaking),
   - `.gitignore` coverage gaps for common sensitive patterns.
2. If anything is flagged, STOP and alert the user. Ask if they want you to untrack the files
   (`git rm --cached` — keeps them on disk) and add patterns to `.gitignore`. Never do this unasked.
3. Once resolved (or the user skips / nothing was flagged), proceed to the next phase.

### Phase 2: Auto-Formatting
4. Run the `format` subcommand (or manually: `npx prettier --write "src/**/*.{js,jsx,ts,tsx,css,md}"`
   from the repo root) — only if `src/` was touched by the change. (This project is npm-based —
   there is no bun, and no `format` script in `package.json`.)
5. Inform the user that the code has been formatted.

### Phase 3: Pre-check (Lint)
6. Run the `precheck` subcommand (or manually: `npm run lint` from the repo root) — only if `src/`
   was touched. This project has
   no test runner configured (`package.json` has no `test` script) — lint is the only automated
   pre-check available.
7. If lint fails, STOP and report the errors. Wait for the user's explicit command to either "Fix them" or "Bypass".
8. Apply fixes (if requested) and re-check before proceeding.

### Phase 4: Update Docs (Human Approval)
9. Check whether the change makes any architecture doc stale. Only these three matter:
   - [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) — if a layer/subsystem changed.
   - [project_mapping.md](../../architecture/project_mapping.md) — if files/folders were added, moved, or split.
   - [AGENTS.md](../../../AGENTS.md) — only if a project-wide rule actually changed.
10. Propose the documentation changes to the user.
11. The user can **Approve** the doc changes, or choose to **Skip Phase 4** if no docs need updating.

### Phase 5: Auto `/save-memory` (Human Approval)
12. Follow the instructions in [`../save-memory/SKILL.md`](../save-memory/SKILL.md) to persist context.
13. Propose a new entry for `.agents/memory/MEMORY.md` and any necessary ADRs (in `.agents/memory/decisions/`).
14. Wait for the user to **Approve** and save them to disk. (This phase must be completed before committing).

### Phase 6: Code Review & Atomic Commits (Human Approval)
15. **Deep Code Review**: Run `git status` and `git diff` to extract all uncommitted changes. For the
    mechanical checks, run the code-review sweep on the working tree:
    `bash .agents/skills/code-review/scripts/run_review.sh --working`. Review the rest strictly
    against master rules in [`AGENTS.md`](../../../AGENTS.md) (e.g., responsibility-based
    modularity with soft thresholds, layered architecture, no hardcoded colors/secrets).
16. **Logical Grouping**: Run the `summary` subcommand for a per-area file count, then group the
    modified files logically by feature, component, or layer (e.g., UI updates, Database changes, Bug fixes).
17. **Commit Proposal**: Generate a specific **Conventional Commit message** for each group. Present the groups and messages bilingually.
18. **Execution**: Upon final user approval, sequentially run `git add <specific_files>` and `git commit -m "<message>"` for each group automatically (selective staging — never `git add -A`; see [git_workflow.md](../../architecture/git_workflow.md)).

### Phase 7: Post-Commit Sync
19. Once all commits are successful, ask the user if they want to push the changes to the remote repository.
20. Upon approval, run `git push`.

> **Note to Agent:** 
> 1. Always format your outputs and interactive prompts bilingually (English + Myanmar), keeping tech terms in English.
> 2. Do not proceed to the next phase without explicit human approval for the current phase, using your agent's structured question tool (**`AskUserQuestion`** in Claude Code; `ask_question` in Antigravity).
> 3. **CRITICAL:** When presenting approval options in the question tool, you MUST explicitly mention the Phase and the exact action/slash-command it will execute. 
>    - *Example for Phase 1 Alert:* `Auto untrack & .gitignore sensitive files, then proceed to Phase 2`
>    - *Example for Phase 4 Skip:* `Skip Phase 4 and run Phase 5 (/save-memory)`
>    - *Example for Phase 4 Approve:* `Approve /update-docs and run Phase 5 (/save-memory)`
>    - *Example for Phase 5 Approve:* `Approve /save-memory and run Phase 6 (Commit)`
>    - *Example for Phase 7 Approve:* `Run git push to sync changes online`
