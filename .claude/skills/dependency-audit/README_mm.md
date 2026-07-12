> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# dependency-audit အသုံးပြုနည်း

ပရောဂျက်မှာ သုံးထားတဲ့ package (dependency) တွေမှာ လုံခြုံရေး အားနည်းချက် (vulnerable) ရှိမရှိ၊ Version တွေ သေချာ မသတ်မှတ်ထားတာတွေ၊ ဆက်လက်ထိန်းသိမ်းမှုမရှိတော့တဲ့ (abandoned) package တွေနဲ့ အရမ်းဟောင်းနေတဲ့ version တွေကို စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး `npm audit`, `pip-audit`, `go list` ကဲ့သို့သော tools များရှိလျှင် အသုံးပြုမည်ဖြစ်ပြီး မရှိပါက manifest ဖိုင်များကို ကိုယ်တိုင်ဖတ်ရှု၍ စစ်ဆေးပါမည်။)

## အသုံးပြုရန် Command များ (Trigger)
- "Audit my dependencies"
- "Any risky packages in this repo?"
- "Check for outdated / vulnerable deps"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ Ecosystem ကို Manifest ဖိုင် (ဥပမာ - `package.json`, `requirements.txt`, `go.mod`, `Cargo.toml`) မှတစ်ဆင့် ရှာဖွေပါမည်။
၂။ သက်ဆိုင်ရာ native auditor (`npm audit`, `pip-audit`) ရှိပါက Run ပြီး ရလဒ်ကို ဖတ်ပါမည်။ မရှိပါက manifest ကို တိုက်ရိုက် စစ်ဆေးပါမည်။
၃။ အောက်ပါ အန္တရာယ် အမျိုးအစားများကို ရှာဖွေပါမည်:
   - **Known vulnerability**: Native auditor မှ ထောက်ပြထားသော လုံခြုံရေး အားနည်းချက်များ (CVE/advisory)။
   - **Unpinned**: `*` သို့မဟုတ် `latest` ဖြင့် version အတိအကျ မသတ်မှတ်ထားခြင်း။
   - **Wide range**: 0.x package များကို `^` သို့မဟုတ် `~` ဖြင့် သုံးထားခြင်း (Minor update များကြောင့် ပြဿနာဖြစ်နိုင်ပါသည်)။
   - **Badly outdated**: လက်ရှိ version မှ အလွန် နောက်ကျနေခြင်း။
   - **Abandoned**: အချိန်ကြာမြင့်စွာ update မရှိတော့ခြင်း သို့မဟုတ် upstream တွင် archive လုပ်သွားခြင်း။
   - **Heavy / duplicate**: မလိုအပ်ဘဲ အလွန်ကြီးမားနေခြင်း သို့မဟုတ် version နှစ်မျိုး ကွဲပြီး ထပ်နေခြင်း။
၄။ အရေးကြီးမှုအလိုက် အစီအစဉ်စီပြီး ပြင်ဆင်ရမည့် (update/replace) အကြံပြုချက်များကို ပေးပါမည်။
၅။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
