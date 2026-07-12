---
name: security-auditor
description: Audit the codebase for secrets, vulnerabilities, and domain policy violations.
---

# /security-auditor — Security & Policy Compliance Workflow

When invoked, act as a strict Security Officer and review the codebase or recent changes:

1. **Secret Scanning**: Ensure no hardcoded secrets or API keys exist in the codebase. Verify that Supabase keys are read from `.env`, and that the **service role key never reaches the client** (never in a `NEXT_PUBLIC_` variable) — see `src/lib/supabase/`.
2. **Endpoint Security**: Check Next.js API routes (`src/app/api/`) or Server Actions to ensure sensitive endpoints are protected with Supabase Auth policies.
3. **Row Level Security (RLS)**: Ensure every Supabase table touched by the change has RLS enabled, with policies that stop one user reading or mutating another user's data (orders, carts, profiles, reviews).
4. **Error Handling**: Verify that Server Actions and Route Handlers return standardized errors — stack traces and raw Supabase/Postgres errors must NOT reach the client.
5. **Report**: Provide a bilingual (English + Burmese) security audit report detailing any vulnerabilities found.
