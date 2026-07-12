> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# cookie-privacy-scan အသုံးပြုနည်း

ဝဘ်ဆိုဒ်တစ်ခုမှာ ဘာ cookies တွေ သုံးထားလဲ၊ Third-party trackers တွေ ပါမပါ နဲ့ User က "Accept" (သဘောတူပါတယ်) လို့ မနှိပ်ခင်မှာတင် tracking လုပ်နေတာတွေ ရှိမရှိ စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Cookie/privacy scan https://..."
- "What trackers are on my site?"
- "Am I setting cookies before consent?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။ Consent banner (ခွင့်ပြုချက်တောင်းသည့်ဘောက်စ်) တွေ့လျှင် **မနှိပ်ဘဲ** (Pre-consent state အနေဖြင့်) အရင်စစ်ဆေးပါမယ်။
၂။ မနှိပ်ခင်မှာ ရှိနေတဲ့ cookies တွေနဲ့ storage တွေကို `mcp__playwright__browser_evaluate` ဖြင့် ကောက်ယူပါမယ်။
၃။ ဝင်ထွက်သွားတဲ့ network requests တွေကို `mcp__playwright__browser_network_requests` ဖြင့် ကောက်ယူပြီး၊ ခွင့်ပြုချက်မရခင်မှာ ကြိုတင်အလုပ်လုပ်နေတဲ့ third-party trackers (ဥပမာ analytics, ads domains) များ ရှိမရှိ ရှာဖွေပါမယ်။
၄။ Consent banner ရှိလျှင် `mcp__playwright__browser_click` ဖြင့် "Accept" ကို နှိပ်လိုက်ပြီးနောက်၊ Cookie တွေ ဘယ်လိုပြောင်းသွားလဲ (Before/After) နှိုင်းယှဉ်စစ်ဆေးပါမယ်။ `Secure`, `HttpOnly`, `SameSite` စတဲ့ attributes တွေကိုပါ စစ်ဆေးပါမယ်။
၅။ တွေ့ရှိချက်များကို အောက်ပါအဆင့်များအတိုင်း သတ်မှတ်ပါမယ်:
   - **High (GDPR/ePrivacy risk)**: ခွင့်ပြုချက် မရခင်မှာ တင် tracking cookie/pixel သုံးနေခြင်း။
   - **High**: HTTPS သုံးနေသော်လည်း Session cookie တွင် `Secure` မပါဝင်ခြင်း။
   - **Medium**: Session cookie တွင် `HttpOnly` မပါဝင်ခြင်း။
   - **Medium**: Cookie တွင် `SameSite` မပါဝင်ခြင်း။
   - **Info**: Third-party tracker များ ပါဝင်နေခြင်း။

၆။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
