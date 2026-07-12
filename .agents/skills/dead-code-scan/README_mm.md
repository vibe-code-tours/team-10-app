> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# dead-code-scan အသုံးပြုနည်း

ပရောဂျက်ထဲမှာ အသုံးမပြုတော့တဲ့ ကုဒ်တွေ (Dead code)၊ အသုံးမပြုတဲ့ export တွေ၊ ဘယ်နေရာကမှ လှမ်းမခေါ်ထားတဲ့ ဖိုင်တွေ၊ မရောက်နိုင်တဲ့ ကုဒ်တွေ (unreachable branches) နဲ့ ပိုနေတဲ့ import တွေကို ရှာဖွေပြီး ဖျက်ပစ်ဖို့ အကြံပြုပေးမယ့် Skill ဖြစ်ပါတယ်။ 

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး `knip`, `ts-prune`, `vulture`, `deadcode` ကဲ့သို့သော tools များရှိလျှင် အသုံးပြုမည်ဖြစ်ပြီး မရှိပါက grep နှင့် import များကို အခြေခံ၍ ရှာဖွေပါမည်။)

## အသုံးပြုရန် Command များ (Trigger)
- "Find dead code in this repo"
- "Any unused exports / files?"
- "What can I safely delete?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပရောဂျက်သုံး ဘာသာစကား (Language) ကို ကြည့်ပြီး လိုအပ်သော analyzer tool ရှိမရှိ စစ်ဆေးပြီး ရှိပါက Run ပါမည်။ (JS/TS အတွက် `knip`/`ts-prune`, Python အတွက် `vulture`, Go အတွက် `deadcode`)
၂။ Tool များ မရှိပါက Grep ကို အခြေခံ၍ အောက်ပါတို့ကို ရှာဖွေပါမည်:
   - **Unused exports**: Export လုပ်ထားသော်လည်း အခြားဖိုင်များမှ လှမ်းခေါ်ထားခြင်း မရှိသော code များ။
   - **Unused imports**: Import လုပ်ထားသော်လည်း ဖိုင်ထဲတွင် အသုံးမပြုထားခြင်း။
   - **Unreferenced files**: ဘယ်ဖိုင်ကမှ import မလုပ်ထားသော (ရည်ညွှန်းမထားသော) ဖိုင်များ။
   - **Unreachable code**: `return`, `throw`, `break` နောက်တွင် ရေးထားသော အလုပ်မလုပ်နိုင်တော့သည့် ကုဒ်များ။
၃။ တွေ့ရှိချက်များကို ယုံကြည်ရမှု (Confidence) အဆင့် သတ်မှတ်ပေးပါမည်။ Dynamic import တွေ၊ routes တွေ၊ Framework convention တွေနဲ့ ပတ်သက်တာတွေဆိုရင် ဖျက်လို့ရ/မရ သေချာစစ်ဆေးဖို့ (low confidence) "verify before deleting" အဖြစ် သတိပေးပါမည်။
၄။ အထက်ပါ စစ်ဆေးမှုများအရ ဖျက်ပစ်လို့ရနိုင်တဲ့ ဖိုင်/ကုဒ်လိုင်းတွေ ပါဝင်တဲ့ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
