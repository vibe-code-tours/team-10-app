> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# ui-ux-tester အသုံးပြုနည်း

YoeYarZay E-commerce App (Next.js 16, Tailwind မဟုတ်ဘဲ plain CSS custom properties သုံးထားသော project) အတွက် UI/UX အရည်အသွေးကို အသေးစိတ် စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ Theme ညီ/မညီ၊ Responsive ဖြစ်/မဖြစ်၊ Interactive ပုံစံများ မှန်/မမှန်ကို စစ်ဆေးပေးပြီး **ကုဒ်ကို တိုက်ရိုက် လုံးဝ ပြင်ဆင်မည်မဟုတ်ပါဘူး**။ တွေ့ရှိသမျှကို အစီရင်ခံစာအနေနဲ့သာ မှတ်တမ်းတင်ပေးပါမယ်။

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)

**အဆင့် ၁: Design System & Theme Consistency Audit (ဒီဇိုင်းစည်းမျဉ်းများ စစ်ဆေးခြင်း)**
- `globals.css` ထဲက `var(--color-*)` token များအစား Hardcoded color (`#hex`, `rgb()`), Inline style နှင့် Spacing များ သုံးထားခြင်း ရှိမရှိ စစ်ဆေးပါမယ်။ 
- Dark Mode တွင် မှန်ကန်စွာ အလုပ်လုပ်/မလုပ် နှင့် ဖောင့်များ ညီညွတ်မှု ရှိ/မရှိ စစ်ဆေးပါမယ်။

**အဆင့် ၂: Responsive Layout Audit (မျက်နှာပြင်အရွယ်အစား စစ်ဆေးခြင်း)**
- Mobile, Tablet, Desktop အရွယ်အစားများတွင် ထွက်ကျနေတာ (Overflow)၊ ပုံတွေမကျုံ့တာ နဲ့ Navigation မကောင်းတာတွေကို စစ်ဆေးပါမယ်။

**အဆင့် ၃: Component Reuse & Consistency Audit (Component ဖွဲ့စည်းပုံ စစ်ဆေးခြင်း)**
- ခလုတ်တွေ၊ Modal တွေကို တစ်နေရာတည်းကနေ Shared component အဖြစ် မသုံးဘဲ ထပ်ခါတလဲလဲ အသစ်ရေးထားတာတွေ ရှိမရှိ စစ်ဆေးပါမယ်။

**အဆင့် ၄: Interactive States Audit (အလုပ်လုပ်ပုံ အခြေအနေများ စစ်ဆေးခြင်း)**
- ခလုတ်တွေနဲ့ Input တွေမှာ Hover, Focus, Active, Disabled, Loading, Error စတဲ့ အခြေအနေပြသမှု (States) တွေ အပြည့်အစုံ ပါ/မပါ စစ်ဆေးပါမယ်။

**အဆင့် ၅: Animation & Transition Audit (လှုပ်ရှားမှုများ စစ်ဆေးခြင်း)**
- Modal ဖွင့်တာ၊ Tab ပြောင်းတာတွေမှာ အသွင်ကူးပြောင်းမှု (Transition) ချောမွေ့မှု ရှိ/မရှိ စစ်ဆေးပါမယ်။

**အဆင့် ၆: Accessibility (a11y) Audit (အလွယ်တကူ သုံးနိုင်မှု စစ်ဆေးခြင်း)**
- `<div>` ကို `onClick` သုံးထားတာ၊ ပုံတွေမှာ `alt` မပါတာ၊ အရောင်မကွဲပြားတာ၊ Keyboard ဖြင့် အသုံးပြု၍ မရတာများကို စစ်ဆေးပါမယ်။

**အဆင့် ၇: User Flow & UX Logic Audit (အသုံးပြုသူ အတွေ့အကြုံ စစ်ဆေးခြင်း)**
- နှိပ်ရမယ့်နေရာတွေ ရှင်းလင်းမှုရှိမရှိ၊ အမှားပြတဲ့အခါ ရှင်းလင်းစွာပြသ/မပြသ၊ ဖျက်မယ့်အခါ Confirm တောင်း/မတောင်း တွေကို စစ်ဆေးပါမယ်။

**အဆင့် ၈: Browser Visual Check (ခွင့်ပြုချက် လိုအပ်ပါသည်)**
- User က ခွင့်ပြုမှသာ Browser ကိုဖွင့်ပြီး Screenshot ရိုက်ကာ အစအဆုံး လက်တွေ့စမ်းသပ် စစ်ဆေးပါမယ်။

**အဆင့် ၉: Categorize & Record Findings**
- တွေ့ရှိချက်များကို 🔴 **High Priority (ဦးစားပေး)** နှင့် 🟡 **Normal Priority (ပုံမှန်)** ခွဲခြားပြီး `.agents/reports/ui_ux_tester_records.md` တွင် မှတ်တမ်းတင်ပါမယ်။ ပြင်ဆင်လိုပါက `/code-fix` ကို သုံးရန် ညွှန်ကြားပါမယ်။
