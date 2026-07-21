# Running Context Memory (Project: Yoe Yar Zay Online Shop)

> **Goal:** High-performance E-commerce platform built with Next.js (App Router) and Supabase.

## Current Focus
Multi-Vendor Marketplace + Admin Category Management (with Image Uploads & Custom Slugs) completed. Build clean (`npx tsc --noEmit` 0 errors). Code prepared for atomic commit on branch `fix/ui-currency-fixes`.

*Myanmar — အနှစ်ချုပ်:*
Multi-Vendor Marketplace နှင့် Admin Category Management (Category Image Upload & Custom Slug URL များအပါအဝင်) ပြီးစီးပြီ။ TypeScript compilation clean ဖြစ်သည်။

## Log

- **2026-07-22**: Implemented Category Image Management (Add/Remove), Custom Slug Routing, and Real-Time Homepage Sync.
  - **Changed**:
    - **Category Image Upload & Storage**: Created Supabase Storage bucket `category-images` and `src/lib/category-image-store.ts` helper (`category_map.json`). Built Drag & Drop file uploader, live preview, `🗑️ Remove Image` button, and URL input in `CategoryForm.tsx`.
    - **Custom Slug Routing**: Updated `/admin/categories` edit links to custom URL slugs (e.g. `/admin/categories/beauty/edit`, `/admin/categories/traditional/edit`). Created `/admin/categories/[slug]/edit` supporting dual slug and ID lookup.
    - **1:1 Image Parity**: Created `resolveCategoryImage()` helper in `category-image-store.ts` shared across Admin Categories table (`/admin/categories`) and Homepage (`/page.tsx`), eliminating image discrepancies.
    - **Real-Time Homepage Sync**: Updated `src/app/[locale]/(shop)/page.tsx` with `export const dynamic = "force-dynamic"` and `export const revalidate = 0` for instant real-time updates.
    - **Server Action Redirect Fix**: Updated `action-categories.ts` to return `{ success: true }` and `CategoryForm.tsx` to use `useRouter()` for seamless client navigation without Next.js `NEXT_REDIRECT` exceptions.
  - **Why**: To enable full image management for product categories, improve URL SEO friendliness with custom slugs, and ensure 100% 1:1 image parity between admin panel and buyer homepage.
  - **Gotchas**: (1) Supabase Storage bucket `allowedMimeTypes` initially blocked `application/json` for `category_map.json` — updated bucket settings to allow metadata JSON files. (2) Sibling `[id]` and `[slug]` folders caused Next.js routing conflict — deleted redundant `[id]` folder using `-LiteralPath`. (3) `redirect()` in Server Actions throws Next.js internal exception caught by client `try/catch` as `NEXT_INDEX` — solved by returning `{ success: true }` and calling `router.push()`.
  - **Open threads**: Ready for Phase 6 atomic commits.

*Myanmar — အနှစ်ချုပ်:*
- **2026-07-22**: Category Image Upload/Remove စနစ်၊ Custom Slug URL များ နှင့် Homepage 1:1 Image Parity စနစ်များ ပြီးစီးခဲ့သည်။
  - **ပြောင်းလဲမှု**: Category တိုင်းတွင် ပုံထည့်သွင်းခြင်း/ဖယ်ရှားခြင်း၊ Custom Slug URL (`/admin/categories/beauty/edit`) အသုံးပြုခြင်း၊ Admin နှင့် Homepage တပြိုင်နက်တည်း ပုံများတူညီစေရန် `resolveCategoryImage` နှင့် Instant Real-Time Sync (`revalidate = 0`) ထည့်သွင်းခြင်း။

- **2026-07-22**: Implemented full Multi-Vendor Marketplace (Phase 1–4) + Admin User Management.
  - **Changed**:
    - **Phase 1 (Seller Registration)**: Replaced one-click "Become a Seller" with full application form (`SellerApplicationForm.tsx`) → Admin approve/reject flow (`action-approve-seller.ts`). New migration `20260722100000_seller_applications.sql`. Admin `/admin/shops` rewritten with pending applications tab + active sellers tab.
    - **Phase 2 (Seller Dashboard)**: New `/seller/(portal)/` route group with layout, `SellerNav`, dashboard overview, products (own only), orders (own order_items + fulfillment status update), earnings (gross/commission/net + payout history).
    - **Phase 3 (Commission & Payouts)**: New migration `20260722110000_commission_payouts.sql` (`commission_settings` + `seller_payouts`). Admin commission settings page (`/admin/settings/commission`). Admin payouts page (`/admin/payouts`). `commission.service.ts` with category fallback to global rate.
    - **Phase 4 (Shop Pages)**: Completed `/shops/[seller_id]` (shop_name, product count, join date). New `/shops` index listing page. "Sold by [Shop]" badge on product cards + product detail page. `getProducts()` now joins seller info.
    - **User Management**: New `/admin/users` page with `CreateUserForm` (collapsible), role toggle (seller↔buyer), delete user. `action-users.ts` uses Supabase Auth Admin API (`createUser`, `deleteUser`). Admin Nav updated with Users + Payouts + Commission links.
    - **Other**: `ProductFilterBar` accepts `baseUrl` prop. Scratch files added to `.gitignore`. `tsconfig.json` excludes scratch `.ts` files. `project_mapping.md` fully rewritten for multi-vendor architecture.
  - **Why**: Multi-vendor marketplace transition — platform owner manages sellers; sellers manage own products/orders/earnings; buyers see shop pages.
  - **Gotchas**: (1) Zod v4 uses `.issues` not `.errors`. (2) Supabase returns arrays for joined relations — use `Array.isArray()` check or index `[0]`. (3) `ProductFilterBar` hardcoded `/admin/products/new` — fixed with `baseUrl` prop. (4) `csstype` package was corrupt — deleted and reinstalled. (5) `lock_user_role` trigger blocks self-escalation — admin approval uses `createAdminClient()` (service_role) to bypass. (6) DB migrations `20260722*` must be run manually on production SQL Editor before seller features work. (7) IDE showed false `Cannot find module CreateUserForm` — tsc clean, VS Code cache issue.
  - **Open threads**: (1) Run DB migrations `20260722100000` + `20260722110000` on production SQL Editor. (2) Create 5 brand seller users via `/admin/users` page. (3) Run product→seller assignment SQL (by category). (4) Commit pending — branch `fix/ui-currency-fixes`.

*Myanmar — အနှစ်ချုပ်:*
- **2026-07-22**: Multi-Vendor Marketplace (Phase 1-4) နှင့် Admin User Management အပြည့်အစုံ ဆောင်ရွက်ပြီးစီးခဲ့သည်။

Older entries: see [archive/2026-07.md](archive/2026-07.md)
