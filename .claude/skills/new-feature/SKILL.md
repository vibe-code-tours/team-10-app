---
name: new-feature
description: Proposal-first workflow for adding a feature or non-trivial change. Enforces the Proposal First rule (propose before coding) and the plan -> build -> verify -> save loop.
---

# /new-feature — Proposal-first feature flow

> Enforces **the Proposal-First rule** (AGENTS.md §4 Rule 1): never generate code immediately.

## 1. Plan (no code yet)
- Ensure [`/start`](../start/SKILL.md) context is loaded (rules, architecture, memory).
- Analyze the affected code and produce a **bulleted proposal**:
  - **Must-Have Changes** — exact changes required to make the feature work (Server Components, Server Actions, DB schema).
  - **Data/Schema Impact** — any Supabase table, RLS policy, or migration the feature needs.
  - **Recommended Changes** — optional refactors for quality / UX / performance.
- For an Implementation Plan, use the **paragraph-level bilingual format** (full English
  paragraph, then the full Myanmar translation in italics) per AGENTS.md §6.
- **Wait for explicit approval** ("Approve all" / "Approve must-haves only") before coding.

## 2. Build (after approval)
- Respect constraints (see [architecture-guardrails](../architecture-guardrails/SKILL.md)):
  **responsibility-based modularity** (soft thresholds — never auto-split); Server Components by
  default with `'use client'` only where interactivity is needed; UI/logic separation; the
  `var(--color-*)` tokens in `globals.css` over hardcoded styles (there is no Tailwind here).
- Do data mutations through **Server Actions** in `src/actions/`
  (see [`environment_and_workflow.md`](../../architecture/environment_and_workflow.md)).
- Validate all input with **Zod** schemas; rely on **Supabase RLS** for DB access control; keep the
  Supabase service role key server-side only; never hardcode secrets or URLs (use `.env`, and the
  clients in `src/lib/supabase/`).
- Code-format rule: small files → full file; large files → `[FIND]` / `[REPLACE WITH]` snippets.

## 3. Verify
- **This project has no test runner configured** (`package.json` has no `test` script). Verify by
  exercising the feature, not by asserting tests pass.
- Run `npm run lint` and `npx tsc --noEmit`, then drive the actual flow in the browser
  (`npm run dev`) — cover null / empty / unauthenticated / non-owner (RLS) cases.
- Format: `npx prettier --write "src/**/*.{ts,tsx,css,md}"` from the repo root.
- Regression check: if the change touches cart, checkout, auth, or admin CRUD, walk those
  flows once before declaring done.

## 4. Save
- Run [`/save-memory`](../save-memory/SKILL.md): MEMORY.md entry, ADR if a real decision was
  made, update `.agents/architecture/project_mapping.md` if structure changed.

---

*Myanmar — အနှစ်ချုပ်:*
*Feature အသစ်တိုင်း — (၁) code မရေးခင် Must-Have / Porting Strategy / Recommended proposal တင်ပြီး approval*
*စောင့်၊ (၂) approve ရမှ constraint တွေ (responsibility-based modularity, Server Components/Actions, Zod validation, globals.css token) လိုက်နာ*
*ပြီး ရေး၊ (၃) `npm run lint` + `tsc --noEmit` နဲ့ browser မှာ flow ကို လက်တွေ့စမ်းပြီး verify လုပ်၊ format လုပ်၊ (၄) `/save-memory` နဲ့ ချရေး။*
