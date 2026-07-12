# 3. RLS-enforced, server-authoritative authorization

- Status: accepted
- Date: 2026-07-12

## Context

`/security-auditor` found that the `requireAdmin()` Server-Action layer added in
[ADR-0002](0002-admin-authorization-source-and-rate-limiting.md) was bypassable. Supabase
Row Level Security is the real trust boundary — a signed-up user holds a valid
`authenticated` JWT and can call the anon REST API directly from the browser
(`supabase.from(...).insert/update/delete/select`), skipping the Server Actions entirely.
The existing policies made that fatal:

- **products / categories** granted `insert`/`update`/`delete` to any `authenticated` role.
- **users** — `"Users can update own profile"` had no column restriction, so a user could
  `update({ role: 'admin' })` on their own row (the exact privilege-escalation gap ADR-0002
  flagged as a follow-up).
- **orders / order_items** — policies named "Admin can…" were actually `using (true)`,
  exposing every customer's name/phone/address (PII) to any logged-in user and letting
  anyone flip `status` / `payment_status`.

Two schema objects referenced by code never existed: `orders.payment_status` and the
`payment_proofs` table (so the payment-proof flow was a silent no-op and an IDOR risk).

## Decision

In the context of **making authorization actually enforced at the database boundary**,
facing **a client-reachable anon REST API and RLS that treated `authenticated` as
`admin`**, we chose **to move the admin check into the database via a
`public.is_admin()` SECURITY DEFINER helper (reads the server-authoritative
`public.users.role`) referenced by every privileged policy, and to enforce column-level
rules that RLS policies can't express (WITH CHECK cannot see OLD) via `BEFORE UPDATE`
triggers** to achieve **defence-in-depth: the Server Actions and the raw REST API are now
gated by the same rule**, accepting **that trusted server-side bookkeeping which must
bypass RLS (e.g. checkout stock decrement, now blocked by the admin-only `products` write
policy) has to go through the `createAdminClient()` service-role client explicitly**.

Concretely (migration `supabase/migrations/20260712120000_harden_rls_and_schema.sql`):

- `public.is_admin()` — `stable security definer`, `execute` granted to `authenticated`.
- products / categories writes → `with check (public.is_admin())`.
- `lock_user_role` trigger (`prevent_role_change()`) — coerces `role` back to its old value
  for any non-admin / non-service-role update, so profile edits still succeed but `role`
  can't be self-escalated.
- orders reads = owner-or-admin; updates = owner-or-admin, but `guard_order_updates`
  (`enforce_order_update_rules()`) blocks non-admins from changing
  `status`/`total_amount`/PII/`user_id` (they may only touch the payment fields).
- `order_items` reads scoped to the caller's own order (or admin).
- Added `orders.payment_status`; created `payment_proofs` with ownership-scoped RLS
  (insert only for your own order; read own-or-admin).

Companion Server-Action changes: `createOrder` re-fetches `price`/`stock` server-side,
recomputes the total (client total is only used to log a tamper warning), and decrements
stock via `createAdminClient()`; `uploadPaymentProof` verifies order ownership before
insert and filters on the correct `user_id` column.

## Consequences

- Authorization is now enforced at the DB, not just in Server Actions — the two can't drift.
- **Any future server-side operation that legitimately needs to bypass RLS must use
  `createAdminClient()` and be a genuinely trusted, server-validated step** (never expose
  it to client-controlled writes). The checkout stock decrement is the first such case.
- Column-locking lives in triggers, not policies — future column-level rules should follow
  the same trigger pattern rather than trying to express them in `WITH CHECK`.
- The migration is **not yet applied to a live DB**; it must be `supabase db push`-ed and
  smoke-tested (verification so far was static: `tsc --noEmit` + `eslint` clean).
- The in-memory rate-limit caveat from ADR-0002 still stands, unrelated to this change.
