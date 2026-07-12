> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# seo-check အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုရဲ့ SEO (Search Engine Optimization) အခြေအနေကို အမြန်စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ Meta tag တွေ၊ Heading တွေ၊ ပုံတွေရဲ့ Alt text တွေနဲ့ အခြား အခြေခံ SEO လိုအပ်ချက်တွေကို စစ်ဆေးပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "SEO check https://..."
- "Check meta tags on my site"
- "Is my page SEO-friendly?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ `mcp__playwright__browser_evaluate` ကိုသုံးပြီး အောက်ပါ SEO အချက်အလက်များကို ထုတ်ယူပါမယ်:
   - Title, Description နှင့် ၎င်းတို့၏ အရှည် (Length)
   - Canonical URL
   - Social Media အတွက် Open Graph (OG) နှင့် Twitter Card tags
   - Heading (H1, H2) အစီအစဉ်များ
   - `alt` text မပါသော ပုံများ
   - Language attribute (`lang`)
   - Structured Data (JSON-LD)
   - Viewport setting
၃။ ရရှိလာသော အချက်အလက်များကို အောက်ပါအတိုင်း စစ်ဆေးပါမယ်:
   - **Title**: ၃၀-၆၀ စာလုံးအတွင်း ရှိရမည်။
   - **Description**: ၁၂၀-၁၆၀ စာလုံးအတွင်း ရှိရမည်။
   - **Headings**: H1 တစ်ခုတည်းသာ ရှိရမည်။ H2 များကို စနစ်တကျသုံးထားရမည်။
   - **Images**: ပုံတိုင်းတွင် alt text ပါရမည်။
   - **Open Graph / Twitter Card**: Facebook, Twitter တို့တွင် မျှဝေရန် အသင့်ဖြစ်ရမည်။
   - **Structured Data**: မှန်ကန်သော JSON-LD ပါဝင်ရမည်။
၄။ အထက်ပါ စစ်ဆေးမှုများအရ တွေ့ရှိချက်များကို အမှတ်ပေး၍ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
