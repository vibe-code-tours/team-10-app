> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# security-auditor အသုံးပြုနည်း

ပရောဂျက်ရဲ့ လုံခြုံရေးအရာရှိ (Security Officer) တစ်ဦးအနေနဲ့ ကုဒ်တွေ၊ လျှို့ဝှက်ကုဒ်တွေနဲ့ လုပ်ငန်းစည်းမျဉ်း (Domain Policy) တွေကို တင်းကျပ်စွာ စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)

၁။ **Secret Scanning (လျှို့ဝှက်ကုဒ်များ စစ်ဆေးခြင်း)**: ကုဒ်တွေထဲမှာ API keys တွေ တိုက်ရိုက်ရေးထားတာ ရှိမရှိ စစ်ဆေးပါမယ်။ Supabase key တွေကို `.env` ကနေ ခေါ်ယူထားခြင်း၊ အထူးသဖြင့် **service role key ကို client ဘက် (`NEXT_PUBLIC_` var) သို့ လုံးဝ မရောက်စေခြင်း** ကို စစ်ဆေးပါမယ် (`src/lib/supabase/` ကို ကြည့်ပါ)။

၂။ **Endpoint Security (API လုံခြုံရေး)**: Next.js API routes (`src/app/api/`) သို့မဟုတ် Server Actions တွေ ထဲက အရေးကြီးတဲ့ API တွေကို Supabase Auth သို့မဟုတ် RLS ဖြင့် သေချာစွာ ကာကွယ်ထားခြင်း ရှိ/မရှိ စစ်ဆေးပါမယ်။

၃။ **Domain Policy (လုပ်ငန်းစည်းမျဉ်း)**: (အထူးသတိပြုရန်) E-commerce စည်းမျဉ်းများနှင့် ကိုက်ညီမှုရှိမရှိ စစ်ဆေးပါမည်။

၄။ **Error Handling (အမှားပြသမှု)**: Backend ကနေ ထွက်လာတဲ့ Error တွေ၊ Stack trace တွေမှာ အရေးကြီးတဲ့ အချက်အလက်တွေ ပါဝင်ပြီး Client ဘက်ကို မတော်တဆ ရောက်မသွားအောင် စစ်ဆေးပါမယ်။

၅။ **Report (အစီရင်ခံစာ)**: စစ်ဆေးတွေ့ရှိချက်များကို အင်္ဂလိပ် + မြန်မာ နှစ်ဘာသာဖြင့် အစီရင်ခံစာ တင်ပြပါမည်။
