> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# architecture-guardrails အသုံးပြုနည်း

ဒီပရောဂျက်ရဲ့ Next.js (App Router) နဲ့ Supabase architecture စည်းမျဉ်းတွေအတွက် Code Quality၊ Performance၊ QA Test နဲ့ Policy သတ်မှတ်ချက်တွေကို တင်းကျပ်စွာ ထိန်းကျောင်းပေးမယ့် **Senior Code Quality Architect** လို အလုပ်လုပ်ပေးပါတယ်။

ဒီ Skill ဟာ **cross-cutting** ဖြစ်တဲ့အတွက် အခြားသော AI sub-agent များ အားလုံးအနေနဲ့ ကုဒ်ပြင်ဆင်မှုများ လုပ်ဆောင်တဲ့အခါ ဤစည်းမျဉ်းများကို မဖြစ်မနေ လိုက်နာရပါမယ်။

## ရည်ရွယ်ထားသော နယ်ပယ် (Target Scope)
- Application အဓိက ကုဒ်များဟာ repo root ရဲ့ `src/` (Next.js) အောက်တွင် ရှိပါတယ် — သီးခြား `frontend/` folder မရှိပါ။ (`old_` ဖြင့်စသော ဖိုင်များသည် အဟောင်းများဖြစ်ပြီး မပြင်ဆင်ရပါ)

**Architecture Rules:**
- **App Router (`src/app/`)**: Server Components များကို အဓိကထားသုံးပြီး interactivity လိုအပ်မှသာ `'use client'` ကို ထည့်ပါ။
- **Server Actions (`src/actions/`)**: Data အပြောင်းအလဲများအတွက် Server Actions သုံးပါ။ Supabase service role key ကို client သို့ လုံးဝ မပြပါနဲ့။
- **Components (`src/components/`)**: Modular ဖြစ်သော UI component များ (Tailwind မဟုတ်ဘဲ plain CSS class + `globals.css` token) အဖြစ်ရေးပါ။
- **Lib/Utils (`src/lib/`)**: မျှဝေသုံးစွဲမည့် utilities များ၊ Supabase client config (`src/lib/supabase/`) နှင့် Zod schemas များကိုထားပါ။

## အလုပ်လုပ်မည့် ပရိုတိုကောများ (Execution Protocols)

၁။ **Modularity (တာဝန်ခွဲဝေမှု):** ဖိုင်မပြင်ခင် ကုဒ်လိုင်းအရေအတွက်ကို စစ်ဆေးပါ။ (လိုင်း <၃၀၀ = ကောင်းမွန်၊ ၃၀၀-၅၀၀ = သတိထားရန်၊ >၅၀၀ = Human ကို အကြောင်းကြားရန်)။ အလိုအလျောက် ဖိုင်ခွဲခြင်း မလုပ်ရ၊ အတည်ပြုချက်ရယူပါ။
၂။ **State Management:** Data fetch ဖို့ Server Components သုံးပါ။ Local interactive အတွက် React hooks များ သုံးပါ။ Global UI state အတွက် Context သုံးပါ (Zustand ကဲ့သို့ state library မထည့်ရသေးပါ — ထည့်ရန် user ခွင့်ပြုချက် လိုအပ်ပါသည်)။
၃။ **Styling:** ဒီ project မှာ Tailwind မရှိပါ — `globals.css` ရဲ့ `var(--color-*)` token များကို plain CSS class ဖြင့် သုံးပါ။ Inline styles များနှင့် hardcoded အရောင်များကို ရှောင်ပါ။
၄။ **Performance:** Next.js caching စနစ်ကို အသုံးပြုပြီး Client-side JS ကို အနည်းဆုံးဖြစ်အောင် ထိန်းပါ။
၅။ **Error Handling:** `catch {}` ကို လျစ်လျူမရှုပါနဲ့။ `error.tsx` နဲ့ `not-found.tsx` များကို အသုံးပြုပါ။
၆။ **Security:** Zod schemas သုံးပြီး input မှန်သမျှကို စစ်ဆေးပါ။ Database အတွက် Supabase RLS ကို သေချာသုံးပါ။ Service Role Key ကို client သို့ လုံးဝ မရောက်စေရပါ။
၇။ **Dependencies:** ခွင့်ပြုချက်မရဘဲ npm package အသစ်များ လုံးဝ မထည့်ရပါ။
၈။ **Formatting:** အပြောင်းအလဲတိုင်းအတွက် `npx prettier --write` (project မှာ `npm run format` script မရှိပါ) နဲ့ `npm run lint` (ESLint) အမြဲလုပ်ပါ။

## စစ်ဆေးရမည့် အချက်များ (Checklist)
ကုဒ်ပြင်ဆင်မှုတိုင်းတွင် အထက်ပါ layering, modularity, state, styling, validation, security နှင့် formatting အချက်များအားလုံး ကိုက်ညီမှုရှိမရှိ စစ်ဆေးရပါမည်။ ရှင်းလင်းချက်များကို **မြန်မာလို (နည်းပညာဝေါဟာရများကို အင်္ဂလိပ်လိုထား၍)** အရင် ရှင်းပြပေးရပါမည်။
