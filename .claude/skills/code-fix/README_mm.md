> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# code-fix အသုံးပြုနည်း

အခြားသော Analysis skill များ (`/code-review`, `/ui-ux-tester`) ကနေ တွေ့ရှိထားတဲ့ အမှားတွေကို ဖတ်ပြီး၊ User ရဲ့ အတည်ပြုချက်ရယူကာ အရေးကြီးတဲ့ ပြင်ဆင်မှုတွေကို လုပ်ဆောင်ပေးပါတယ်။ (Read-only analysis တွေရဲ့ ပြင်ဆင်မှု အပိုင်း (Write-Only) အဖြစ် အလုပ်လုပ်ပါတယ်။)

## ရည်ရွယ်ချက် (Role)
ဒီပရောဂျက်အတွက် တစ်ခုတည်းသော **Write-only remediation agent** အဖြစ် အလုပ်လုပ်ပါတယ်။ Analysis skill ၃ ခုရဲ့ အစီရင်ခံစာ (report) တွေကို ဖတ်ပြီး၊ **User က သေချာအတည်ပြုမှသာလျှင်** ပြင်ဆင်မှုများကို ပြုလုပ်ပါမယ်။

## အဆင့်ဆင့် လုပ်ဆောင်ပုံ (READ → PRESENT → APPROVE → FIX → VERIFY → MARK FIXED)

### အဆင့် ၁: Report ဖိုင်များအားလုံးကို ဖတ်ခြင်း
Report ဖိုင် ၃ ခုကို ဖတ်ပြီး မဖြေရှင်းရသေးတဲ့ (unresolved `[ ]` ဖြစ်နေတဲ့) အချက်များအားလုံးကို စုစည်းပါမယ်။
- `/code-review` ၏ report ဖိုင်: `.agents/reports/code_review_records.md`
- `/ui-ux-tester` ၏ report ဖိုင်: `.agents/reports/ui_ux_tester_records.md`

ဖိုင် ၃ ခုလုံး မရှိသေးရင် သို့မဟုတ် အလွတ်ဖြစ်နေရင် User ကို အရင်ဆုံး analysis skill တစ်ခုခု ခေါ်သုံးဖို့ အကြောင်းကြားပါမယ်။ (ကိုယ်တိုင် အမှားတွေ မဖန်တီးပါဘူး)

### အဆင့် ၂: စုစည်းထားသော Priority List ကို ပြသခြင်း
စုစည်းထားတဲ့ ပြဿနာတွေကို Source အလိုက်၊ Priority အလိုက် (High Priority နှင့် Normal Priority) အုပ်စုခွဲပြီး User ကို ပြသပါမယ်။

### အဆင့် ၃: အတည်ပြုချက် ရယူခြင်း (Interactive Approval)
`ask_question` tool ကို သုံးပြီး ဘယ်အချက်တွေကို ပြင်ဆင်ချင်လဲဆိုတာ မေးပါမယ်။
ဥပမာ -
- "High Priority ပြဿနာ အားလုံးကို ပြင်ပါ"
- "/code-review က ပြဿနာတွေကိုသာ ပြင်ပါ"
- "ကျွန်တော့်ကို ရွေးချယ်ခွင့်ပေးပါ"
(မေးခွန်းများကို အင်္ဂလိပ်၊ မြန်မာ နှစ်ဘာသာဖြင့် မေးပါမယ်)

### အဆင့် ၄: ပြင်ဆင်ခြင်း နှင့် စစ်ဆေးခြင်း (Fix & Verify)
အတည်ပြုချက် ရပြီးပါက-
၀။ **Safety checkpoint:** မပြင်ဆင်ခင် အမှားဖြစ်ခဲ့ရင် ပြန်ယူလို့ရအောင် git stash လိုမျိုး reversible restore point တစ်ခု အရင်လုပ်ပါမယ်။
၁။ **Fix:** သတ်မှတ်ထားတဲ့ Project rules တွေနဲ့အညီ ကုဒ်ကို ပြင်ဆင်ပါမယ်။
၂။ **Recheck:** ပြင်ပြီးသွားရင် အမှားတကယ်ပျောက်သွားပြီလားဆိုတာကို မူလ source skill ရဲ့ script (သို့) test တွေ run ပြီး သေချာစစ်ဆေးပါမယ်။
၃။ **Format:** ပြင်ဆင်မှုတွေအကုန်ပြီးရင် `npx prettier --write "src/**/*.{ts,tsx,css,md}"` သုံးပြီး ကုဒ်ကို format လုပ်ပါမယ် (project မှာ `npm run format` script မရှိပါ)။

### အဆင့် ၅: Report Records များ အပ်ဒိတ်လုပ်ခြင်း
ပြင်ဆင်ပြီးသွားတဲ့ အချက်တွေကို report ဖိုင်ထဲမှာ `- [x] [FIXED YYYY-MM-DD]` ဆိုပြီး ပြင်ဆင်ခဲ့တဲ့ ရက်စွဲနဲ့တကွ ပြောင်းလဲမှတ်သားပါမယ်။

### အဆင့် ၆: အနှစ်ချုပ် နှင့် Memory သိမ်းဆည်းခြင်း
အင်္ဂလိပ်၊ မြန်မာ နှစ်ဘာသာနဲ့ အနှစ်ချုပ် (ဘာတွေပြင်ခဲ့တယ်၊ ဘာတွေကျန်ခဲ့တယ်) ကို ပြသပြီး၊ နောက် session တွေအတွက် သိမ်းဆည်းဖို့ `/save-memory` ကို run ရန် ညွှန်ကြားပါမယ်။
