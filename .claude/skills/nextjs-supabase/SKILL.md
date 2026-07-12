---
name: nextjs-supabase
description: Best practices for writing Next.js Server Components and using the Supabase SDK for data fetching in the YoeYarZay project. Use when adding features, components, or database schema.
---

# Next.js + Supabase Best Practices for YoeYarZay

You are building **YoeYarZay**, an **e-commerce storefront** (products, cart, checkout, orders,
reviews, plus an admin portal). The stack is a **Next.js App Router monolith** with
**Supabase (PostgreSQL + Auth + Storage)**. Follow these practices when writing any code.

---

## 1. Project Structure

The app lives at the **repo root** — there is no `frontend/` directory.

```
src/
├── app/
│   └── [locale]/            # Next.js App Router pages (locale-segmented, next-intl)
├── actions/                 # Server Actions — ALL data mutations live here
│   ├── account/  admin/  auth/  cart/  checkout/  shop/  upload/
├── components/              # UI components
│   ├── layout/  home/  shop/  cart/  account/  admin/
├── lib/
│   ├── supabase/            # Supabase clients (client.ts, server.ts, middleware.ts)
│   ├── validations/         # Zod schemas
│   └── email/               # Resend / react-email templates
├── services/                # Shared domain logic
└── i18n/                    # next-intl config
supabase/
└── migrations/              # Plain .sql migrations
messages/                    # en.json / my.json translation catalogs
```

---

## 2. Best Practices

### App Router Conventions

Use **Server Components by default**. Only add `'use client'` when you need interactivity
(state, effects, browser APIs).

### Data Fetching Pattern

Create Supabase clients from `src/lib/supabase/` — `server.ts` in Server Components/Actions,
`client.ts` in Client Components. Do **not** instantiate Supabase clients ad hoc elsewhere,
and never hardcode the project URL.

- **Queries**: read directly in Server Components where possible.
- **Mutations**: go through a **Server Action** in `src/actions/` — never mutate from a
  Client Component via a raw fetch.

### Validation

Validate every Server Action input with a **Zod** schema (`src/lib/validations/`). Never trust
client-submitted data — including prices, quantities, and IDs.

### Supabase Migrations

Always write plain `.sql` migrations in `supabase/migrations/` when altering schema.

- Use UUIDs for primary keys: `id uuid PRIMARY KEY DEFAULT gen_random_uuid()`
- Use Postgres standard types: `timestamptz`, `text`, `numeric` for money.
- **Always enable Row Level Security (RLS) and define policies** — a customer must never be
  able to read or mutate another customer's orders, cart, or profile.

### Component Patterns

**Composition over configuration.** Build small, focused components and compose them. Avoid
giant components with many props controlling behavior.

### Styling

This project uses **plain CSS, not Tailwind.** Style with CSS classes backed by the
`var(--color-*)` custom-property tokens defined in `src/app/globals.css`. Dark mode is
`[data-theme="dark"]` (see `theme-provider.tsx`). Mobile-first responsive design.

### Internationalization

All user-facing strings go through **next-intl** (`messages/en.json`, `messages/my.json`).
Never hardcode display text in a component.

### Error & Loading States

Every async component must handle loading, error, and empty states. Use `loading.tsx`,
`error.tsx`, and `not-found.tsx` boundaries; Server Actions return standardized error objects
rather than throwing raw Supabase errors to the client.

---

## 3. What to Avoid

- **Never** add an external backend service or ORM (Prisma, Drizzle) — Supabase is the only backend.
- **Never** put secrets in client code. `NEXT_PUBLIC_` is for public values only — the Supabase
  **service role key must never reach the client**.
- **Never** use `useEffect` for basic data fetching when a Server Component would suffice.
- **Never** skip RLS policies in your SQL migrations.
- **Never** introduce a new npm package without explicit user permission.

---

*Myanmar — အနှစ်ချုပ်:*
*ဒီ skill က YoeYarZay (e-commerce storefront) မှာ Next.js Server Components နဲ့ Supabase SDK ကို ဘယ်လိုသုံးရမလဲ ညွှန်ကြားပါတယ်။ Data mutation အားလုံးကို `src/actions/` က Server Actions ကနေ လုပ်ပါ၊ input အားလုံးကို Zod နဲ့ စစ်ပါ၊ table တိုင်းမှာ RLS ဖွင့်ပါ၊ styling ကို Tailwind မဟုတ်ဘဲ `globals.css` ရဲ့ `var(--color-*)` token နဲ့ လုပ်ပါ။ Service role key ကို client ဘက် လုံးဝ မရောက်စေရပါ။*
