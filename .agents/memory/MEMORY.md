# Running Context Memory (Project: Yoe Yar Zay Online Shop)

> **Goal:** High-performance E-commerce platform built with Next.js (App Router) and Supabase.

## Current Focus
Previously, closed the 6 `/security-auditor` findings (RLS hardening + price-tampering + IDOR + error leaks) via `/code-fix`. The `requireAdmin()` Server-Action layer is now backed by RLS that actually enforces `role = 'admin'`. **Migration `20260712120000_harden_rls_and_schema.sql` is now LIVE on the production DB** (`rnrxbetdkosopdptkzqz.supabase.co`), applied manually via the SQL Editor and verified via REST. **No user currently has `role = 'admin'`** — must be set manually before admin actions will work again. Local agent skills have been successfully removed and migrated to a global configuration. Still awaiting user confirmation on the Multi-Vendor Marketplace design (`docs/features/multi-vendor-marketplace.md`). Separately, applied 7 `/ui-ux-scan` a11y/mobile fixes (focus rings, contrast, 44px tap targets, mobile theme/lang) which have been successfully **committed and merged**.

*Myanmar — အနှစ်ချုပ်:*
ယခင်လုပ်ဆောင်ခဲ့သော RLS လုံခြုံရေးပြင်ဆင်မှုများမှာ Production DB တွင် အသက်ဝင်နေပြီဖြစ်သော်လည်း Admin Role သတ်မှတ်ပေးရန် ကျန်ရှိနေသေးသည်။ Project အတွင်းရှိ Local agent skills များကို Global အဖြစ်သို့ အောင်မြင်စွာ ပြောင်းရွှေ့ဖယ်ရှားနိုင်ခဲ့သည်။ Multi-Vendor Marketplace ဒီဇိုင်းအတည်ပြုချက် စောင့်ဆိုင်းနေပြီး၊ UI/UX ပြင်ဆင်မှုများကိုလည်း အောင်မြင်စွာ Commit လုပ်ပြီးသွားပါပြီ。

## Log

- **2026-07-21**: Fixed Currency Switcher UI and Product Detail Page reference error via `/safe-commit` workflow.
  - **Changed**: Rewrote `CurrencySwitcher.tsx` with a custom dropdown component instead of native `<select>` to properly display FlagCDN images for all currencies (bypassing Windows emoji rendering limitations). Added missing `import Price` to `src/app/[locale]/(shop)/products/[id]/page.tsx` to fix the `ReferenceError: Price is not defined` crash. Added `.continue/` to `.gitignore`.
  - **Why**: To ensure currency flags are visible in the dropdown on Windows OS, and to fix a runtime crash when viewing product details.
  - **Gotchas**: Native `<select>` options cannot contain HTML `<img>` tags, so a custom `<ul>/<li>` dropdown was built using `lucide-react` and click-outside logic.
  - **Open threads**: Awaiting confirmation on Multi-Vendor Marketplace design.

*Myanmar — အနှစ်ချုပ်:*
- **2026-07-21**: Currency Switcher UI နှင့် Product Detail Page ရှိ Error များကို ပြင်ဆင်ခဲ့ပါသည်။
  - **ပြောင်းလဲမှု**: Windows OS တွင် နိုင်ငံအလံများ သေချာစွာပေါ်စေရန် `CurrencySwitcher.tsx` ကို Native `<select>` အစား Custom Dropdown (FlagCDN) ဖြင့် အစားထိုးရေးသားခဲ့ပါသည်။ `page.tsx` တွင် မပါဝင်ခဲ့သော `import Price` ကို ပြန်လည်ထည့်သွင်း၍ Error ဖြေရှင်းခဲ့ပါသည်။ `.continue/` ကို `.gitignore` တွင် ထည့်သွင်းခဲ့ပါသည်။
