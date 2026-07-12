> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# page-weight-budget အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုရဲ့ အရွယ်အစား (Page weight) ဟာ သတ်မှတ်ထားတဲ့ ပမာဏ (Performance budget) အတွင်း ရှိမရှိ စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ Download ဆွဲရတဲ့ data ပမာဏ၊ Request အရေအတွက်၊ Render-blocking ဖြစ်နေတဲ့ JS/CSS တွေနဲ့ မလိုဘဲကြီးနေတဲ့ ပုံတွေကို စစ်ဆေးပေးပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Check page weight for https://..."
- "Is my site too heavy?"
- "Performance budget audit mysite.com"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ စာမျက်နှာ ငြိမ်သွားသည်အထိ စောင့်ပြီး Network requests များကို ကောက်ယူပါမယ်။
၃။ Resource အမျိုးအစားအလိုက် (document, script, image, css စသည်) စုစည်းပြီး အောက်ပါတို့ကို ရှာဖွေပါမယ်:
   - **Render-blocking resources**: `<head>` ထဲမှာ `async`/`defer` မပါတဲ့ script တွေ၊ preload မလုပ်ထားတဲ့ css တွေ။
   - **Oversized images**: ပြသထားတဲ့ အရွယ်အစားထက် အများကြီး ပိုကြီးနေတဲ့ ပုံတွေ၊ 200KB ထက် ကျော်နေတဲ့ ပုံတွေ။
   - Gzip သို့မဟုတ် Brotli ဖြင့် Compress မလုပ်ထားတဲ့ စာသားဖိုင်တွေ။
၄။ ပုံမှန် သတ်မှတ်ထားတဲ့ Budget များနှင့် နှိုင်းယှဉ် စစ်ဆေးပါမယ်:
   - စုစုပေါင်း Data ပမာဏ (Total transfer): 1.5 MB အောက်
   - Requests အရေအတွက်: ၅၀ ခု အောက်
   - JS ပမာဏ: 400 KB အောက်
   - Image ပမာဏ: 600 KB အောက်
   - Render-blocking: သုည (လုံးဝမရှိရပါ)
၅။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
