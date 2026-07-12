> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# core-web-vitals အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုရဲ့ Core Web Vitals တွေဖြစ်တဲ့ LCP, CLS, INP, TTFB နဲ့ FCP တွေကို Browser ရဲ့ performance API တွေ အသုံးပြုပြီး တိုင်းတာပေးပါတယ်။ Google ရဲ့ သတ်မှတ်ချက်တွေနဲ့ နှိုင်းယှဉ်ကာ အစီရင်ခံစာ (A ကနေ F အထိ) ထုတ်ပေးမယ့် Skill ဖြစ်ပါတယ်။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Check Core Web Vitals for https://..."
- "How's the LCP/CLS on my site?"
- "Web vitals audit mysite.com"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ ဝဘ်စာမျက်နှာ ငြိမ်သွားသည်အထိ စောင့်ပါမယ် (Network idle ဖြစ်သည်အထိ သို့မဟုတ် ၃ စက္ကန့်ခန့်)။
၃။ Metrics များကို `mcp__playwright__browser_evaluate` ဖြင့် ကောက်ယူပါမယ်။
   - Navigation timing မှ TTFB နဲ့ FCP ကို ယူပါမယ်။
   - LCP နဲ့ CLS များကို PerformanceObserver မှတစ်ဆင့် ယူပါမယ်။
၄။ INP (Interaction to Next Paint) ဟာ နှိပ်ကြည့်မှ သိနိုင်တာဖြစ်တဲ့အတွက် `mcp__playwright__browser_click` နဲ့ အဓိက ခလုတ်တစ်ခုကို နှိပ်ပြီး တိုင်းတာပါမယ်။ မရပါက "not measured" အနေနဲ့ မှတ်သားပါမယ်။
၅။ တိုင်းတာရရှိတဲ့ Metric တစ်ခုချင်းစီကို Google ရဲ့ သတ်မှတ်ချက်များနှင့် နှိုင်းယှဉ်ပါမယ်:
   - **LCP**: 2500ms အောက် (Good), 2500–4000ms (Needs work), 4000ms အထက် (Poor)
   - **CLS**: 0.1 အောက် (Good), 0.1–0.25 (Needs work), 0.25 အထက် (Poor)
   - **INP**: 200ms အောက် (Good), 200–500ms (Needs work), 500ms အထက် (Poor)
   - **TTFB**: 800ms အောက် (Good), 800–1800ms (Needs work), 1800ms အထက် (Poor)
   - **FCP**: 1800ms အောက် (Good), 1800–3000ms (Needs work), 3000ms အထက် (Poor)
၆။ စုစုပေါင်း အဆင့် (Overall grade) သတ်မှတ်ပါမယ်။ (A: အားလုံး Good, B: Needs work ၁ ခု, C: Needs work ၂/၃ ခု, D: Poor တစ်ခုပါဝင်, F: Poor အများအပြားပါဝင်)
၇။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။ (ပြဿနာဖြစ်နေသော LCP များအတွက် အကြံပြုချက်များ ပါဝင်မည်ဖြစ်သည်)
