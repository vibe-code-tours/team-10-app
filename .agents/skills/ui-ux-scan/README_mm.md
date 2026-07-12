> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# ui-ux-scan အသုံးပြုနည်း

ဝဘ်စာမျက်နှာတစ်ခုရဲ့ အသုံးပြုသူ အတွေ့အကြုံ (UX) ကို လျော့ကျစေနိုင်တဲ့ ဒီဇိုင်း အမှားအယွင်းတွေကို အမြန်စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Scan UX issues on https://..."
- "Check UI quality of my site"
- "Find design problems on this page"
- "UX review this URL"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ Screenshot နှင့် Accessibility snapshot များကို ယူပါမယ်။
၃။ အောက်ပါ UI/UX လိုအပ်ချက်များကို စစ်ဆေးပါမယ်:
   - **Touch & Click Targets**: နှိပ်ရမည့် ခလုတ်/လင့်ခ်များသည် ၄၄x၄၄ px ထက် ငယ်နေသလား။
   - **Font Consistency**: ဖောင့်အမျိုးအစား ၃ မျိုး သို့မဟုတ် ဖောင့်အရွယ်အစား ၈ မျိုးထက် ပိုသုံးထားသလား။
   - **Spacing & Alignment**: နေရာလွတ် (Padding/Margin) များ မညီမညာဖြစ်နေသလား။ စာလုံးများ အစွန်းနှင့် အရမ်းကပ်နေသလား။
   - **Empty States**: Data မရှိတဲ့အချိန်မှာ ပြသတဲ့ Empty message မရှိတာတွေ၊ Placeholder စာသားအလွတ် (Lorem ipsum) တွေ ကျန်ခဲ့သလား။
   - **Loading & Feedback**: ခလုတ်တွေမှာ `cursor: pointer` ပါသလား။ Form နှိပ်လိုက်ရင် Loading လည်သလား။
   - **Visual Hierarchy**: အဓိကနှိပ်ရမည့် ခလုတ် (Primary CTA) တွေဟာ ထင်ရှားရဲ့လား၊ ခေါင်းစဉ်ကြီး/ငယ် အစီအစဉ် မှန်ရဲ့လား။
   - **Common Anti-patterns**: စာပိုဒ်တွေ အရမ်းရှည်နေတာ၊ Favicon မပါတာ၊ အသံတွေ အလိုအလျောက်ပွင့်တာ၊ Right-click ပိတ်ထားတာ တွေရှိသလား။
၄။ အဓိက စာမျက်နှာ ၂-၃ ခုကိုပါ အထက်ပါအတိုင်း ထပ်မံစစ်ဆေးပါမယ်။
၅။ အမှားအရေအတွက်ပေါ် မူတည်ပြီး A မှ F အထိ အမှတ်ပေး၍ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
