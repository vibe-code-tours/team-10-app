> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# responsive-screenshots အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုကို ဖုန်း၊ တက်ဘလက်၊ လက်ပ်တော့၊ ဒက်စ်တော့ နဲ့ မျက်နှာပြင်ကျယ် (Ultrawide) စတဲ့ အရွယ်အစား ၅ မျိုးနဲ့ Screenshot ရိုက်ကူးပေးပြီး၊ Layout အမှားအယွင်းများ (Responsive issues) ရှိမရှိ စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Responsive screenshots of https://..."
- "How does my site look on mobile?"
- "Screenshot this page at different sizes"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို အောက်ပါ မျက်နှာပြင် အရွယ်အစား ၅ မျိုးဖြင့် ဖွင့်ပါမယ်:
   - Mobile: `375x812` (iPhone 14)
   - Tablet: `768x1024` (iPad)
   - Laptop: `1280x800` (MacBook)
   - Desktop: `1920x1080` (Full HD)
   - Ultrawide: `2560x1080` (34" monitor)
၂။ အရွယ်အစားတစ်ခုစီတိုင်းအတွက် စာမျက်နှာကို Resize လုပ်မယ်၊ ပုံပေါ်လာဖို့ (Reflow) ၁ စက္ကန့်လောက်စောင့်မယ်၊ ပြီးရင် Screenshot ရိုက်ပါမယ်။ ထို့နောက် ထွက်ကျနေတာ (overflow)၊ ထပ်နေတာ (overlap)၊ ပျောက်နေတာ (hidden content) ရှိမရှိ မှတ်သားပါမယ်။
၃။ ရိုက်ကူးထားတဲ့ Screenshot များကို အောက်ပါအတိုင်း ဆန်းစစ်ပါမယ်:
   - ဖုန်းမှာ ဘေးတိုက်ရွှေ့လို့ရနေလား (Horizontal scroll)။
   - ဖုန်းမှာ စာလုံးတွေ အရမ်းသေးနေလား (၁၄ px အောက်)။
   - နှိပ်ရမယ့်နေရာတွေ သေးလွန်းနေလား (၄၄x၄၄ px အောက်)။
   - Menu က ဖုန်းမှာ Hamburger ပုံစံ ပြောင်းမသွားဘဲ ဖြစ်နေလား။
   - ပုံတွေက သတ်မှတ်ထားတဲ့ နေရာထက် ကျော်လွန်နေသလား။
   - Fixed-width သတ်မှတ်ထားတဲ့ အရာတွေကြောင့် Layout ပျက်နေသလား။
၄။ အထက်ပါ စစ်ဆေးမှုများအရ Screenshot ဖိုင်များနှင့်တကွ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
