> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# mixed-content-scan အသုံးပြုနည်း

HTTPS အသုံးပြုထားတဲ့ ဝဘ်စာမျက်နှာတွေပေါ်မှာ မလုံခြုံတဲ့ `http://` လင့်ခ်တွေ (Scripts, styles, images, iframes, forms) ရောနှောအသုံးပြုထားမှု (Mixed Content) ကို ရှာဖွေပေးမယ့် Skill ဖြစ်ပါတယ်။ 

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Mixed content scan https://..."
- "Any insecure resources on my HTTPS site?"
- "Why is my padlock showing 'not fully secure'?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။ (စာမျက်နှာသည် HTTPS ဖြစ်ရပါမည်။ HTTP ဖြစ်နေလျှင် ဤပြဿနာ မရှိနိုင်ပါ)
၂။ Request အားလုံးကို `mcp__playwright__browser_network_requests` ဖြင့် ကောက်ယူပြီး `http://` ဖြင့် ခေါ်ထားသည်များကို ရှာဖွေပါမယ်။
၃။ Request မသွားသေးသော်လည်း DOM ထဲတွင် ရေးထားသော အောက်ပါ `http://` လင့်ခ်များကိုလည်း ရှာဖွေပါမယ်:
   - Scripts, styles, images, iframes, media များ။
   - `action` တွင် `http://` ရေးထားသော Form များ။
   - `href` တွင် `http://` ရေးထားသော Anchor လင့်ခ်များ။
၄။ တွေ့ရှိချက်များကို အောက်ပါအတိုင်း ခွဲခြားပါမယ်:
   - **Active mixed content** (Scripts, styles, iframes, XHR): Browser မှ ပိတ်ပင်လိုက်မည်ဖြစ်၍ (Blocked) ဝဘ်စာမျက်နှာ အလုပ်မလုပ်တော့ပါ။ (High Severity)
   - **Passive mixed content** (Images, audio, video): Browser မှ ခွင့်ပြုသော်လည်း "Not fully secure" ဟု ပြသပါမည် (Padlock ပျောက်မည်)။ (Medium Severity)
   - **Insecure form action**: Form ကို `http://` ဖြင့် ပို့ပါက အချက်အလက်များ လုံခြုံမှုမရှိပါ။ (High Severity)
   - Browser console မှ ပေးသော Mixed Content သတိပေးချက်များကိုလည်း ထည့်သွင်းပါမယ်။
၅။ အထက်ပါ စစ်ဆေးမှုများအရ ပြင်ဆင်သင့်သည့် အချက်များ ပါဝင်သော အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
