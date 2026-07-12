> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# accessibility-check အသုံးပြုနည်း

မည်သည့် web page ကိုမဆို WCAG accessibility စည်းမျဉ်းများနဲ့အညီ အမြန်ဆုံး scan ဖတ်စစ်ဆေးပေးပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Check accessibility on https://..."
- "WCAG scan this page"
- "Is my site accessible?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ `mcp__playwright__browser_snapshot` ကိုအသုံးပြုပြီး snapshot ယူပါမယ်။
၃။ အောက်ပါ အပိုင်းတစ်ခုချင်းစီကို စစ်ဆေးပါမယ်။

### စစ်ဆေးမည့် အချက်များ (Checks)

**ပုံများနှင့် Media (Images & Media)**
- `img` တိုင်းမှာ `alt` attribute ပါဝင်ရပါမယ်။
- အလှဆင်ဖို့ သက်သက်သုံးထားတဲ့ ပုံတွေဆိုရင် `alt=""` ဖြစ်ရပါမယ်။
- `video` နဲ့ `audio` တွေမှာ captions သို့မဟုတ် transcripts တွေ ပါရပါမယ်။

**ခေါင်းစဉ်များ (Headings)**
- Page တစ်ခုမှာ `h1` တစ်ခုတည်းသာ အတိအကျ ရှိရပါမယ်။
- ခေါင်းစဉ် အဆင့်တွေကို ကျော်မသွားရပါဘူး (ဥပမာ - `h1` ကနေ `h2` မရှိဘဲ `h3` ကို တန်းမသွားရပါဘူး)။
- ခေါင်းစဉ်တွေက အလွတ်မဖြစ်ရဘဲ ရှင်းလင်းမှု ရှိရပါမယ်။

**Form များ (Forms)**
- Input တိုင်းမှာ မြင်ရတဲ့ `label` သို့မဟုတ် `aria-label` ရှိရပါမယ်။
- မဖြစ်မနေ ထည့်ရမယ့် အကွက် (Required fields) တွေကို ရှင်းလင်းစွာ ပြထားရပါမယ်။
- Error messages တွေဟာ သက်ဆိုင်ရာ field တွေနဲ့ ချိတ်ဆက်ထားရပါမယ်။

**Keyboard အသုံးပြုမှု (Keyboard)**
- Interactive ဖြစ်တဲ့ element တွေ အားလုံးကို keyboard နဲ့ focus လုပ်လို့ ရရပါမယ်။
- Tab နှိပ်သွားတဲ့ အစဉ်လိုက်က သဘာဝကျရပါမယ် (logical order)။
- Keyboard traps မရှိရပါဘူး (အရာအားလုံးကို tab နဲ့ အဝင်/အထွက် လုပ်လို့ရရပါမယ်)။
- Focus လုပ်ထားတဲ့ indicator ဟာ မြင်သာရပါမယ်။

**အရောင်နှင့် Contrast (Color & Contrast)**
- စာသားတွေရဲ့ contrast အချိုးဟာ 4.5:1 (AA) ရှိရပါမယ်။
- စာလုံးအကြီး (18px+) တွေအတွက် အနည်းဆုံး 3:1 ရှိရပါမယ်။
- သတင်းအချက်အလက်တွေကို အရောင်တစ်ခုတည်းနဲ့ပဲ မခွဲခြားသင့်ပါဘူး။

**ARIA**
- Interactive element တွေမှာ ဖတ်နိုင်တဲ့ နာမည်တွေ (accessible names) ရှိရပါမယ်။
- `role` attribute တွေဟာ မှန်ကန်ရပါမယ်။
- `aria-hidden="true"` ကို focus လုပ်လို့ရတဲ့ element တွေမှာ မသုံးရပါဘူး။

**ဖွဲ့စည်းပုံ (Structure)**
- Page မှာ အဓိက အပိုင်းတွေ (main, nav, header, footer) ခွဲခြားထားရပါမယ်။
- Link တွေမှာ ရှင်းလင်းတဲ့ စာသားတွေ ပါရပါမယ် ("click here" လို့ မသုံးရပါဘူး)။
- `<html>` မှာ language attribute ပါရပါမယ်။

၄။ အထက်ပါ စစ်ဆေးမှုများအရ Page ကို အမှတ်ပေးပါမယ်။ (A: အမှား 0-1 ခု၊ B: 2-4 ခု၊ C: 5-8 ခု၊ D: 9-12 ခု၊ F: 13 ခုနှင့်အထက်)

၅။ Report ကို အောက်ပါပုံစံအတိုင်း အစီရင်ခံပါမယ်။
(Report Format Example များကို မူရင်း SKILL.md တွင် ကြည့်ရှုနိုင်ပါသည်။)
