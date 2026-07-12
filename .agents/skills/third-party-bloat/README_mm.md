> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# third-party-bloat အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုပေါ်မှာ အသုံးပြုထားတဲ့ ပြင်ပကုဒ်တွေ (Third-party scripts - ဥပမာ Google Analytics, Facebook Pixel, Chat widgets, Ads တွေ) ကြောင့် ဝဘ်ဆိုက် ဘယ်လောက်လေးလံသွားသလဲဆိုတာကို ရှာဖွေတွက်ချက်ပေးမယ့် Skill ဖြစ်ပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "What third-party scripts are slowing my site?"
- "Third-party bloat audit https://..."
- "Which trackers are on my page?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ ဝဘ်စာမျက်နှာ ငြိမ်သွားသည်အထိ စောင့်ပြီး Network requests များကို ကောက်ယူပါမယ်။
၃။ Request များကို မိမိဆိုဒ် (First-party) နှင့် ပြင်ပဆိုဒ် (Third-party) များအဖြစ် ခွဲခြားပါမယ်။
၄။ ပြင်ပကုဒ်များကို Domain အလိုက် စုစည်းပြီး နာမည်ကြီး ကုမ္ပဏီများဖြင့် အမည်တပ်ပါမယ်:
   - ဥပမာ - Analytics, Ads, Meta Pixel, Chat, A/B Testing စသဖြင့်။
၅။ ထို့နောက် ထိုပြင်ပကုဒ်များ၏ အရွယ်အစား (Size) နှင့် Main-thread ပေါ်တွင် ဝန်ပိမှု (Synchronous loading ဖြစ်နေခြင်း) ကို တွက်ချက်ပါမယ်။ အထူးသဖြင့် Session-replay (Screen record လုပ်သော) tool များကို အထူးသတိပြု မှတ်သားပါမယ်။
၆။ အလေးလံဆုံးသော (Heaviest offenders) ပြင်ပကုဒ်များကို အရေးကြီးမှုအလိုက် စီစဉ်ပြီး လျှော့ချရမည့် အကြံပြုချက်များနှင့်တကွ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
