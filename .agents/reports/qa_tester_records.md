## 2026-07-12 — QA Tester Run

### 🔴 High Priority
- [x] [FIXED 2026-07-12] **[Testing Infrastructure]** `package.json` — No testing frameworks (Jest, Vitest) are configured. The `"test"` script is missing. The project currently has **0% test coverage**.
  - Evidence: `npm test` fails because the script is undefined.
- [x] [FIXED 2026-07-12] **[Error Handling UX]** `src/app/[locale]/(shop)/(account)/settings/page.tsx` — The Settings page uses Server Actions (`updateProfile`, `updatePaymentMethod`) passed directly to `<form>`. These actions return `{ error: string }` on failure, but since there is no client-side state wrapper (`useActionState` / `useFormState`), the errors are silently swallowed and not displayed to the user.
  - Evidence: Submitting an invalid profile form does not yield an error message in the UI.

### 🟡 Normal Priority
- [x] [FIXED 2026-07-12] **[API Contract]** `src/actions/` — Server Actions do not have corresponding unit tests or end-to-end API validation tests.
  - Suggestion: Introduce Vitest or Jest, and write API unit tests for `action-checkout.ts` and `action-profile.ts` to ensure database updates match expected Pydantic/Zod schemas.
- [x] [FIXED 2026-07-12] **[Edge Case]** `src/actions/checkout/action-checkout.ts` — The cart items validation loops over `items`, but if the client intentionally bypasses the UI and sends an extremely large array of items (Massive Data attack), the `for` loop and subsequent DB queries could cause a performance bottleneck or timeout.
  - Suggestion: Add a Zod constraint or manual check to limit the number of unique cart items per checkout (e.g., max 50 items).

### 🐛 E2E Browser Findings (UI/UX)
- [x] [FIXED 2026-07-12] **[UI Layout]** `cart/page.tsx` — The cart item image uses Next.js `<Image fill />` but the parent container lacks `position: relative`. This causes the item thumbnail to stretch and cover the entire left side of the cart page, completely obscuring the product name and quantity controls.
  - Evidence: E2E screenshot `cart_page.png` shows a massive background image hiding the cart items.
- [x] [FIXED 2026-07-12] **[UI Layout]** `page.tsx` (Shop Home) & `products/[id]/page.tsx` — Several Next.js `<Image fill />` elements are missing `position: relative` on their parent containers, throwing console warnings and causing potential layout stretching.
- [x] [FIXED 2026-07-12] **[Console Error]** `React Hydration` — "Can't perform a React state update on a component that hasn't mounted yet" error on the homepage load.
- [x] [FIXED 2026-07-12] **[Accessibility]** `products/[id]/page.tsx` — Console warning indicates that an `Image` element is missing the required `alt` property (or it is empty).

## 2026-07-21 — QA Tester Run

**Scope:** Jest suite, ESLint, TypeScript check, coverage run, Supabase checkout/upload contract audit, cart edge-case audit, and approved HTTP smoke checks.

**Suite status:** `npm test -- --runInBand` = 5 suites / 15 tests passed. `npm run lint` passed. `npx tsc --noEmit` was blocked by a truncated local `node_modules/csstype/index.d.ts`. HTTP smoke checks passed for `/en`, `/en/products`, `/en/cart`, and `/en/login`; `/en/checkout` correctly redirected unauthenticated traffic to login, and `/en/admin` intentionally returned 404 through the admin privacy rewrite.

### 🔴 High Priority

- [ ] **[Database security contract]** `supabase/migrations/20260712123000_checkout_transaction.sql:13` — `create_order` is a `SECURITY DEFINER` RPC, but no migration revokes its default `PUBLIC` execute privilege or grants it only to `service_role`. A caller can bypass `createOrder()` and invoke `/rest/v1/rpc/create_order` directly with attacker-selected totals, item prices, quantities, and user IDs; the function trusts those values while inserting the order and decrementing stock.
  - Evidence: repository-wide migration search found no `REVOKE`, `GRANT`, or `ALTER FUNCTION` for `create_order`. The Server Action's server-side price verification therefore does not protect the directly exposed RPC boundary.
- [ ] **[Storage deployment contract]** `src/actions/upload/action-upload.ts:10` — Upload flows depend on `payment-proofs`, `avatars`, and `product-images`, but `supabase/migrations/` contains no bucket creation or `storage.objects` RLS policies. Fresh environments cannot reproduce the required storage contract, and repository review cannot verify that regular users are blocked from privileged product-image writes.
  - Evidence: repository-wide migration search returned no references to `storage.objects`, `payment-proofs`, `avatars`, or `product-images`; `src/components/admin/ProductForm.tsx` uploads directly from the browser.

### 🟡 Normal Priority

- [ ] **[Checkout coverage]** `__tests__/action-checkout.test.ts:18` — Checkout tests cover only invalid customer data and the 50-item limit. Core paths remain untested: valid checkout/RPC success, guest checkout, duplicate-ID aggregation, price mismatch, missing products, insufficient stock, lookup failure, and RPC rollback/failure.
  - Evidence: coverage reports `src/actions/checkout/action-checkout.ts` at 45.45% statements and 38.46% branches, with price/stock verification and transaction processing mostly uncovered.
- [ ] **[Coverage configuration]** `jest.config.ts:10` — Coverage has no `collectCoverageFrom`, so the reported 70.86% includes only modules imported by the five tests and omits most actions, components, services, and admin/upload flows. This percentage is not project coverage.
  - Suggestion: include `src/**/*.{ts,tsx}` with generated/type files excluded, then set realistic staged thresholds.
- [ ] **[Upload consistency]** `src/actions/upload/action-upload.ts:55` — `uploadPaymentProof()` uploads a public object before checking order ownership and before inserting `payment_proofs`. Invalid order IDs or insert failures leave orphaned files. The final order update error is also ignored, so the action can return success while `payment_status` remains unchanged.
  - Suggestion: verify ownership before upload, remove the object on later failure, and require the order update to succeed before returning success.
- [ ] **[Cart storage edge case]** `src/components/cart/CartProvider.tsx:37` — `localStorage.getItem()` and `localStorage.setItem()` are not fully guarded. Browser privacy restrictions, disabled storage, or quota exhaustion can throw and break cart initialization/persistence; only `JSON.parse()` is currently inside `try-catch`.
  - Suggestion: guard both storage reads and writes and keep the in-memory cart usable when persistence is unavailable.
- [ ] **[Verification environment]** `node_modules/csstype/index.d.ts:1143` — Local dependency content is truncated at `* This fea`, causing `npx tsc --noEmit` to fail with `TS1010: '*/' expected`. Type safety could not be fully verified in this run.
  - Suggestion: restore dependencies from `package-lock.json` with a clean install, then rerun `npx tsc --noEmit` and `npm run build`.
