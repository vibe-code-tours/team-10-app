> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# code-review အသုံးပြုနည်း

ပရောဂျက်ရဲ့ architecture, လုံခြုံရေး, performance နဲ့ formatting စည်းမျဉ်းတွေနဲ့အညီ ကုဒ်ကို သေချာစစ်ဆေးပေးပါတယ်။ 
(ဤ Skill သည် ကုဒ်ကို ပြင်ဆင်မည်မဟုတ်ဘဲ (Read-only) အစီရင်ခံစာကိုသာ မှတ်တမ်းတင်ပေးမည်ဖြစ်ပြီး ၎င်းကို `/code-fix` ကနေတဆင့် ပြန်ပြင်နိုင်ပါတယ်။)

## ရည်ရွယ်ချက် (Role)
Senior Code Reviewer တစ်ယောက်အနေနဲ့ အလုပ်လုပ်ပြီး ကုဒ်ရဲ့ အရည်အသွေးနဲ့ အမှားတွေကို ရှာဖွေမှတ်တမ်းတင်ပေးပါမယ်။ **ကုဒ်များကို လုံးဝ (လုံးဝ) တိုက်ရိုက် မပြင်ပါဘူး။** တွေ့ရှိချက် အားလုံးကို report ဖိုင်ထဲမှာပဲ ရေးမှတ်ပါမယ်။

## ပြန်လည်စစ်ဆေးမည့် အချက်များ (Review Axes)
(User သတ်မှတ်ပေးသော ဖိုင်များ သို့မဟုတ် `git diff` များကို အောက်ပါအချက်များဖြင့် စစ်ဆေးပါမယ်)

**Axis 1: Spec & Requirements (အလုပ်လုပ်သလား?)**
- သတ်မှတ်ချက် (requirements) များနှင့် ကိုက်ညီမှု ရှိမရှိ၊ Edge cases (null, zero division) များကို သေချာဖြေရှင်းထားခြင်း ရှိမရှိ။

**Axis 2: Project Standards (မှန်ကန်စွာ ရေးသားထားသလား?)**
- **Architecture check:** Modularity rules (ဖိုင်တစ်ခုတည်း ရှည်လွန်းနေသလား၊ တာဝန်တွေ ရောနှောနေသလား)။ Server Component ကို default အနေနဲ့ သုံးပြီး `'use client'` ကို လိုအပ်မှသာ ထည့်ထားသလား၊ data mutation တွေကို Server Actions (`src/actions/`) ဖြင့် လုပ်ထားသလား။
- **Performance check:** Next.js caching/static generation ကို အသုံးချထားသလား၊ Client component တွေမှာ `useMemo`/`useCallback` သုံးထားခြင်း ရှိမရှိ။
- **Domain compliance:** လောင်းကစား ဝေါဟာရများ (Bet, Gamble, Win Real Money) လုံးဝ မပါဝင်ရပါ။
- **Security:** Input များကို Zod ဖြင့် စစ်ဆေးထားခြင်း ရှိမရှိ၊ Supabase RLS ကို အားထားထားခြင်း၊ Service Role Key ကို client ဘက်ကို မထုတ်ပေးထားခြင်း (`NEXT_PUBLIC_` var ထဲ မထည့်ထားခြင်း)၊ Hardcoded secrets မရှိခြင်း။
- **Error Handling:** Server Actions များက standardized error object ပြန်ပေးထားခြင်း၊ `error.tsx`/`not-found.tsx` boundary များ သုံးထားခြင်း၊ silent `catch {}` မရှိခြင်း။
- **State Management:** React hooks (`useState`/`useReducer`) ကို local state အတွက်၊ Context ကို global UI state (လိုအပ်မှသာ) အတွက် သုံးထားခြင်း — ခွင့်ပြုချက်မရဘဲ state library အသစ် (Redux/Zustand) မထည့်ရပါ။
- **API contract:** Supabase client calls တွေကို `src/lib/supabase/` ထဲမှာပဲ ဗဟိုပြုထားပြီး component တွေထဲမှာ hardcoded URL မထည့်ထားခြင်း။

**Axis 3: Code Formatting & Dependencies (သပ်ရပ်မှု ရှိသလား?)**
- **Formatting:** `npm run lint`, `prettier --check` များကို သုံးပြီး format မကျသော ဖိုင်များကို မှတ်သားပါမယ်။ (တိုက်ရိုက် ပြင်မည်မဟုတ်ပါ)
- **Dependency guard:** `package.json` ကို စစ်ဆေးပြီး ခွင့်ပြုချက်မရဘဲ အသစ်ထည့်ထားသော npm package များကို ထောက်ပြပါမယ်။ (ဥပမာ - Supabase တစ်ခုတည်းသုံးရမည့် နေရာတွင် Prisma/Drizzle ကဲ့သို့ ORM အသစ် ထည့်ထားခြင်းမျိုး)

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)

**အဆင့် ၁: Analyze & Categorize**
- တွေ့ရှိချက်များကို 🔴 **High Priority** (အမြန်ပြင်သင့်တဲ့ကုဒ် - App crash ဖြစ်နိုင်ချေ၊ Security issues, Architecture ချိုးဖောက်မှု) နှင့် 🟡 **Normal Priority** (ပုံမှန် - မပြင်သေးလဲဖြစ်တဲ့ကုဒ် - Tests မပါတာ၊ Formatting မှားတာ) အဖြစ် ခွဲခြားပါမယ်။

**အဆင့် ၂: Record Findings**
- တွေ့ရှိချက်များကို `.agents/reports/code_review_records.md` ထဲသို့ ရက်စွဲဖြင့် တိုက်ရိုက် ရေးမှတ်ပါမယ်။ ဖိုင်မရှိသေးလျှင် အသစ်ဖန်တီးပါမယ်။

**အဆင့် ၃: Report Summary**
- အင်္ဂလိပ်၊ မြန်မာ နှစ်ဘာသာနဲ့ အနှစ်ချုပ် (High/Normal အရေအတွက်၊ အဆိုးဆုံးဖိုင်များ) ကို ပြသပြီး၊ ပြင်ဆင်ချင်ရင် `/code-fix` ခေါ်သုံးဖို့ ညွှန်ကြားပါမယ်။
