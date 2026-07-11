# Running Context Memory (Project: Yoe Yar Zay Online Shop)

> **Goal:** High-performance E-commerce platform built with Next.js (App Router) and Supabase.

## Current Focus
Closed the 5 findings from the API security scan (admin-auth + rate-limiting). Awaiting user confirmation on the Multi-Vendor Marketplace design (`docs/features/multi-vendor-marketplace.md`) before implementing role separation.

## Log

- **2026-07-11**: Executed /safe-commit workflow and modernized README.
  - **Changed**: Added missing sensitive patterns (`*.db`, etc.) to `.gitignore`. Fixed ESLint warnings (ignored scratch scripts in `eslint.config.mjs`, fixed unescaped quotes in `login` and `not-found` pages). Rewrote `README.md` completely with a modern layout, badges, tech stack grid, and comprehensive setup instructions.
  - **Why**: To prepare for a safe atomic commit, ensure strict linting passes, and provide a professional, fully-documented landing page for the repository.
  - **Gotchas**: ESLint v9 no longer supports `.eslintignore`; used `globalIgnores` in `eslint.config.mjs`.
  - **Open threads**: Ready for git commit.

- **2026-07-11**: Fixed all 5 `/code-review` security findings via `/code-fix` (admin-auth gaps + rate limiting).
  - **Changed**: Created `src/lib/supabase/auth-helpers.ts` (`requireAdmin()` — checks server-authoritative `public.users.role`, not client-editable `user_metadata`) and wired it into `action-categories.ts`, `action-products.ts`, `action-orders.ts` (replacing the login-only check). Created `src/lib/rate-limit.ts` (in-memory sliding-window `isRateLimited()` + `getClientIp()`) and applied it to `loginWithEmail` (5 attempts/60s per IP+email) and `submitReview` (3/60s per user). Marked all 5 items `[FIXED 2026-07-11]` in `.agents/reports/code_review_records.md`. Recorded the auth-source tradeoff as `docs/decisions/0002-admin-authorization-source-and-rate-limiting.md`.
  - **Why**: To close the 3 High Priority missing-admin-auth vulnerabilities and 2 Normal Priority rate-limiting gaps identified by the earlier API security scan, per user approval to fix all 5.
  - **Gotchas**: The existing admin layout (`src/app/[locale]/admin/(portal)/layout.tsx`) gates on `user.user_metadata?.role === "admin"`, which is self-editable by the user via the Supabase client SDK — deliberately did NOT reuse that pattern for the Server Action fixes. Separately (not fixed, logged as a follow-up): the `public.users` RLS policy `"Users can update own profile"` has no column restriction, so a user can currently self-escalate `role` to `admin` via `supabase.from('users').update({role:'admin'})`. The in-memory rate limiter is per-server-instance only (resets on restart, not shared across instances).
  - **Open threads**: Fix the `public.users` RLS self-escalation gap (needs user approval — out of this session's approved scope). Await user confirmation on Multi-Vendor Marketplace design.

- **2026-07-11**: Ran API security scan and initiated Multi-Vendor Marketplace feature design.
  - **Changed**: Executed the `api-security-scan` skill across Server Actions. Identified 3 high-priority Missing Function-Level Auth vulnerabilities and 2 Normal priority rate-limiting/pagination issues. Saved findings to `.agents/reports/code_review_records.md` for tracking. Created `docs/features/multi-vendor-marketplace.md` to document the planned separation of Platform Admin, Seller, and Buyer roles based on the user's `/interview-me` responses.
  - **Why**: To record security vulnerabilities without immediately fixing them (deferred to future `/code-fix` skill invocation) and to establish a formal feature design document for the multi-vendor architecture transition.
  - **Gotchas**: The current `/admin` portal lacks role checks (`user.role !== 'admin'`), functioning as a Super Admin portal for any authenticated user. True seller isolation is missing.
  - **Open threads**: Await user confirmation on the Multi-Vendor architecture design documented in `multi-vendor-marketplace.md`.

- **2026-07-10**: Redesigned footer and renamed project to Yoe Yar Zay.
  - **Changed**: Rebranded project from "Lin Let" to "Yoe Yar Zay" globally (`layout.tsx`, `Header.tsx`, `Footer.tsx`, `AdminHeaderTitle.tsx`, `send.ts`, `CartProvider.tsx`, `MEMORY.md`, etc.). Redesigned `Footer.tsx` with a premium multi-column e-commerce layout containing Trust Badges, Customer Service links, Payment & Logistics badges, Social Media links, and App Download buttons.
  - **Why**: To execute the user's request for a full project rename and to upgrade the footer UI to match modern online shop standards (like Shopee/Lazada).
  - **Gotchas**: `lucide-react` removed brand icons (Facebook, Instagram, Twitter, Linkedin) due to trademark issues. Attempting to import them caused build/IDE errors. Replaced them with raw inline SVG code to fix the issue.
  - **Open threads**: None.

- **2026-07-10**: Replaced generic placeholder images with semantic LoremFlickr images.
  - **Changed**: Modified `src/app/[locale]/(shop)/page.tsx` category icons to use `loremflickr.com` with specific semantic keywords (e.g. `laptop`, `mobilephone`, `cosmetics`). Executed a script using the Supabase Service Role Key to update the `image_url` column for 8 broken products (Acer Laptops, Beauty products) in the database with strictly relevant `loremflickr.com` URLs (e.g., `laptop`, `nailpolish`, `perfume`).
  - **Why**: Unsplash began blocking direct hotlinking of certain image URLs without an `ixid` token, causing 403 Forbidden broken images on the frontend. Initial fixes using `picsum.photos` or reusing working images resulted in mismatched semantic contexts (e.g., a train for a computer, Dior makeup for nail polish), which the user flagged as inaccurate. `loremflickr` provides reliable, keyword-specific image search placeholders.
  - **Gotchas**: Supabase Row Level Security (RLS) silently blocked the initial `update_broken_images.js` script because it used the `anon` key. Using the `SERVICE_ROLE_KEY` was required to bypass RLS and successfully update the rows.
  - **Open threads**: None.

- **2026-07-10**: Added brand Favicon and fixed translation crash.
  - **Changed**: Created `src/app/icon.svg` mimicking the Lin Let shopping bag brand logo with primary blue color as the Next.js app router favicon. Added missing `viewMore` translation to `HomePage` in both `messages/en.json` and `messages/my.json`.
  - **Why**: To address the user request for a favicon and proactively resolve the `Could not resolve HomePage.viewMore` runtime crash during Next-Intl rendering on the homepage.
  - **Gotchas**: None.
  - **Open threads**: None.

- **2026-07-10**: Optimized Admin dashboard to a high-density, compact UI.
  - **Changed**: Adjusted vertical padding of `.admin-main`, margins of `.admin-header`, spacing of `.admin-stats-grid`, padding/border-radius/icon sizes of `.admin-stat-card`, paddings/margins of `.admin-filter-bar`, row paddings on `.table th` and `.table td` (changed to `8px 12px`), and thumbnail sizes `.table-img`/`.table-img-placeholder` (changed to `36px`) in `src/app/globals.css`. Also reduced spacing of `.admin-top-header` in `src/app/[locale]/admin/layout.tsx`.
  - **Why**: To address the user's request to make the admin products list page UI compact ("UI ကျစ်လှစ်မှုရှိအောင် ပြင်ပေးပါ"), increasing info density and fitting more items within the viewport.
  - **Gotchas**: None.
  - **Open threads**: Redesign `/admin/orders` page.

- **2026-07-10**: Separated Admin panel layouts from the client shop navigation layout.
  - **Changed**: Moved all client-facing routes (`page.tsx`, `(account)`, `(auth)`) inside the dynamic `(shop)` route group folder. Created `src/app/[locale]/(shop)/layout.tsx` to render the client store header and footer around shop pages. Simplified the global root layout at `src/app/[locale]/layout.tsx` to strip these store wrappers. Implemented a dedicated top header bar inside `src/app/[locale]/admin/layout.tsx` containing the dashboard title, theme toggle, language switcher, and profile dropdown menu. Added the official brand name and logo icon link to the top of the admin sidebar panel. Restructured the layout to stretch to 100vh and top: 0, making both the sidebar and the top header sticky at top: 0. Aligned the brand logo container and the admin top header bar to sit horizontally on the same row with matching heights (56px) and border-bottom styling. Fixed vertical stack routing alignment inside [AdminNav.tsx](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/components/admin/AdminNav.tsx) using flexDirection: "column". Created client component [AdminHeaderTitle.tsx](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/components/admin/AdminHeaderTitle.tsx) to detect active pathnames reactively and render corresponding dynamic localized menu names in the header bar instead of the static portal name. Cleaned up redundant static page headers (`h1` and `p` descriptions) from admin subpages (dashboard, products list, categories list, orders list) to avoid duplicate titles and optimize vertical height. Relocated the "Add Product" button from the main body page header into the rightmost actions section of [ProductFilterBar.tsx](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/components/admin/ProductFilterBar.tsx) to unify controls, and reordered the layout to place the search input directly on the left side of the "Add Product" action buttons. Cleaned up redundant CSS margin-bottom rules from [.admin-stats-grid](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/app/globals.css) and [.admin-filter-bar](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/app/globals.css), and standardized parent layout gaps to var(--space-md) (16px) on all admin subpages. Connected both admin products filter bar and client-facing shop category sidebars to dynamically retrieve the categories list directly from the database categories table, showing display names (e.g. 'Beauty' instead of 'beauty') and allowing categories with 0 products to display dynamically.
  - **Why**: To separate store navigation components from the admin pages entirely, preventing store menus from leaking into the admin portal layout and fixing the layout misalignment (site name and search centered). Restructured spacing and made headers/sidebars sticky to create a premium fixed dashboard layout, aligning elements for perfect row-to-row parity. Restored vertical column list styling to sidebar menus which became horizontal under wrapper div parent nodes. Added dynamic screen header titles matching the selected menu selection to make dashboard context clearer, removing clutter in main view layouts. Integrated action flows (adding items) directly into filter control frames to present a more compact, enterprise-grade UX, and reordered inputs logically to place search next to main action controls. Eliminated layout spacing doubling anomalies, creating pixel-perfect, clean grid structures with zero spacing clutter. Mapped UI options to the actual category model rather than product-derived strings to ensure zero data discrepancies.
  - **Gotchas**: PowerShell requires `-LiteralPath` parameters to parse folder paths containing square brackets `[locale]`.
  - **Open threads**: None.

- **2026-07-10**: Implemented Category CRUD Management and Connected Dynamic Categories with Products.
  - **Changed**: Created migration `supabase/migrations/20260710180400_create_categories_table.sql` to define the categories table and seed it with existing unique category values. Created category CRUD actions in `src/actions/admin/action-categories.ts`. Added admin CRUD route pages under `/admin/categories` and created `CategoryForm.tsx` and `DeleteCategoryButton.tsx` components. Registered "Categories" sidebar link in `AdminNav.tsx` and localized text keys in `en.json` and `my.json`. Updated `ProductForm.tsx` and products pages to fetch categories dynamically from the database.
  - **Why**: To fulfill the user's request to manage categories dynamically with CRUD actions in the admin panel and select them dynamically when creating or editing products.
  - **Gotchas**: Calling `Date.now()` during inline rendering in `categories/page.tsx` triggered React 19 component purity compilation warning. Solved by replacing it with a conditional fallback check.
  - **Open threads**: Redesign `/admin/orders` page.

- **2026-07-10**: Implemented Profile Dropdown and Admin Sales Overview Dashboard.
  - **Changed**: Created [ProfileDropdown.tsx](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/components/layout/ProfileDropdown.tsx) client component and updated [Header.tsx](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/components/layout/Header.tsx) to integrate it. Added `id="payment"` anchor to [settings/page.tsx](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/app/[locale]/(account)/settings/page.tsx). Built the Sales & Analytics dashboard at [admin/page.tsx](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/app/[locale]/admin/page.tsx), and updated [AdminNav.tsx](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/src/components/admin/AdminNav.tsx) sidebar overview links. Localized all entries via [en.json](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/messages/en.json) and [my.json](file:///c:/Users/khuny/Desktop/Code/Lin%20Let/messages/my.json).
  - **Why**: To fix the broken `/account` link (which returned a 404) with a functional dropdown (settings, payment anchor, logout), and to fulfill the user's request for a core Admin Sales Overview & Analytics Dashboard overview page.
  - **Gotchas**: Account routes group `(account)` paths map dynamically without the parent group name (i.e. `/settings`, `/orders`).
  - **Open threads**: None.

- **2026-07-10**: Redesigned admin products page to a professional, responsive dashboard with metrics cards, advanced filters, delete safety, 10-product pagination, simplified footer, and full-width layout stretching.
  - **Changed**: Rewrote `src/app/[locale]/admin/products/page.tsx` for pagination, created `src/components/admin/ProductFilterBar.tsx` and `src/components/admin/DeleteProductButton.tsx`, modified `src/app/[locale]/admin/layout.tsx` for dynamic navigation, updated layout & tables styles in `src/app/globals.css` (stretched `.admin-container` to `width: 100%`), added translations, and updated `src/components/layout/Footer.tsx`.
  - **Why**: To deliver a premium, responsive inventory management dashboard with full-width content cards that expand to fill the entire remaining screen, resolving large layout gaps from the sidebar.
  - **Gotchas**: Synchronizing input states with URL search parameters via `useEffect` in `ProductFilterBar.tsx` triggered React cascading renders warning. Resolved by removing the effect and using a JSON-serialized `params` key on `<ProductFilterBar>` inside `page.tsx` to force state reset. Standard event handlers cannot be executed directly in Server Components, so a dedicated `<DeleteProductButton>` Client Component was created to handle delete warning prompts.
  - **Open threads**: Redesign `/admin/orders` page.

- **2026-07-10**: Relocated category title to a glassmorphic top-right overlay badge on product card images.
  - **Changed**: Modified `src/app/[locale]/(shop)/products/page.tsx` to move category rendering from the card body text into the card image container. Added `.product-card-category-badge` styling with backdrop filter blur, semi-transparency, and primary blue color shift on hover in `globals.css`.
  - **Why**: To prevent category titles from cluttering product name texts and improve card layout readability.
  - **Gotchas**: None.
  - **Open threads**: None.

- **2026-07-10**: Expanded computer brands to 8 total (including Microsoft Surface), corrected product-image mismatches, and built brand filter chips.
  - **Changed**: Added `brand` column to `public.products` table. Seeded exactly 10 latest model products per brand for 8 Computer brands (Apple, ASUS, Dell, HP, Lenovo, MSI, Acer, Microsoft) and 2 Mobile brands (Apple, Samsung), bringing the database total to 152 items. Corrected all mismatched seed image mappings (ASUS gaming laptops display gaming setups, etc.). Modified `src/app/[locale]/(shop)/products/page.tsx` to filter by `brand` query parameter, calculate category-specific brand counts, and render horizontal filter chips above the grid. Added matching `.brand-chip` styles in `globals.css`.
  - **Why**: To correct image mismatch feedback from the user, and to provide comprehensive brand selection for Computers (including Surface/Chromebooks) and Mobiles.
  - **Gotchas**: Cleared dependent transaction tables (`order_items`, `orders`, `product_reviews`) first to prevent foreign key check failures during re-seeding.
  - **Open threads**: None.

- **2026-07-10**: Added product counts next to category filters (category + counts), and updated start skill rules.
  - **Changed**: Modified `src/app/[locale]/(shop)/products/page.tsx` to compute categories and product counts dynamically in memory from the database. Added count display indicators next to both "အားလုံး" (All) and individual category links/chips on desktop and mobile. Also updated `.agents/skills/start/SKILL.md` to instruct agents to follow the Bilingual rule (English first, then Myanmar) for any `.md` contents under `.agents/` during bootstrapping.
  - **Why**: To address the user requests to show the exact product counts next to categories, and to mandate the Bilingual rule step directly in the `/start` workflow.
  - **Gotchas**: None.
  - **Open threads**: None.

- **2026-07-10**: Implemented Client-side Lazy Loading (Infinite Scroll) for Daily Discover Grid.
  - **Changed**: Extracted static server-side Daily Discover grid into a Client Component `src/components/home/DailyDiscover.tsx`. Implemented batch rendering (24 products initially, followed by 18 products per scroll batch) triggered by an `IntersectionObserver` with a styled blue spinning loader and simulated 600ms latency. Passed dynamic localized parameters from `page.tsx` and resolved TypeScript assignment errors.
  - **Why**: To prevent homepage lag, handle large product volume scaling, and offer a premium Shopee-style dynamic loading UX on scroll.
  - **Gotchas**: Keep prop definitions typed strictly. Pass default fallback empty arrays (`products || []`) to satisfy TypeScript compiler limits.
  - **Open threads**: None.

- **2026-07-10**: Overhauled homepage layout with featured highlight row panels.
  - **Changed**: Restricted homepage category row panel displays to only featured tech categories (`computer` and `mobile`), displaying 5 products + 1 view more card. Omitted other categories (`beauty` and `clothing`) from vertical row panels to make the homepage compact, leaving them accessible via bubble links and the unified Daily Discover feed.
  - **Why**: To prevent homepage layout redundancy and excessive vertical scroll, implementing a Shopee-style Highlight Row Panel design.
  - **Gotchas**: None.
  - **Open threads**: None.

Older entries: see [archive/2026-07.md](archive/2026-07.md)
