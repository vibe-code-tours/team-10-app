> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# new-feature အသုံးပြုနည်း

Feature အသစ်တစ်ခု ထည့်သွင်းချင်တဲ့အခါမှာ ကုဒ်မရေးခင် **အစီအစဉ် အရင်ဆွဲရမယ့် (Proposal-First)** စည်းမျဉ်းကို တင်းကျပ်စွာ လိုက်နာလုပ်ဆောင်ပေးမယ့် Skill ဖြစ်ပါတယ်။ (Plan -> Build -> Verify -> Save စနစ်ဖြင့် အလုပ်လုပ်ပါသည်)

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)

**၁။ Plan (အစီအစဉ်ဆွဲခြင်း - ကုဒ်မရေးသေးပါ)**
- `/start` ကို ခေါ်ထားပြီးဖြစ်ကြောင်း သေချာစေပါမည် (Rules, architecture, memory များကို သိရှိထားရန်)။
- လုပ်ဆောင်ရမည့် အရာများကို အောက်ပါအတိုင်း **အင်္ဂလိပ်၊ မြန်မာ နှစ်ဘာသာ** ဖြင့် Proposal (အစီအစဉ်) အရင် တင်ပြပါမည်:
  - **Must-Have Changes**: Feature အလုပ်လုပ်ရန် မဖြစ်မနေ ပြင်ဆင်ရမည့်အရာများ (Frontend + Backend)။
  - **Porting Strategy**: အကယ်၍ အခြား Framework မှ ပြောင်းလဲခြင်းဖြစ်ပါက Next.js/Supabase သို့ မည်သို့ပြောင်းမည်ကို ရှင်းပြခြင်း။
  - **Recommended Changes**: ပိုကောင်းအောင် ပြင်ဆင်နိုင်သည့် အခြားရွေးချယ်စရာများ။
- ဤအစီအစဉ်ကို **User က သေချာအတည်ပြု (Approve) ပြီးမှသာ** ကုဒ်စတင်ရေးသားပါမည်။

**၂။ Build (ကုဒ်ရေးသားခြင်း)**
- အတည်ပြုချက်ရပြီးပါက သတ်မှတ်ထားသော Project Rules များနှင့်အညီ ကုဒ်ရေးပါမည်:
  - **Architecture**: Frontend တွင် UI နှင့် Logic ခွဲရေးခြင်း၊ Backend တွင် Route -> Service -> Repository အဆင့်ဆင့်ရေးခြင်း။
  - **Performance**: အလုပ်လုပ်တာကြာမည့် အရာများကို Main thread တွင် မထားခြင်း။
  - **Security**: Zod ဖြင့် input စစ်ခြင်း၊ Supabase RLS ကို အားထားခြင်း၊ secret များကို `.env` ကနေသာ ခေါ်ခြင်း (service role key ကို client သို့ မရောက်စေရ)။
  - **Format**: ဖိုင်အကြီးများကို `[FIND]` / `[REPLACE WITH]` ဖြင့် သတိထား ပြင်ဆင်ခြင်း။

**၃။ Verify (စစ်ဆေးခြင်း)**
- **Unit tests** များ ထည့်သွင်းခြင်း/ပြင်ဆင်ခြင်း (Backend အတွက် `npm run test`, Frontend အတွက် Jest+RTL)။
- Test များကို run ပြီး အောင်မြင်မှသာ ပြီးစီးကြောင်း သတ်မှတ်ခြင်း။
- `npx prettier --write "src/**/*.{ts,tsx,css,md}"` ဖြင့် ကုဒ်များကို သပ်ရပ်အောင် (Format) လုပ်ခြင်း။
- အခြားသော အရေးကြီးသည့် အစိတ်အပိုင်းများ (Pan/Zoom, Drag-and-drop) ကို မထိခိုက်ကြောင်း (Regression check) စစ်ဆေးခြင်း။

**၄။ Save (မှတ်တမ်းတင်ခြင်း)**
- လုပ်ဆောင်ပြီးသမျှကို နောက်တစ်ကြိမ်အတွက် မှတ်သားထားရန် `/save-memory` ကို အသုံးပြု၍ `MEMORY.md` သို့မဟုတ် Project Map ကို အပ်ဒိတ်လုပ်ပါမည်။
