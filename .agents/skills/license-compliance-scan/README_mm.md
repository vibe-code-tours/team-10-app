> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# license-compliance-scan အသုံးပြုနည်း

ပရောဂျက်မှာ သုံးထားတဲ့ package (dependency) တွေရဲ့ License တွေဟာ ကိုယ့်ပရောဂျက်ရဲ့ License နဲ့ ကိုက်ညီမှု (conflict) ရှိမရှိ၊ Copyleft ပြဿနာတွေ ရှိမရှိနဲ့ License မရှိတဲ့ package တွေကို ရှာဖွေပေးမယ့် Skill ဖြစ်ပါတယ်။ 
(သတိပြုရန် - ဤ Skill သည် ထောက်ပြရုံသာဖြစ်ပြီး တရားဝင် ဥပဒေရေးရာ အကြံပြုချက် မဟုတ်ပါ။)

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး manifest ဖိုင်များနှင့် `LICENSE` ဖိုင်များကို တိုက်ရိုက်ဖတ်မည်ဖြစ်ကာ MCP မလိုအပ်ပါ။)

## အသုံးပြုရန် Command များ (Trigger)
- "Check my dependency licenses"
- "Any license conflicts in this project?"
- "License compliance scan"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပရောဂျက်ရဲ့ မူရင်း License ကို အရင်ရှာပါမယ် (`LICENSE` ဖိုင် သို့မဟုတ် `package.json` စသည်မှ)။
၂။ Package တွေရဲ့ Manifest ဖိုင်တွေကို ရှာဖွေပါမယ် (ဥပမာ - `package.json`, `requirements.txt`, `go.mod`, `pom.xml` စသည်)။ အဲ့ဒီမှာပါတဲ့ package တွေနဲ့ သူတို့ရဲ့ License တွေကို စာရင်းပြုစုပါမယ်။
၃။ Package ရဲ့ License နဲ့ ပရောဂျက် License ကို နှိုင်းယှဉ်ပြီး အောက်ပါ အချက်များကို ထောက်ပြပါမယ်:
   - **Strong copyleft in a permissive project**: ဥပမာ MIT သုံးထားတဲ့ ပရောဂျက်မှာ GPL သုံးထားတဲ့ package ပါနေရင် ကုဒ်တွေကို open source ပြန်လုပ်ပေးရမယ့် ပြဿနာ ရှိနိုင်ပါတယ်။
   - **Network copyleft (AGPL)**: SaaS အနေနဲ့ သုံးရင်တောင်မှ ကုဒ်ထုတ်ပေးရမယ့် သတ်မှတ်ချက်များ။
   - **Unknown / missing license**: License မရှိတဲ့ package တွေဟာ ဥပဒေအရ အန္တရာယ်ရှိပါတယ်။
   - **License changed across versions**: Version update လုပ်လိုက်တဲ့အခါ License ပြောင်းသွားခြင်းများ။
   - **Project itself missing a LICENSE**: မိမိပရောဂျက်မှာ License မရှိလျှင် အခြားသူများ ပြန်သုံးရန် အခက်အခဲရှိနိုင်ပါတယ်။
   - **Incompatible combinations**: အတူတကွ ပေါင်းစပ်ဖြန့်ချိလို့မရတဲ့ License နှစ်ခု ပါဝင်နေခြင်း။
၄။ တွေ့ရှိချက်များကို အရေးကြီးမှုအလိုက် `file:line` နှင့်တကွ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
