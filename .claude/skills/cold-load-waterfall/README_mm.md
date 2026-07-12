> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# cold-load-waterfall အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုကို Cache မရှိဘဲ (အစကနေ) ဖွင့်ကြည့်ပြီး ဘယ် network request တွေက အချိန်အကြာဆုံး ယူနေလဲဆိုတာကို ရေတံခွန် (waterfall) ပုံစံနဲ့ စမ်းသပ်စစ်ဆေးပေးပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Profile the cold load of https://..."
- "What's slow on first visit?"
- "Build a load waterfall for my site"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ် (Cache မပါသော အသစ်ဖွင့်ခြင်း)။
၂။ စာမျက်နှာ အပြည့်အစုံ ပေါ်လာသည်အထိ စောင့်ပါမယ်။
၃။ Resource timing များကို `mcp__playwright__browser_evaluate` ဖြင့် ဆွဲထုတ်ယူပါမယ်။
   - Request တစ်ခုချင်းစီရဲ့ စတင်ချိန်၊ ကြာချိန်၊ အရွယ်အစား နှင့် TTFB (Time to First Byte), DOMContentLoaded, LoadEnd အချိန်များကို ကောက်ယူပါမယ်။
၄။ Critical path ကို ရှာဖွေပါမယ်: DOMContentLoaded မတိုင်ခင် စတင်ပြီး အချိန်အကြာဆုံး ယူနေတဲ့ request တွေ၊ render-blocking ဖြစ်နေတဲ့ CSS/JS တွေ နဲ့ အနှေးကွေးဆုံး အပိုင်းတွေကို ဖော်ထုတ်ပါမယ်။
၅။ ရှာဖွေရရှိချက်များကို နားလည်လွယ်သော ASCII Waterfall ပုံစံဖြင့် Report ထုတ်ပေးပါမည်။

(Report တွင် Bottlenecks များ (ဥပမာ - app.css blocks first paint, TTFB ကြာနေခြင်း) အား ထောက်ပြပေးမည်ဖြစ်ပါသည်။)
