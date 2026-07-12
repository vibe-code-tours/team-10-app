> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# complexity-hotspots အသုံးပြုနည်း

ပရောဂျက်ထဲမှာ အရှုပ်ထွေးဆုံး ကုဒ်တွေ (ရှည်လွန်းတဲ့ function တွေ၊ အဆင့်ဆင့်တွေများလွန်းတာတွေ၊ God-files တွေ) ကို အဆိုးဆုံးကနေ စီစဉ်ပြီး ဘယ်လိုပြန်ရေးသင့်တယ် (refactor) ဆိုတဲ့ အကြံပြုချက်တွေ ပေးပါတယ်။ 

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး `radon`, `eslint`, `lizard` ကဲ့သို့သော tools များရှိလျှင် အသုံးပြုမည်ဖြစ်ပြီး မရှိပါက structure ကိုကြည့်၍ ခန့်မှန်းတွက်ချက်ပါမည်။)

## အသုံးပြုရန် Command များ (Trigger)
- "Find the most complex code in this repo"
- "Where are the refactor hotspots?"
- "Which functions are too complex?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ Metrics tool များ သွင်းထားခြင်းရှိမရှိ စစ်ဆေးပြီး ရှိပါက Run ပါမည်။
၂။ မရှိပါက Function/Method တစ်ခုချင်းစီကို အောက်ပါအတိုင်း ခန့်မှန်းတွက်ချက်ပါမည်-
   - **Length**: Function အတွင်းရှိ လိုင်းအရေအတွက်။
   - **Nesting depth**: `if/for` များ အဆင့်ဆင့် ဝင်နေမှု အနက်ဆုံးအဆင့်။
   - **Cyclomatic complexity**: Control flow အခွဲများ (`if/for/while/&&/||`) အရေအတွက်ကို ရေတွက်ခြင်း။
   - **Parameters**: Argument အရေအတွက်။
   - **God-files**: အရာရာကို လုပ်ဆောင်နေသော အလွန်ကြီးမားသည့် ဖိုင်များ ကိုလည်း မှတ်သားပါမည်။
၃။ အဆိုးဆုံး အချက်အလက်များကို ထိပ်ဆုံးထား၍ အစီအစဉ်ချပါမည်။ Hotspot တစ်ခုချင်းစီအတွက် အဓိက ပြဿနာနှင့် ပြင်ဆင်သင့်သည့် နည်းလမ်းများကို အကြံပြုပါမည်။

**သတ်မှတ်ထားသော ကန့်သတ်ချက်များ (Metrics Rules):**
- Function အရှည်: ၅၀ ကျော်လျှင် Warn, ၁၀၀ ကျော်လျှင် Bad
- Nesting depth: ၃ အဆင့်ကျော်လျှင် Warn, ၅ အဆင့်ကျော်လျှင် Bad
- Cyclomatic: ၁၀ ကျော်လျှင် Warn, ၂၀ ကျော်လျှင် Bad
- Parameters: ၄ ခုကျော်လျှင် Warn, ၇ ခုကျော်လျှင် Bad
- File အရှည်: ၄၀၀ ကျော်လျှင် Warn, ၈၀၀ ကျော်လျှင် Bad

၄။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
