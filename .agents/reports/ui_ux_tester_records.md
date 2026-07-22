## 2026-07-21 — UI/UX Tester Run

> **Scope:** Theme consistency, dark mode compatibility, design system compliance, component reuse, interactive states, responsive layout, and accessibility audit.

### 🔴 High Priority

- [x] [FIXED 2026-07-21] **[Dark Mode Compatibility]** `src/components/layout/Footer.tsx:54` — Hardcoded `background: "#f5f5f5"` on the main footer element. In dark mode (`data-theme="dark"`), this renders a blindingly bright white footer at the bottom of a dark background, and light text on white background creates severe contrast/readability failure.
  - Evidence: `<footer style={{ background: "#f5f5f5", color: "var(--color-text)" }}>` hardcodes light background while reading dark mode text token.
  - Impact: Dark mode users experience visual blinding and unreadable text in the footer.

- [x] [FIXED 2026-07-21] **[Theme Token Violation]** `src/app/[locale]/(shop)/page.tsx:197` — Hardcoded gradient `linear-gradient(90deg, #2563eb 0%, #3b82f6 100%)` in Flash Sale header instead of using CSS custom properties (`var(--color-primary)`, `var(--color-primary-light)`).
  - Evidence: Inline hex color `#2563eb` and `#3b82f6` bypass theme token variables defined in `globals.css`.
  - Impact: Theme customization or dark mode adjustments cannot propagate to the Flash Sale banner.

### 🟡 Normal Priority

- [x] [FIXED 2026-07-21] **[Component Duplication]** `src/app/[locale]/(shop)/products/[id]/page.tsx:265` & `src/components/shop/ReviewForm.tsx:209` — Duplicated star rating SVG rendering logic across Product Detail and Review Form components instead of a unified `<StarRating />` component.
  - Suggestion: Extract a shared `<StarRating rating={number} max={5} size={number} />` component under `src/components/ui/StarRating.tsx`.

- [x] [FIXED 2026-07-21] **[Interactive Focus State]** `src/components/shop/ProductSidebar.tsx` — Filter checkboxes and category filter links do not show a clear `:focus-visible` indicator when navigated via keyboard (`Tab` key).
  - Suggestion: Ensure all sidebar filter links and custom input controls inherit the global `:focus-visible` outline.

- [x] [FIXED 2026-07-21] **[Typography Line-Clamp]** `src/components/home/DailyDiscover.tsx:246` — Product titles clamped at 2 lines (`WebkitLineClamp: 2`) have `height: 32px` with `lineHeight: 16px`. Long titles in Burmese (`:lang(my)`) can be slightly clipped on descending characters.
  - Suggestion: Set `lineHeight: 1.35` and `minHeight: 34px` to allow comfortable line spacing for Myanmar Unicode typography.
