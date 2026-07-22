# API Security Scan Findings

The following security issues were identified and recorded for future remediation via `/code-fix`.

- [x] [FIXED 2026-07-11] **[High Priority]** `src/actions/admin/action-categories.ts:L16-L20` — Missing function-level auth (Admin check). The `createCategory`, `updateCategory`, and `deleteCategory` functions only check if a user is logged in, but not if they have an admin role. Any authenticated user can modify categories. Fixed by adding `requireAdmin()` (checks server-authoritative `public.users.role`) at the top of all three actions.
- [x] [FIXED 2026-07-11] **[High Priority]** `src/actions/admin/action-products.ts:L19-L23` — Missing function-level auth (Admin check). Similar to categories, any authenticated user can create, update, or delete products. Fixed by adding `requireAdmin()` at the top of all three actions.
- [x] [FIXED 2026-07-11] **[High Priority]** `src/actions/admin/action-orders.ts:L11-L16` — Missing function-level auth (Admin check). Any authenticated user could potentially update order statuses. Fixed by replacing the auth-only check with `requireAdmin()`.
- [x] [FIXED 2026-07-11] **[Normal Priority]** `src/actions/auth/action-login.ts:L26-L29` — No rate limiting. The `loginWithEmail` Server Action passes credentials directly to Supabase without application-level rate limiting, risking brute-force attacks. Fixed by adding an in-memory sliding-window rate limit (5 attempts/60s per IP+email) via `src/lib/rate-limit.ts`.
- [x] [FIXED 2026-07-11] **[Normal Priority]** `src/actions/shop/action-review.ts:L25-L30` — Missing pagination/throttling. The `submitReview` action lacks rate limiting, allowing a malicious user to spam fake reviews. Fixed by adding an in-memory rate limit (3 reviews/60s per user) via `src/lib/rate-limit.ts`.

## Security Audit Findings — 2026-07-12 (`/security-auditor`)

Full-codebase security audit (Next.js + Supabase). **Headline:** the `requireAdmin()` Server-Action hardening (fixed above) is bypassable because Supabase RLS is wide open — a signed-up user can skip the Server Actions and hit the anon REST API directly from the browser. Findings #1–#3 share one root cause: RLS treats `authenticated` as `admin`. Fix them together via a migration.

