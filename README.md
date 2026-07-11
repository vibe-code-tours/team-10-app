<div align="center">
  <img src="public/icon.svg" alt="Yoe Yar Zay Logo" width="120" height="120" />
  <h1>Yoe Yar Zay Online Shop</h1>
  <p>
    <em>A modern, high-performance E-commerce Platform & Multi-Vendor Marketplace</em>
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

**Yoe Yar Zay** is a premium e-commerce application built for the modern web. It seamlessly blends a highly responsive, mobile-first storefront with a dense, data-rich administrative dashboard. Engineered with **Next.js (App Router)** and backed by **Supabase**, it guarantees lightning-fast performance, real-time database capabilities, and enterprise-grade security.

## ✨ Key Features

- 🛍️ **Core E-Commerce Experience**
  - Dynamic product browsing with category filtering and infinite scroll.
  - Seamless shopping cart management and robust checkout flows.
- 🌍 **Bilingual Interface (i18n)**
  - Fully localized in **English** and **Myanmar** using `next-intl`.
  - Instant dynamic language switching with persistent routing.
- 🛡️ **Enterprise-Grade Security**
  - **In-memory Rate Limiting** with sliding-window algorithms to prevent brute-force attacks.
  - **Server-Authoritative Authorization**: Role validation strictly relies on the locked `public.users.role` column via server actions, preventing client-side metadata tampering.
- 📊 **Advanced Admin Portal**
  - High-density analytics dashboard featuring live sales tracking, order fulfillment, and inventory monitoring.
  - Fully integrated CMS for Product and Category CRUD operations.
- 🎨 **Premium UI/UX**
  - Custom glassmorphic design system utilizing pure CSS variables.
  - Pixel-perfect, fluid layouts ensuring 100% responsiveness across all viewports.
- 🚀 **Multi-Vendor Architecture (Upcoming)**
  - Architected to separate **Platform Admins**, **Sellers**, and **Buyers** natively.

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
 ┃ ┣ 📂 actions            # Next.js Server Actions (Auth, Admin, Shop)
 ┃ ┣ 📂 app
 ┃ ┃ ┗ 📂 [locale]         # Localized route group
 ┃ ┃   ┣ 📂 (shop)         # Storefront UI (Home, Cart, Checkout, Auth)
 ┃ ┃   ┗ 📂 admin          # Admin Portal & Analytics
 ┃ ┣ 📂 components         # Reusable React components (Admin, Layout, Home)
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

## 📚 Architecture & Documentation

We document our major architectural choices and workflows. Please refer to the `docs/` directory:
- [Architecture Overview](docs/ARCHITECTURE.md)
- [Architecture Decision Records (ADRs)](docs/decisions/)
- [Multi-Vendor Marketplace Spec](docs/features/multi-vendor-marketplace.md)

## 🤝 Contribution Guidelines

1. **Proposal First**: Create a feature spec or ADR for architectural changes before writing code.
2. **Safe Commits**: We utilize a strict `/safe-commit` workflow that checks for data leaks, enforces linting, and formats code before pushing.
3. **Bilingual Requirement**: Updates to documentation should be written in both English and Myanmar when appropriate.

---
<div align="center">
  <em>Developed with modern web standards and agentic coding assistance.</em>
</div>
