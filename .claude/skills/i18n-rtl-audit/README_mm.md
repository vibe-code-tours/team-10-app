> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# i18n-rtl-audit အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုကို ဘာသာစကား အမျိုးမျိုး (Internationalization - i18n) နဲ့ Right-to-Left (RTL - ဥပမာ အာရဗီ) ဘာသာစကားတွေအတွက် အဆင်သင့်ဖြစ်မဖြစ် စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ စာသားတွေရှည်သွားတဲ့အခါ Layout ပျက်သွားသလား၊ ဘာသာပြန်လို့မရတဲ့ စာသားတွေ (Hardcoded) ပါနေလားဆိုတာကို စစ်ဆေးပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "i18n audit https://..."
- "Will my layout break when translated?"
- "Check RTL support on my site"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ **Document attributes**: `<html lang>` နှင့် `dir` (Direction) attribute များ ပါ/မပါ စစ်ဆေးပါမယ်။ မပါလျှင် မျက်မမြင်သုံး Screen reader များနှင့် ဘာသာပြန်စနစ်များအတွက် အခက်အခဲဖြစ်စေပါတယ်။
၃။ **Pseudo-localization (စာသားအရှည် စမ်းသပ်ခြင်း)**: ရှိနေတဲ့ စာသားတွေကို ~40% ခန့် ပိုရှည်အောင် (ဥပမာ - အင်္ဂလိပ်မှ ဂျာမန်/ဖင်လန် သို့ ပြောင်းသည့်အခြေအနေမျိုး) ဖန်တီးပြီး Layout များ၊ Button များ ကျော်လွန်/ထွက်ကျ (Overflow/Clipping) သွားခြင်း ရှိမရှိ စစ်ဆေးပါမယ်။ Visual အနေနဲ့ `browser_take_screenshot` ဖြင့် မှတ်တမ်းတင်ပါမယ်။
၄။ **RTL စမ်းသပ်ခြင်း**: စာမျက်နှာကို `dir="rtl"` သို့ပြောင်းပြီး ညာမှဘယ်သို့ အစီအစဉ် ပြောင်းလဲခြင်းရှိမရှိ စစ်ဆေးပါမယ် (ဥပမာ - ဘယ်ဘက်ကပ်နေတဲ့ အရာတွေ ညာဘက်ရောက်သွားလား၊ Icon/Arrow တွေ ပြောင်းပြန်ဖြစ်သွားလား)။
၅။ **Hardcoded strings**: ဘာသာပြန်စနစ် (i18n wrapper) မသုံးဘဲ တိုက်ရိုက်ရေးထားတဲ့ UI စာသားများကို ရှာဖွေမှတ်သားပါမယ်။
၆။ အထက်ပါ စစ်ဆေးမှုများအရ ပြင်ဆင်သင့်သည့် အချက်များ ပါဝင်သော အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