- [x] [FIXED 2026-07-12] **[CRITICAL]** `supabase/migrations/20260709153304_create_products_table.sql:L23-L33` & `supabase/migrations/20260710180400_create_categories_table.sql:L18-L31` — RLS grants `insert`/`update`/`delete` on products & categories to **any** `authenticated` role. Bypasses `requireAdmin()` entirely (client can call `supabase.from('products').delete()` directly). Restrict these writes to `role = 'admin'` (or service-role only). **Fix:** new migration `20260712120000_harden_rls_and_schema.sql` adds a `public.is_admin()` SECURITY DEFINER helper, drops the `authenticated` write policies on both tables, and recreates them gated on `public.is_admin()`.
- [x] [FIXED 2026-07-12] **[CRITICAL]** `supabase/migrations/20260709172900_create_users_table.sql:L17` — Privilege escalation. `"Users can update own profile"` is `for update using (auth.uid() = id)` with no column restriction / no `WITH CHECK`, so a user can `update({ role: 'admin' })` on their own row and become a real admin. (Known gap, ADR-0002.) Lock the `role` column: restrict updatable columns or move `role` writes to a service-role path. **Fix:** `20260712120000` adds a `BEFORE UPDATE` trigger (`lock_user_role` → `prevent_role_change()`) that coerces `role` back to its old value for any non-admin / non-service-role caller, so profile updates still work but the column can't be self-escalated.
- [x] [FIXED 2026-07-12] **[CRITICAL]** `supabase/migrations/20260709161500_create_orders_table.sql:L27-L31` — Orders policies named "Admin can…" are actually `to authenticated using (true)`. (a) Any logged-in user can `select *` all orders + order_items → every customer's name/phone/address (PII breach). (b) Any user can `update` any order's `status`/`payment_status` (e.g. mark unpaid orders "paid"). Scope reads to `auth.uid() = user_id` and restrict status writes to `role = 'admin'`. **Fix:** `20260712120000` drops the `using(true)` orders/order_items policies; adds admin-only view (`is_admin()`) alongside the existing owner-view policy, an owner-or-admin update policy, an owner/admin `order_items` select policy, and a `guard_order_updates` trigger that blocks non-admins from changing `status`/`total_amount`/PII/`user_id` (they may only touch payment fields).
- [x] [FIXED 2026-07-12] **[HIGH]** `src/actions/checkout/action-checkout.ts:L18-L42` — `createOrder` inserts client-supplied `item.price` and `totalAmount` verbatim, with no server-side re-fetch of `products.price` or recompute. Price-tampering: a crafted request can order at 0 MMK. Also no stock validation/decrement. Re-fetch prices server-side and recompute the total. **Fix:** `createOrder` now re-fetches `price`/`stock` from `products`, rejects unknown/out-of-stock items, computes the total server-side (logs a tamper warning on mismatch), persists server prices on `order_items`, and decrements stock via the service-role admin client.
- [x] [FIXED 2026-07-12] **[MEDIUM]** `src/actions/admin/action-products.ts:L37,L67,L84` & `src/actions/admin/action-categories.ts` — `throw new Error(error.message)` leaks raw Postgres/Supabase error text (constraint/schema hints) to the client. `updateOrderStatus`, `submitReview`, and `createOrder` also `return err.message` from catch blocks. Log server-side; return a generic client message. **Fix:** all six `throw new Error(error.message)` sites in products/categories now throw a generic message; the catch blocks in `updateOrderStatus`, `submitReview`, and `createOrder` `console.error` server-side and return a generic string.
- [x] [FIXED 2026-07-12] **[LOW]** `src/actions/upload/action-upload.ts:L77-L91` — `uploadPaymentProof` inserts into `payment_proofs` with an attacker-controlled `orderId` and no ownership check (relies on RLS with no migration found for this table — IDOR risk). Also the follow-up update filters `.eq("buyer_id", user.id)` but the orders column is `user_id` (likely a no-op). Verify the table exists, is ownership-scoped, and fix the column name. **Fix:** `20260712120000` creates the `payment_proofs` table with ownership-scoped RLS (insert only for your own order, read own-or-admin) plus the missing `orders.payment_status` column; the action now verifies order ownership before inserting and filters the update on the correct `user_id` column.


## 2026-07-12 — Code Review (Pre-Commit Check)

### 🔴 High Priority
- None.

### 🟡 Normal Priority
- None. All recent changes (Rate Limiting, Accessibility `sr-only`, Mobile Touch Targets) adhere perfectly to architecture and security standards. ESLint passed with zero errors.


## 2026-07-22 — Code Review (`/code-review`)

### 🔴 High Priority
- [x] [FIXED 2026-07-22] **[Performance & Security]** `src/app/[locale]/(shop)/shops/[seller_id]/page.tsx:L23-L38` — Unpaginated DB query fetches ALL users (`role = seller`) into server memory, then uses JavaScript `.find()` to locate the target shop. Fixed by replacing full scan with targeted UUID single query or first-word candidate search.

### 🟡 Normal Priority
- [x] [FIXED 2026-07-22] **[Performance / Image Optimization]** `src/app/[locale]/admin/(portal)/categories/page.tsx:L71`, `src/components/account/SellerApplicationForm.tsx:L175`, `src/components/admin/CategoryForm.tsx:L245`, `src/components/admin/ProductTableClient.tsx:L152`, `src/components/currency/CurrencySwitcher.tsx:L67,L144` — ESLint warning: Using `<img>` instead of Next.js `<Image />` component. Fixed by migrating all 5 files to Next.js `<Image />` component.

