<div align="center">
  <img src="src/app/icon.svg" alt="Yoe Yar Zay Logo" width="120" height="120" />
  <h1>Yoe Yar Zay</h1>
  <p>
    <em>Myanmar Local Product Directory & E-Commerce</em>
  </p>

  <!-- Badges -->
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" alt="Next.js" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database%20%26%20Auth-3ECF8E?style=flat-square&logo=supabase" alt="Supabase" /></a>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react" alt="React 19" /></a>
    <a href="https://next-intl-docs.vercel.app/"><img src="https://img.shields.io/badge/i18n-next--intl-000000?style=flat-square" alt="next-intl" /></a>
    <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6?style=flat-square&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## 📖 Overview

**Yoe Yar Zay** is a web directory where Myanmar's local eco-friendly brands each get their own storefront, so international buyers can discover and shop directly from individual shops. Small businesses in Myanmar currently sell almost entirely through Facebook and TikTok — that works locally, but it's invisible to international buyers who expect a website, not a social feed.

Unlike a standard multi-vendor marketplace, Yoe Yar Zay is directory-first: each shop owns its storefront, its listings, and its payment method, with no platform-level payment processing or revenue splitting at MVP. Buyers get one shared cart across shops, but checkout happens per shop, with manual payment confirmation (QR code, account number, Wise, or PayPal) — a model built for shop owners who have real products and real demand, but no capacity to onboard onto a payment platform.

Built with **Next.js (App Router)** and **Supabase**, it's bilingual (English / Myanmar), mobile-responsive, and browsable without an account.

## ✨ Key Features

- 🏬 **Per-Shop Storefronts**
  - Each shop gets its own landing page, listings, and identity — not just a product row under one brand.
  - Shop owners manage their own catalog independently.
- 🛒 **Shared Cart, Per-Shop Checkout**
  - Buyers browse and add items from multiple shops into one cart.
  - Checkout splits by shop — one order and one payment flow per shop, not a single combined transaction.
- 💳 **Manual Payment Confirmation**
  - Shop owners upload their own payment details: QR code image, account number (local), or Wise / PayPal (international).
  - Buyers upload a payment screenshot and transaction reference number at checkout.
  - Shop owners confirm "Payment Received" to move the order forward — no platform payment processing required.
- 📦 **Order Status Tracking**
  - Order status is visible to both buyer and shop owner throughout, from payment submission to confirmation.
- 🌍 **Bilingual Interface (i18n)**
  - Fully localized in **English** and **Myanmar** using `next-intl`, with instant language switching and persistent routing.
- 🔎 **Directory Browsing**
  - Search and filter shops and products by category — eco-friendly, handmade, organic, and more.
  - Buyers can browse the full directory without creating an account.
- 🛡️ **Enterprise-Grade Security**
  - In-memory rate limiting with sliding-window algorithms to prevent brute-force attacks.
  - Server-authoritative authorization — role validation relies on the locked `public.users.role` column via server actions, preventing client-side metadata tampering.
- 📊 **Admin Portal**
  - Dashboard for platform oversight: shop approvals, order monitoring, and category management.
- 🎨 **Premium UI/UX**
  - Custom glassmorphic design system using pure CSS variables.
  - Fully responsive across all viewports, built for international buyers on any device.

## 🛠️ Tech Stack

| Category | Technologies |
| --- | --- |
| **Framework** | [Next.js (App Router)](https://nextjs.org/) |
| **Database & Auth** | [Supabase](https://supabase.com/) |
| **Language** | [TypeScript](https://www.typescriptlang.org/) |
| **Styling** | Vanilla CSS (`globals.css`) with CSS Variables |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Localization** | [next-intl](https://next-intl-docs.vercel.app/) |
| **Emails** | [React Email](https://react.email/) & [Resend](https://resend.com/) |

## 📂 Project Structure

```text
📦 yoeyarzay
 ┣ 📂 docs                 # Architecture, ADRs, and Feature Specs
 ┣ 📂 messages             # i18n dictionaries (en.json, my.json)
 ┣ 📂 src
 ┃ ┣ 📂 actions            # Next.js Server Actions (Auth, Admin, Shop, Orders, Payments)
 ┃ ┣ 📂 app
 ┃ ┃ ┗ 📂 [locale]         # Localized route group
 ┃ ┃   ┣ 📂 (shop)         # Storefront UI (Directory, Shop Pages, Cart, Checkout, Auth)
 ┃ ┃   ┗ 📂 admin          # Admin Portal & Platform Oversight
 ┃ ┣ 📂 components         # Reusable React components (Admin, Layout, Shop, Home)
 ┃ ┣ 📂 i18n               # next-intl configuration & routing
 ┃ ┗ 📂 lib                # Utilities (Supabase client, rate limiting, email)
 ┗ 📂 supabase/migrations  # Database schema files and seed data
```

## 🚀 Getting Started

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm**, **yarn**, or **pnpm**
- A [Supabase Account](https://supabase.com/)

### 2. Environment Variables

Clone the repository and create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Email Provider
RESEND_API_KEY=your-resend-api-key
```

### 3. Database Setup

Execute the SQL files located in `supabase/migrations/` in your Supabase SQL Editor to construct the schema, Row Level Security (RLS) policies, and insert initial seed data.

### 4. Installation & Running Locally

Install the project dependencies:

```bash
npm install
```

Start the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to your default locale (e.g., `/en`).

## 🎯 MVP Scope

Building toward our July 26 public demo:
- Shop owner registration, storefront setup, and product listing
- Buyer directory browsing and multi-shop cart
- Per-shop checkout with manual payment confirmation
- Order status visible to both buyer and shop owner

Explicitly out of scope for this MVP: platform-level payment processing, reviews/ratings, and seller analytics — planned for a later phase.

## 📚 Architecture & Documentation

We document our major architectural choices and workflows. Please refer to the `docs/` directory:
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Architecture Decision Records (ADRs)](docs/decisions/)
- [Directory & Multi-Shop Marketplace Spec](docs/features/multi-vendor-marketplace.md)

## 🤝 Contribution Guidelines

1. **Proposal First**: Create a feature spec or ADR for architectural changes before writing code.
2. **Safe Commits**: We utilize a strict `/safe-commit` workflow that checks for data leaks, enforces linting, and formats code before pushing.
3. **Bilingual Requirement**: Updates to documentation should be written in both English and Myanmar when appropriate.

---
<div align="center">
  <em>Developed with modern web standards and agentic coding assistance.</em>
</div>
