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
