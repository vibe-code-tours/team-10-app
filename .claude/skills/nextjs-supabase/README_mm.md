> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# nextjs-supabase အသုံးပြုနည်း

YoeYarZay ပရောဂျက် — **e-commerce storefront** (products, cart, checkout, orders, reviews နဲ့ admin portal) — မှာ Feature အသစ်တွေ ထည့်တာ၊ Component တွေ ရေးတာ၊ Database ပြင်ဆင်တာတွေ လုပ်တဲ့အခါ အကောင်းဆုံး အလေ့အကျင့် (Best Practices) တွေကို လိုက်နာဖို့ ညွှန်ကြားပေးမယ့် Skill ဖြစ်ပါတယ်။ Stack က **Next.js App Router + Supabase (PostgreSQL + Auth + Storage)** ဖြစ်ပါတယ်။

## သတ်မှတ်ထားသော စည်းမျဉ်းများ (Best Practices)

**၁။ Project Structure (ဖိုင်တည်ဆောက်ပုံ)**
- App က **repo root** မှာပဲ ရှိပါတယ် — `frontend/` folder မရှိပါ။
- `src/app/[locale]` တွင် Next.js Page များ (next-intl locale routing)၊ `src/components/` တွင် UI များ၊ `src/actions/` တွင် Server Actions (data mutation အားလုံး)၊ `src/lib/supabase/` တွင် Supabase client များ၊ `src/lib/validations/` တွင် Zod schema များ ထားရှိရပါမည်။
- Database ပြင်ဆင်မှုများကို `supabase/migrations/` အောက်တွင်သာ `.sql` ဖြင့် ထားရှိရပါမည်။

**၂။ Next.js + Supabase Best Practices**
- **App Router Conventions**: Server Component များကို အဓိကထားသုံးပြီး၊ interactivity (state, effect, browser API) လိုမှသာ `'use client'` ကို သုံးရပါမည်။
- **Data Fetching Pattern**: Supabase client များကို `src/lib/supabase/` ကနေသာ ယူပါ (Server Component/Action မှာ `server.ts`၊ Client Component မှာ `client.ts`)။ Query တွေကို Server Component ထဲမှာ တိုက်ရိုက်ဖတ်ပါ။
- **Mutations**: Data ပြောင်းလဲမှု **အားလုံး** ကို `src/actions/` က Server Action ကနေသာ လုပ်ပါ — Client Component ကနေ raw fetch နဲ့ တိုက်ရိုက် မလုပ်ရပါ။
- **Validation**: Server Action input တိုင်းကို **Zod** schema နဲ့ စစ်ပါ။ Client ကပို့တဲ့ price, quantity, ID တွေကို လုံးဝ မယုံရပါ။
- **Supabase Migrations**: `.sql` အလွတ်ဖြင့်သာ ရေးရပါမည်။ UUID, Postgres standard types (timestamptz, text, ငွေအတွက် numeric) များကိုသုံးပြီး **RLS (Row Level Security) ကို အမြဲဖွင့်** ရပါမည် — customer တစ်ယောက်က တခြားတစ်ယောက်ရဲ့ order/cart/profile ကို လုံးဝ မမြင်ရ၊ မပြင်ရပါ။
- **Component Patterns**: Component အကြီးကြီးတွေမရေးဘဲ အသေးလေးတွေခွဲရေးပြီး ပြန်လည်ပေါင်းစပ် (Composition) သုံးရပါမည်။
- **Styling**: ဒီ project မှာ **Tailwind မရှိပါ** — `src/app/globals.css` ရဲ့ `var(--color-*)` token တွေကို plain CSS class နဲ့ သုံးပါ။ Dark mode က `[data-theme="dark"]` ဖြစ်ပါတယ်။
- **i18n**: User မြင်ရတဲ့ စာသားအားလုံးကို **next-intl** (`messages/en.json`, `messages/my.json`) ကနေသာ ထုတ်ပါ — component ထဲမှာ အသေမရေးပါနှင့်။
- **Error & Loading States**: Async component တိုင်းမှာ loading, error နှင့် empty state များ ထည့်သွင်းစဉ်းစားရပါမည် (`loading.tsx`, `error.tsx`, `not-found.tsx`)။

**၃။ လုံးဝ ရှောင်ကြဉ်ရမည့် အချက်များ (What to Avoid)**
- ပြင်ပ Backend သို့မဟုတ် ORM (Prisma, Drizzle) ကို လုံးဝ ထပ်မထည့်ရပါ — Supabase တစ်ခုတည်းသာ backend ဖြစ်ပါတယ်။
- လျှို့ဝှက်ကုဒ်များကို client ကုဒ်ထဲတွင် တိုက်ရိုက်မရေးရပါ။ `NEXT_PUBLIC_` ကို public value အတွက်သာ သုံးပါ — **Supabase service role key ကို client ဘက်သို့ လုံးဝ မရောက်စေရပါ**။
- Server Component နှင့်လုပ်၍ရသော Data fetching များကို `useEffect` ဖြင့် မလုပ်ရပါ။
- SQL migration ရေးရာတွင် RLS policy ထည့်ရန် လုံးဝ မမေ့ရပါ။
- ခွင့်ပြုချက်မရဘဲ npm package အသစ် လုံးဝ မထည့်ရပါ။
