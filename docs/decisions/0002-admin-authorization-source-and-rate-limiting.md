# 2. Admin authorization source and in-memory rate limiting

- Status: accepted
- Date: 2026-07-11

## Context

`/code-review` flagged 3 admin Server Actions (`action-categories.ts`, `action-products.ts`,
`action-orders.ts`) that only checked "is logged in", not "is admin" — any authenticated
user could mutate categories, products, and order statuses. It also flagged 2 unthrottled
Server Actions (`loginWithEmail`, `submitReview`) exposed to brute-force / spam abuse.
The existing admin layout (`src/app/[locale]/admin/(portal)/layout.tsx`) already gated on
`user.user_metadata?.role === "admin"`, but `user_metadata` is writable by the
authenticated user themselves via the Supabase client SDK (`auth.updateUser`), so reusing
that check for authorization would itself be exploitable.

## Decision

In the context of **securing admin-only Server Actions and abuse-prone public actions**,
facing **a client-editable `user_metadata.role` and no rate-limiting infra (no
Redis/Upstash)**, we chose **a shared `requireAdmin()` helper
(`src/lib/supabase/auth-helpers.ts`) that reads the server-authoritative
`public.users.role` column, plus a minimal in-memory sliding-window limiter
(`src/lib/rate-limit.ts`)** to achieve **closing the auth gap without new
infrastructure**, accepting **the in-memory limiter resets on restart and isn't shared
across server instances — fine for this single-instance deployment, but must be swapped
for a shared store (e.g. Upstash) before horizontal scaling**.

## Consequences

All future admin Server Actions must call `requireAdmin()` rather than re-checking
`user_metadata.role`. Note: `public.users`' RLS policy `"Users can update own profile"`
currently allows a user to update their own `role` column via the client SDK
(`auth.uid() = id`, no column restriction) — a related privilege-escalation gap noted
during this fix but left unresolved (out of the approved fix scope); it should be closed
in a follow-up (restrict the policy's columns or move `role` writes to a service-role-only
path).
