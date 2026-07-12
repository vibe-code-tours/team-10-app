> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# console-error-scan အသုံးပြုနည်း

ဝဘ်စာမျက်နှာပေါ်က Browser console တွင် ပုန်းကွယ်နေသော JavaScript အမှားများ (errors)၊ သတိပေးချက်များ (warnings) နှင့် အလုပ်မလုပ်သော network request များကို ရှာဖွေထောက်လှမ်းပေးမည့် Skill ဖြစ်ပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Check for console errors on https://..."
- "Find JS errors on my site"
- "Any broken requests on this page?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ Console message များကို `mcp__playwright__browser_console_messages` ဖြင့် ကောက်ယူပါမယ်။
၃။ ကျရှုံးနေသော Network များကို `mcp__playwright__browser_network_requests` ဖြင့် ကောက်ယူပါမယ်။
၄။ အဓိက Navigation link ၃ ခုမှ ၅ ခုခန့်ကို နှိပ်ပြီး အထက်ပါအတိုင်း ထပ်မံကောက်ယူပါမယ်။
၅။ တွေ့ရှိချက်များကို အောက်ပါအတိုင်း အမျိုးအစားခွဲခြားပါမယ်။

### အမျိုးအစားများ (Categories)
- **JS Errors** — ဖြေရှင်းမထားသော exceptions, type errors, reference errors များ။
- **Failed Requests** — 4xx/5xx responses များ, CORS errors များ, timeouts များ။
- **Deprecation Warnings** — အသုံးမပြုသင့်တော့သည့် API (deprecated API) သုံးစွဲမှုများ။
- **Mixed Content** — HTTPS ဝဘ်စာမျက်နှာပေါ်တွင် HTTP အရင်းအမြစ်များ အသုံးပြုထားခြင်း။
- **CSP Violations** — Content Security Policy အရ ပိတ်ပင်ခံရမှုများ။

၆။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
