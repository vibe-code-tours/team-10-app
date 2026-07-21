# Project Directory Mapping

This document provides a high-level overview of the directory structure for the **Yoe Yar Zay** repository (Next.js App Router + Supabase). Multi-Vendor Marketplace architecture.

## 1. Root Directory

```text
YoeYarZay/
├── .agents/            # Architectural guardrails and memory logs
├── .claude/            # Claude specific configurations and agents
├── .git/               # Git repository configuration
├── src/                # The Next.js web application source code
├── supabase/           # Supabase backend configurations and migrations
├── messages/           # next-intl locale files (en.json, my.json)
└── README.md           # Project overview and setup instructions
```

## 2. Role Architecture

Three distinct user roles with separate portals:

| Role | Portal | Auth Guard |
|---|---|---|
| `admin` | `/admin` | `requireAdmin()` |
| `seller` | `/seller` | `requireAdminOrSeller()` |
| `buyer` | `/` (shop) | Supabase session |

## 3. Route Structure (`src/app/[locale]/`)

```text
src/app/[locale]/
├── (shop)/                    # Buyer-facing store
│   ├── layout.tsx             # Header + Footer
│   ├── page.tsx               # Homepage
│   ├── products/              # Product listing + detail
│   ├── shops/                 # Public shop pages (/shops, /shops/[seller_id])
│   ├── cart/                  # Cart page
│   ├── checkout/              # Checkout page
│   ├── (account)/             # Buyer account (settings, orders)
│   └── (auth)/                # Login, register
├── admin/
│   ├── login/                 # Admin login
│   └── (portal)/              # Admin dashboard (requireAdminOrSeller)
│       ├── page.tsx           # Sales overview
│       ├── products/          # All products CRUD
│       ├── categories/        # Category CRUD
│       ├── orders/            # All orders
│       ├── shops/             # Seller applications + active sellers
│       ├── users/             # User management (create/delete/role toggle)
│       ├── payouts/           # Seller payout management
│       └── settings/commission/ # Commission rate settings
├── seller/
│   └── (portal)/              # Seller dashboard (requireAdminOrSeller, role=seller)
│       ├── page.tsx           # Seller overview (stats)
│       ├── products/          # Own products CRUD
│       ├── orders/            # Own order items + fulfillment
│       └── earnings/          # Gross/commission/net + payout history
└── auth/callback/             # Supabase OAuth callback
```

## 4. Server Actions (`src/actions/`)

```text
src/actions/
├── admin/
│   ├── action-products.ts     # Product CRUD (admin+seller scoped)
│   ├── action-categories.ts   # Category CRUD
│   ├── action-orders.ts       # Order management
│   ├── action-approve-seller.ts # Approve/reject seller applications
│   ├── action-commission.ts   # Upsert/delete commission rates
│   ├── action-payouts.ts      # Create payout + mark paid
│   └── action-users.ts        # Create/delete/role-toggle users (Auth Admin API)
├── auth/
│   ├── action-become-seller.ts # Submit seller application + fetch status
│   ├── action-login.ts
│   ├── action-register.ts
│   └── action-signout.ts
├── seller/
│   └── action-fulfillment.ts  # Update order item fulfillment status
├── checkout/action-checkout.ts
├── shop/action-review.ts
├── cart/
└── upload/action-upload.ts
```

## 5. Services (`src/services/`)

```text
src/services/
├── product.service.ts         # getProducts (with seller join), getCategories, stats
└── commission.service.ts      # getCommissionRate (category fallback to global)
```

## 6. Key Components

```text
src/components/
├── admin/
│   ├── AdminNav.tsx           # Admin sidebar nav (role-aware)
│   ├── AdminHeaderTitle.tsx   # Dynamic header title by pathname
│   ├── CreateUserForm.tsx     # Collapsible user creation form
│   ├── ProductFilterBar.tsx   # Filter bar (baseUrl prop for seller/admin)
│   └── DeleteProductButton.tsx
├── seller/
│   └── SellerNav.tsx          # Seller sidebar nav
├── account/
│   └── SellerApplicationForm.tsx # Seller registration form (states: form/pending/approved/rejected)
└── layout/ currency/ shop/ ui/
```

## 7. Database Layer (Supabase)

Key tables and RLS:

| Table | Notes |
|---|---|
| `public.users` | `role`: buyer/seller/admin; `shop_name` for sellers |
| `public.products` | `seller_id` FK → users; RLS scoped by `is_admin()` or `is_seller()` |
| `public.orders` | Buyer orders; RLS: owner or admin or seller-with-item |
| `public.order_items` | `seller_id` FK; `fulfillment_status`; seller can update own |
| `public.seller_applications` | Pending/approved/rejected seller requests |
| `public.commission_settings` | Global default (category=NULL) + per-category rates |
| `public.seller_payouts` | Manual payout records; seller reads own |
| `public.categories` | Dynamic categories |
| `public.payment_proofs` | Payment proof uploads |

Auth helpers: `requireAdmin()`, `requireAdminOrSeller()` in `src/lib/supabase/auth-helpers.ts`.
Admin client (service_role, bypasses RLS): `createAdminClient()` in `src/lib/supabase/server.ts`.

## 8. Agent Guidelines
- Server Components fetch data directly — no client-side fetching unless interactive.
- Server Actions only for mutations — never raw REST from client.
- `cookies()` and `searchParams` are async in Next.js 15+ — always `await`.
- Admin auth: `requireAdmin()` only, never `user_metadata.role`.
- Seller product actions auto-scope by `seller_id = user.id` (RLS + explicit filter).
- Commission rates: fetch via `getCommissionRate(supabase, category)` — falls back to global.