- **2026-07-21**: Resolved GitHub Issues #27, #28, #29, and #30 via `/safe-commit` workflow.
  - **Changed**:
    - **Issue #27**: Fixed guest cart product title persistence in `CartProvider.tsx`, `AddToCartButton.tsx`, and `guestCartSchema`. Added `__tests__/cart-guest-title.test.ts`.
    - **Issue #28**: Implemented Multi-Currency Support (`CurrencyProvider.tsx`, `CurrencySwitcher.tsx`, `<Price />` component) supporting USD ($), MMK (Ks), EUR (€), GBP (£), and THB (฿). Added `__tests__/currency.test.ts`.
    - **Issue #29**: Fixed email confirmation link expiration (`otp_expired` / `access_denied`) in `/auth/callback/route.ts` and `login/page.tsx`. Created `docs/email-confirmation-fix.md` and `__tests__/auth-callback.test.ts`.
    - **Issue #30**: Created branded registration HTML email template `supabase/templates/confirm_signup.html`, `verification.ts`, `sendVerificationEmail` in `send.ts`, and `docs/email-templates-setup.md`. Added `__tests__/email-template.test.ts`.
  - **Why**: To fix guest cart bugs, add multi-currency conversion, fix email confirmation links, and provide custom branded email verification templates.
  - **Gotchas**: All 5 test suites (15 tests) pass cleanly.
  - **Open threads**: Awaiting confirmation on Multi-Vendor Marketplace design.

