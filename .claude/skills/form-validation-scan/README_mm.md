> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# form-validation-scan အသုံးပြုနည်း

ဝဘ်စာမျက်နှာပေါ်ရှိ Form တွေမှာ အချက်အလက် (Input) အမှားတွေ ထည့်သွင်းလို့ရနေသလား ဆိုတာကို စမ်းသပ်စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ Required field တွေ၊ Format မှားနေတာတွေနဲ့ Error ပြ/မပြ တွေကို စမ်းသပ်ပေးပါတယ်။ အကောင့်ဖွင့်ရန် (signup) မလိုအပ်ပါ။

## လိုအပ်ချက်များ (Prerequisites)
- **Playwright MCP** (Claude Code မှာ အသင့်ပါဝင်ပြီးသားဖြစ်ပါတယ်)

## အသုံးပြုရန် Command များ (Trigger)
- "Scan my forms for validation gaps"
- "Do my forms validate input?"
- "Form validation audit https://..."

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပေးထားသော URL ကို `mcp__playwright__browser_navigate` ဖြင့် သွားရောက်ပါမယ်။
၂။ `mcp__playwright__browser_evaluate` ကိုသုံးပြီး Form တွေနဲ့ Field အားလုံးကို (Required, pattern, maxLength စသည်) ထုတ်ယူပါမယ်။
၃။ Form တစ်ခုကို ရွေးချယ်ပြီး အောက်ပါ အခြေအနေများကို `mcp__playwright__browser_fill_form` နှင့် `click` သုံး၍ လက်တွေ့ စမ်းသပ်ပါမယ်:
   - **Empty required**: မဖြစ်မနေ ထည့်ရမည့် အကွက်များကို အလွတ်ထားပြီး Submit လုပ်ကြည့်ခြင်း။
   - **Bad email**: Email အကွက်တွင် email မဟုတ်သော စာသားများ ထည့်ကြည့်ခြင်း။
   - **Out-of-range**: ကိန်းဂဏန်းအကွက်များတွင် အနှုတ်တန်ဖိုးများ သို့မဟုတ် အလွန်ကြီးမားသော တန်ဖိုးများ ထည့်ကြည့်ခြင်း။
   - **Oversized**: အရမ်းရှည်တဲ့ စာသားတွေ ထည့်သွင်းကြည့်ခြင်း။
   - **Whitespace-only**: အလွတ် (Space) သက်သက်ကိုသာ ထည့်သွင်းကြည့်ခြင်း။
   - **Script payload**: `<script>alert(1)</script>` ကဲ့သို့ XSS payload များ ထည့်သွင်းကြည့်ခြင်း။
၄။ Submit လုပ်ပြီးတိုင်း `mcp__playwright__browser_snapshot` ဖြင့် ပြန်ကြည့်ကာ Form က တားဆီးသလား၊ Error Message ပြသလား ဆိုတာကို မှတ်တမ်းတင်ပါမယ်။
၅။ Field တစ်ခုချင်းစီအတွက် Validation ပြည့်စုံမှုရှိမရှိ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
