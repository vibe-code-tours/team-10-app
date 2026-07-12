> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# security-headers-check အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုရဲ့ HTTP Security Header တွေကို စစ်ဆေးပြီး အဆင့် (Grade A မှ F အထိ) သတ်မှတ်ပေးမယ့် Skill ဖြစ်ပါတယ်။ လိုအပ်နေတဲ့ သို့မဟုတ် မှားယွင်းနေတဲ့ Header တွေကိုလည်း ထောက်ပြပေးပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Check security headers on https://..."
- "Security headers scan mysite.com"
- "Is my site missing any security headers?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ Network ကနေ ပြန်လာတဲ့ Response header တွေကို ကောက်ယူပါမယ်။
၃။ အောက်ပါ အရေးကြီး Header များကို စစ်ဆေးပါမယ်:
   - **Content-Security-Policy (CSP)**: XSS အန္တရာယ်ကင်းဖို့အတွက် မဖြစ်မနေ ပါရပါမယ်။ (unsafe-inline/eval များ မပါဝင်ရပါ)
   - **Strict-Transport-Security (HSTS)**: HTTPS ကို အမြဲသုံးဖို့ ညွှန်ကြားချက်ဖြစ်ပြီး max-age သည် ၁ နှစ်ထက် မနည်းရပါ။
   - **X-Frame-Options**: အခြားဆိုဒ်များက မိမိဆိုဒ်ကို iframe ဖြင့် လှမ်းမခေါ်နိုင်အောင် ကာကွယ်ရန်။
   - **X-Content-Type-Options**: MIME-type ကို `nosniff` ဟု သတ်မှတ်ထားရန်။
   - **Referrer-Policy**: အခြားဆိုဒ်များသို့ လင့်ခ်သွားရာတွင် လုံခြုံရေးသတ်မှတ်ချက်များ ထည့်သွင်းထားရန်။
   - **Permissions-Policy**: Camera, Microphone, Geolocation ကဲ့သို့သော အရာများကို ထိန်းချုပ်ထားရန်။
၄။ အထက်ပါစစ်ဆေးမှုများအရ A (အကောင်းဆုံး) မှ F (ဘာမှမပါဝင်) အထိ အမှတ်ပေးပါမယ်။
၅။ အစီရင်ခံစာ (Report) ကို ပြင်ဆင်ရမည့် နည်းလမ်း (Quick Fix) နှင့်တကွ ထုတ်ပေးပါမည်။
