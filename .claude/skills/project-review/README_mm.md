> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# project-review အသုံးပြုနည်း

ပရောဂျက်တစ်ခုလုံးရဲ့ ဖွဲ့စည်းပုံ၊ Token သုံးစွဲမှု အခြေအနေနဲ့ Architecture တွေကို စည်းမျဉ်းတွေနဲ့ ညီ/မညီ ခြုံငုံစစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။

## စစ်ဆေးမည့် အမျိုးအစားများ (Review Categories)
၁။ **Context Window Management**: ဖိုင်တွေဟာ သတ်မှတ်ထားတဲ့ လိုင်းအရေအတွက် (၃၀၀ ကနေ ၅၀၀ ကြား) ထက် ကျော်လွန်နေသလား။ (ကိုယ်တိုင် ခွဲထုတ်မည်မဟုတ်ဘဲ အကြံပြုချက်သာ ပေးပါမည်)
၂။ **Architecture & Tech Stack**: ပရောဂျက်ဟာ သတ်မှတ်ထားတဲ့ နည်းပညာ (Tech Stack) အတိုင်း သွားနေသလား၊ တားမြစ်ထားတဲ့ package တွေ သုံးထားသလား။
၃။ **AI Memory & System Rules**: `.agents/` အောက်က စည်းမျဉ်းတွေကို သေချာလိုက်နာရဲ့လား၊ အချင်းချင်း ဆန့်ကျင်ဘက်ဖြစ်နေတာတွေ ရှိလား။
၄။ **Task Decomposition**: Feature တွေကို ကောင်းစွာ ခွဲခြမ်းထားသလား ဒါမှမဟုတ် တစ်ခုတည်း အကြီးကြီး ဖြစ်နေသလား။
၅။ **Verification & CI/CD**: QA အတွက် CI/CD (ဥပမာ GitHub Actions) တွေ ပြင်ဆင်ထားသလား။
၆။ **Orphaned File**: ဘယ်ကနေမှ လှမ်းမခေါ်ထားတဲ့ အသုံးမပြုတော့တဲ့ component တွေ၊ docs တွေ ရှိနေသလား။
၇။ **Dependency Drift**: မလိုအပ်ဘဲ အရမ်းကြီးတဲ့ package တွေ သုံးထားသလား။

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Execution Steps)
၁။ အထက်ပါ အချက် ၇ ချက်ကို အခြေခံပြီး ပရောဂျက်တစ်ခုလုံးကို စစ်ဆေးပါမယ်။
၂။ မရှိသေးတဲ့ အရာတွေ သို့မဟုတ် အပ်ဒိတ်လုပ်ဖို့ လိုနေတဲ့ အရာတွေကို မှတ်သားပါမယ်။
၃။ တွေ့ရှိချက်များကို `.agents/reports/project_review_records.md` ဖိုင်ထဲသို့ **High Priority (ဦးစားပေး)** နှင့် **Normal Priority (ပုံမှန်)** ခွဲခြား၍ မှတ်တမ်းတင်ပါမယ်။
၄။ User ကို အင်္ဂလိပ်၊ မြန်မာ နှစ်ဘာသာဖြင့် အစီရင်ခံစာ တင်ပြပြီး မည်သည့်အချက်များကို ပြင်ဆင်လိုကြောင်း မေးမြန်းပါမယ်။