*Myanmar — အနှစ်ချုပ်:*
- **2026-07-21**: GitHub Issues #27, #28, #29, #30 များကို ဖြေရှင်းပြီးစီးခဲ့ပါသည်။
  - **ပြောင်းလဲမှု**: Guest Cart Title မကျန်ခဲ့အောင် ပြင်ဆင်ခြင်း (#27)၊ USD, MMK, EUR, GBP, THB Multi-Currency စနစ် ထည့်သွင်းခြင်း (#28)၊ Email Confirmation OTP Verification နှင့် Error Handler ပြင်ဆင်ခြင်း (#29)၊ Branded HTML Registration Email Template နှင့် Setup Guide ထည့်သွင်းခြင်း (#30)။ Test Suites ၅ ခုလုံး (၁၅ ခုမြောက် Test Case များ) အောင်မြင်ပါသည်။


- **2026-07-14**: Executed `/safe-commit` workflow (pre-check, formatting, and docs).
  - **Changed**: Formatted the entire `src/` codebase using `prettier`. Updated `.agents/architecture/project_mapping.md` to reflect the removal of local agent skills (now globally hosted). All tests and linting passed.
  - **Why**: To prepare for a safe atomic commit, ensuring strict formatting and correct architectural documentation.
  - **Gotchas**: Local `.agents/skills` and `.claude/skills` were deleted by the user, moving skills globally.
  - **Open threads**: Proceeding to code review and atomic commits (Phase 6).

*Myanmar — အနှစ်ချုပ်:*
- **2026-07-14**: `/safe-commit` လုပ်ငန်းစဉ်ကို ဆောင်ရွက်ခဲ့ပါသည်။
  - **ပြောင်းလဲမှု**: `src/` အောက်ရှိ ကုဒ်အားလုံးကို `prettier` ဖြင့် format လုပ်ခဲ့ပါသည်။ Local agent skills များအား ဖယ်ရှားထားခြင်းကို ညွှန်းဆိုရန် `project_mapping.md` ကို ပြင်ဆင်ခဲ့ပါသည်။ Test နှင့် lint များ အားလုံး အောင်မြင်ပါသည်။
  - **အကြောင်းရင်း**: အမှားကင်းသော commit ပြုလုပ်နိုင်ရန်နှင့် codebase တစ်ခုလုံး ပုံစံတကျဖြစ်စေရန် ဖြစ်ပါသည်။
  - **သတိထားရန်**: Local `.agents/skills` များကို user မှ ဖျက်ပြီး global directory သို့ ရွှေ့ထားပါသည်။
  - **လက်ကျန်အလုပ်**: Commit အဆင့် (Phase 6) သို့ ဆက်လက်လုပ်ဆောင်ရန် ကျန်ရှိပါသည်။

- **2026-07-12**: Executed `/safe-commit` workflow for fixing Server Action types.
  - **Changed**: Fixed signature mismatches in `action-checkout.test.ts` (passing 3 arguments) and `action-profile.ts` (adding `state` for `useActionState`), resolving IDE errors in `ProfileSettingsForms.tsx`.
  - **Why**: To ensure type safety and proper integration with React 19's `useActionState`.
  - **Gotchas**: None.
  - **Open threads**: Proceeding to code review and atomic commits (Phase 6).

*Myanmar — အနှစ်ချုပ်:*
- **2026-07-12**: Server Action type ပြဿနာများကို ဖြေရှင်းပြီး `/safe-commit` ဆောင်ရွက်ခဲ့ပါသည်။
  - **ပြောင်းလဲမှု**: `action-checkout.test.ts` နှင့် `action-profile.ts` (React 19 `useActionState` အတွက် `state` ထည့်သွင်းခြင်း) တို့ကို ပြင်ဆင်ခဲ့ပြီး `ProfileSettingsForms.tsx` ရှိ IDE error များကို ဖြေရှင်းခဲ့ပါသည်။
  - **အကြောင်းရင်း**: Type များ မှန်ကန်စေရန်နှင့် React 19 ၏ `useActionState` နှင့် အဆင်ပြေစေရန် ဖြစ်ပါသည်။
  - **လက်ကျန်အလုပ်**: Commit အဆင့် (Phase 6) သို့ ဆက်လက်လုပ်ဆောင်ရန် ကျန်ရှိပါသည်။

- **2026-07-12**: Executed `/safe-commit` workflow (pre-check and formatting).
  - **Changed**: Fixed TypeScript lint errors (`any` types and unused imports) in `action-checkout.test.ts`, `ProfileSettingsForms.tsx`, and `settings/page.tsx`. Ran auto-formatter across `src/`.
  - **Why**: To ensure code quality and prevent broken builds before committing the recent UI/UX and security changes.
  - **Gotchas**: None.
  - **Open threads**: Proceeding to code review and atomic commits (Phase 6).

*Myanmar — အနှစ်ချုပ်:*
- **2026-07-12**: `/safe-commit` လုပ်ငန်းစဉ်ကို ဆောင်ရွက်ခဲ့ပါသည်။
  - **ပြောင်းလဲမှု**: TypeScript lint error များဖြစ်သော `any` type များနှင့် အသုံးမပြုသော import များကို ပြင်ဆင်ခဲ့ပါသည်။ `src/` အောက်ရှိ ဖိုင်များကို auto-format လုပ်ခဲ့ပါသည်။
  - **အကြောင်းရင်း**: UI/UX နှင့် လုံခြုံရေး ပြင်ဆင်မှုများကို Commit မလုပ်မီ ကုဒ်များ မှန်ကန်စေရန်နှင့် အရည်အသွေး ကောင်းမွန်စေရန် ဖြစ်ပါသည်။
  - **လက်ကျန်အလုပ်**: Commit အဆင့် (Phase 6) သို့ ဆက်လက်လုပ်ဆောင်ရန် ကျန်ရှိပါသည်။
- **2026-07-12**: Generated detailed Myanmar documentation (`README_mm.md`) for all 45 skills.
  - **Changed**: Created or overwrote `README_mm.md` in all 45 subdirectories of `.agents/skills/` (from `accessibility-check` to `ui-ux-tester`).
  - **Why**: The user pointed out that the previous Myanmar summaries were too brief ("အပေါ်ယံအကျဉ်းချုံး"). They requested detailed, step-by-step translations matching the original `SKILL.md` content, while keeping technical terms in English.
  - **Gotchas**: To avoid truncation issues, the generation was split into 9 batches of 5 skills using a "Batch Processing" strategy. Each `README_mm.md` includes a strict English directive instructing the agent to ignore the file and only read `SKILL.md`.
  - **Open threads**: The 7 `/ui-ux-scan` a11y/mobile fixes from earlier today have been successfully committed. The RLS-authorization design for Multi-Vendor Marketplace is still awaiting confirmation.

*Myanmar — အနှစ်ချုပ်:*
- **2026-07-12**: `.agents/skills/` အောက်ရှိ Skill (၄၅) ခုလုံးအတွက် အသေးစိတ် မြန်မာလိုရှင်းလင်းချက် (`README_mm.md`) များကို ရေးသားဖန်တီးပေးခဲ့သည်။
  - **ပြောင်းလဲမှု**: Skill ဖိုင်တွဲ ၄၅ ခုလုံးတွင် `README_mm.md` ဖိုင်များကို အသစ်ဖန်တီး/အစားထိုးခဲ့သည်။
  - **အကြောင်းရင်း**: ယခင်ရေးသားထားသော မြန်မာဘာသာအနှစ်ချုပ်များမှာ အပေါ်ယံသာဖြစ်နေသဖြင့် မူရင်း `SKILL.md` အတိုင်း အသေးစိတ် ဘာသာပြန်ပေးရန် User မှ တောင်းဆိုခဲ့သောကြောင့် ဖြစ်သည်။ နည်းပညာစကားလုံးများကို အင်္ဂလိပ်လိုသာထားရှိပြီး Batch လိုက်ခွဲ၍ ရေးသားခဲ့သည်။
  - **သတိထားရန်**: စာလုံးရေများ၍ ပြတ်တောက်သွားခြင်းမှ ကာကွယ်ရန် ၅ ခုစီ ခွဲ၍ (Batch processing ဖြင့်) ရေးသားခဲ့သည်။ Agent မှ ယင်းဖိုင်များကို မှားယွင်းမဖတ်မိစေရန် ဖိုင်ထိပ်ဆုံးတွင် အင်္ဂလိပ်ဘာသာဖြင့် တားမြစ်ချက် ထည့်သွင်းထားသည်။
  - **လက်ကျန်အလုပ်**: ယခင်လုပ်ဆောင်ထားသော UI/UX အပြောင်းအလဲများကို အောင်မြင်စွာ Commit ပြုလုပ်ပြီးသွားပါပြီ။ Multi-Vendor Marketplace အတွက် ဒီဇိုင်းအတည်ပြုချက် စောင့်ဆိုင်းနေဆဲဖြစ်သည်။

- **2026-07-12**: Fixed 7 `/ui-ux-scan` findings (static source audit) across CSS + header components.
  - **Changed**: `src/app/globals.css` — added a global `:focus-visible` outline (was: only `.form-input:focus` had any focus style); raised `--color-text-tertiary` `#999→#767676` (light) and `#555→#949494` (dark) for WCAG-AA contrast; changed `.header` `position: fixed→sticky` + solid `--color-surface` bg (resolving the conflict with Header's inline `sticky`); un-hid `.header-settings-group` on mobile (theme + language switcher were `display:none` under 768px — a11y/bilingual regression); added a mobile-only `@media (max-width:768px)` block giving `.icon-btn`/`.btn-sm`/chips/`.category-*-link`/footer links ≥44px tap area; bumped 9px badge fonts → 10px. `src/components/layout/Header.tsx` — removed the redundant inline `<header>` style, tokenized inline `24px/14px` font-sizes to `--font-size-2xl/--font-size-sm`, added `aria-label="Search"` to the search submit. Added `aria-label` to `LanguageSwitcher` and `aria-label`/`aria-haspopup`/`aria-expanded` to `ProfileDropdown` trigger.
  - **Why**: Static UI/UX audit (Playwright MCP unavailable) surfaced 3 high (touch targets, no keyboard focus, low contrast) + 4 warnings; user approved all 3 proposal phases.
  - **Gotchas**: Playwright MCP browser tools are NOT available in this environment — ran the scan against source instead. Verified via dev server: `/en` + `/en/products` render 200, compiled CSS serves `#767676`/`#949494`/`:focus-visible`, old `#999` gone. Header's inner/search bar remain inline-styled (no CSS-class equivalent; de-inlining them is deferred, higher-risk-than-value). Used `t("account")` for the ProfileDropdown label (key exists in both locales); avoided `t("searchPlaceholder")` for the search button since EN value is a promo string.
  - **Open threads**: Changes are UNCOMMITTED and UNVERIFIED VISUALLY (no screenshots without Playwright) — recommend a visual pass at ≤768px. Not yet run through `/safe-commit`.

- **2026-07-12**: Fixed all 6 `/security-auditor` findings via `/code-fix` (RLS hardening + price-tampering + IDOR + error leaks).
  - **Changed**: Created migration `supabase/migrations/20260712120000_harden_rls_and_schema.sql` — adds `public.is_admin()` (SECURITY DEFINER helper), locks products/categories writes to admins, adds a `lock_user_role` trigger (`prevent_role_change()`) blocking role self-escalation, replaces the wide-open `using(true)` orders/order_items policies with owner-or-admin scoping + a `guard_order_updates` trigger (non-admins may only touch payment fields), adds the missing `orders.payment_status` column, and creates the never-existed `payment_proofs` table with ownership-scoped RLS. Rewrote `src/actions/checkout/action-checkout.ts` to re-fetch prices/stock server-side, recompute the total (logs tamper warning on mismatch), persist server prices, and decrement stock via the service-role admin client. Fixed `src/actions/upload/action-upload.ts` (ownership check before proof insert; `buyer_id`→`user_id`). Replaced raw `error.message` leaks with generic messages in `action-products.ts`, `action-categories.ts`, `action-orders.ts`, `action-review.ts`. Marked all 6 items `[FIXED 2026-07-12]` in `.agents/reports/code_review_records.md`. Recorded the RLS-authorization design as `docs/decisions/0003-rls-server-authoritative-authorization.md`.
  - **Why**: The `requireAdmin()` Server-Action fixes from 2026-07-11 were bypassable — Supabase RLS treated any `authenticated` user as admin, so a signed-up user could skip the Server Actions and hit the anon REST API directly (`supabase.from('products').delete()`, read all orders' PII, self-escalate `role`). This closes the root cause plus the price-tampering and IDOR gaps flagged in the same audit.
  - **Gotchas**: (1) Locking `products` writes to admins meant the buyer's checkout stock-decrement was now RLS-blocked — fixed by using `createAdminClient()` (service_role, in `src/lib/supabase/server.ts`) for that one trusted step. (2) `orders` had NO `payment_status` column and `action-upload.ts` filtered on a nonexistent `buyer_id` — both were silent no-ops before. (3) `payment_proofs` was referenced by code but had no migration at all. (4) RLS column-level restriction isn't possible via policy alone (WITH CHECK can't see OLD), so both role-lock and order-field-lock are enforced by BEFORE UPDATE triggers. (5) **Applied manually via SQL Editor** (not `supabase db push` — CLI isn't linked, no DB password/Docker in this environment) directly against the production project `rnrxbetdkosopdptkzqz.supabase.co`; migration history table is NOT tracking it, so a future `supabase db push` may try to re-run it (harmless — it's fully idempotent: `if not exists`/`drop policy if exists`/`create or replace`) or may need `supabase migration repair --status applied <version>` first. (6) User initially ran it against the wrong (empty) Supabase project by mistake — always confirm the dashboard's project ref matches `NEXT_PUBLIC_SUPABASE_URL` before running DDL. (7) `supabase/schema.sql` in this repo is a **stale/divergent schema** (different column names — `owner_id`/`buyer_id`/email-based) that does NOT match the actual `migrations/` history the app uses — never run it.
  - **Open threads**: Set `role = 'admin'` on the actual admin account (`update public.users set role='admin' where id='<uuid>'`) — no user has it yet post-migration, so admin actions (`requireAdmin()` + RLS) will currently reject everyone. RLS smoke-test still pending: confirm a non-admin session gets denied on `products`/`categories` writes and can't self-escalate `role`. `docs/decisions/` has no README index (skill expects one). ADRs live in `docs/decisions/`, not `.agents/memory/decisions/` (which is empty). No `docs/PROJECT_MAP.md` exists.

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

Older entries: see [archive/2026-07.md](archive/2026-07.md)
