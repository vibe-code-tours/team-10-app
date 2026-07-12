> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# broken-link-scan အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုလုံးကို ရှာဖွေပြီး အလုပ်မလုပ်တော့တဲ့ (ကျိုးနေတဲ့) link တွေ၊ 404 error တွေ၊ redirect လုပ်နေတာတွေနဲ့ timeout ဖြစ်နေတာတွေကို အမြန်ရှာဖွေဖော်ထုတ်ပေးမယ့် Skill ဖြစ်ပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Find broken links on https://..."
- "Check for 404s on my site"
- "Scan links on this page"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ စာမျက်နှာပေါ်ရှိ Link (href) အားလုံးကို `mcp__playwright__browser_evaluate` ဖြင့် ဆွဲထုတ်ယူပါမယ်။
၃။ Link တစ်ခုချင်းစီအတွက် (အများဆုံး အခု ၅၀ အထိ) Status ကို အောက်ပါအတိုင်း စစ်ဆေးပါမယ်။
   - **Internal links (မိမိဝဘ်ဆိုဒ်အတွင်း):** ဝင်ရောက်ကြည့်ရှုပြီး error page များ ရှိမရှိ စစ်ဆေးပါမယ်။
   - **External links (ပြင်ပဝဘ်ဆိုဒ်များ):** မှတ်သားထားမည်ဖြစ်သော်လည်း crawl မလုပ်ပါ (rate limits မိမည်ကို ရှောင်ရှားရန်)။
   - 404, 500, အဆင့်ဆင့် redirect ဖြစ်နေမှုများ၊ href မပါသော link များနှင့် `javascript:void` များကို သတိပေးပါမယ်။

၄။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
(Report Format Example များကို မူရင်း SKILL.md တွင် ကြည့်ရှုနိုင်ပါသည်။)
