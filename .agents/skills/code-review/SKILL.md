---
name: code-review
description: Review code comprehensively against the project's architecture, specs, and rules. Checks static analysis, security, performance, domain compliance, formatting, and dependency management. Read-only (records findings to a file for later fixing).
---

# /code-review — Static Analysis & Architecture Review (Read-Only)

> **Role:** Act as a strict Senior Code Reviewer for the YoeYarZay E-commerce App
> (Next.js + Supabase). Your job is to **discover and record** code quality issues —
> **NEVER fix code directly.** All findings go to the report file for `/code-fix` to consume.
>
> **Parent Rules:** [AGENTS.md](../../../AGENTS.md)
> **Architecture:** [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) | [project_mapping.md](../../architecture/project_mapping.md)
> **Guardrails:** [architecture-guardrails/SKILL.md](../architecture-guardrails/SKILL.md)

---

## [STRICT CONSTRAINT: READ-ONLY]

⛔ **DO NOT** modify any source code or configuration files.
✅ **DO** analyze code, run non-modifying checks, and **record all findings** to the report file.

---

## Review Axes

When invoked, perform a comprehensive review of the recent changes or the currently active file using this checklist. Review scope: files specified by the user, or recent `git diff` if not specified.

> **Fastest path — run the bundled sweep script first** to gather all mechanical evidence
> (diff scope, lint/prettier checks, domain scan, hardcoded-URL/secret scan, file-size
> guard, dependency diff). It is read-only and never aborts on a failing check:
>
> ```bash
> bash .agents/skills/code-review/scripts/run_review.sh              # vs origin/main
> bash .agents/skills/code-review/scripts/run_review.sh main         # vs a given base ref
> bash .agents/skills/code-review/scripts/run_review.sh --working    # uncommitted changes only
> ```
> ```powershell
> powershell -File .agents/skills/code-review/scripts/run_review.ps1    # Windows (primary shell)
> ```
>
> Then read the output section-by-section and apply the judgement-based axes below.

### Axis 1: Spec & Requirements (Does it work?)

1. **Feature Completeness:** Does the code fulfill the requirements?
2. **Edge Cases:** Are nulls, zero division, or large lists handled safely?

### Axis 2: Project Standards (Is it written correctly?)

Check against the protocols in [architecture-guardrails/SKILL.md](../architecture-guardrails/SKILL.md):

3. **Architecture check:** Does it violate the responsibility-based modularity rule (soft thresholds: 300/500 lines, single-responsibility per file)? Are Server Components used by default, with `'use client'` only where interactivity is needed? Are data mutations done via Server Actions (`src/actions/`) rather than client-side fetches?
4. **Performance check:** Is Next.js caching / static generation leveraged where possible? Are `useMemo`/`useCallback` used for expensive client-side computations?
5. **Domain compliance:** Are prices/totals recomputed server-side from the DB inside the Server Action (never trusted from client form data)? Is stock/quantity validated before an order is written?
6. **Security:** Is all input validated with Zod schemas? Is Supabase RLS (Row Level Security) relied on for DB access control? Is the Supabase **service role key** kept server-side only (never sent to the client, never in a `NEXT_PUBLIC_` var)?
7. **Error Handling:** Do Server Actions return standardized error objects instead of leaking raw exceptions? Are `error.tsx`/`not-found.tsx` boundaries used for routing errors? No silent `catch {}`.
8. **State Management:** React hooks (`useState`/`useReducer`) for local state; Context only for global UI state when prop-drilling is too deep. No new state library (Redux/Zustand/MobX) without explicit permission.
9. **API contract:** Are Supabase client calls confined to `src/lib/supabase/` (no ad-hoc `fetch` calls to hardcoded Supabase/API URLs scattered through components)?

### Axis 3: Code Formatting & Dependencies (Is it clean?)

10. **Formatting compliance (non-modifying check):**
    - Run `npm run lint` from the repo root — record any lint violations
    - Run `npx prettier --check "src/**/*.{ts,tsx,css,md}"` from the repo root — record unformatted files
    - **DO NOT run formatting commands that modify files** (`prettier --write`)

11. **Dependency guard:**
    - Check `package.json` for recently added packages (the script prints the diff)
    - Flag any new npm package that was NOT explicitly approved by the user (see [AGENTS.md](../../../AGENTS.md) Protocol 7 — never introduce new npm packages without permission)
    - Verify the package is necessary (can the same be done with an existing dep):
      current runtime deps are `@supabase/ssr`, `@supabase/supabase-js`, `next`, `react`, `react-dom`, `next-intl`, `next-themes`, `zod`, `date-fns`, `lucide-react`, `resend`, `@react-email/components`, `embla-carousel-react`/`-autoplay`
    - **DB layer note:** this project uses **Supabase (PostgreSQL)** as its only backend. There is
      **no separate API server** — a PR that adds an ORM (Prisma, Drizzle, etc.) or a custom backend framework is a new architectural direction and must be flagged.

---

## Step 1: Analyze & Categorize

Categorize all found issues into:

### 🔴 High Priority (ဦးစားပေး — အမြန်ပြင်သင့်တဲ့ကုဒ်)
- App crashes, major rule violations (e.g., multi-responsibility files >500 lines, wrong state management)
- Security issues (missing auth, exposed secrets, unvalidated input)
- Layer violations (SQL in routes, business logic in UI components)
- Unapproved dependency additions

### 🟡 Normal Priority (ပုံမှန် — မပြင်သေးလဲဖြစ်တဲ့ကုဒ်)
- Missing tests, minor performance improvements
- Formatting violations
- Small refactoring opportunities
- Documentation gaps

---

## Step 2: Record Findings

Write the categorized findings directly into [`../../reports/code_review_records.md`](../../reports/code_review_records.md) — **create the file if it does not exist yet** (append new dated sections on later runs).

```markdown
## YYYY-MM-DD — Code Review

### 🔴 High Priority
- [ ] **[AREA]** `file/path.ext:L##` — Description of the issue
  - Evidence: code snippet or command output

### 🟡 Normal Priority
- [ ] **[AREA]** `file/path.ext` — Description of the issue
  - Suggestion: recommended fix approach
```

---

## Step 3: Report Summary

Provide a **bilingual summary** (English + Burmese):
- Total findings count (High / Normal)
- Worst offending files/areas
- Formatting compliance status
- Dependency audit result
- Instruct the user to run `/code-fix` when ready to remediate

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က project ရဲ့ code quality ကို static analysis နည်းနဲ့ စစ်ဆေးပေးပါတယ်။ Architecture, security, performance, domain compliance, error handling, formatting, dependency management — အကုန်စစ်ပြီး findings ကို `.agents/reports/code_review_records.md` ထဲ High/Normal Priority ခွဲပြီး record ထားပေးပါတယ်။ Code ကို ကိုယ်တိုင် **မပြင်ပါ** — ပြင်ဖို့ `/code-fix` ကို ခေါ်ပါ။*
