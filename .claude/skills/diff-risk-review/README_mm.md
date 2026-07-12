> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# diff-risk-review အသုံးပြုနည်း

Commit မလုပ်ခင် ပြင်ဆင်ထားတဲ့ ကုဒ်အပြောင်းအလဲတွေ (git diff) မှာ အမှားအယွင်း၊ လုံခြုံရေး အားနည်းချက်နဲ့ Performance ကျဆင်းနိုင်တဲ့ အချက်တွေ ရှိမရှိ ဒုတိယအမြင် (Second pair of eyes) အနေနဲ့ စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး git repo ရှိတဲ့ မည်သည့်နေရာတွင်မဆို အလုပ်လုပ်ပါတယ်။ MCP မလိုအပ်ပါ။)

## အသုံးပြုရန် Command များ (Trigger)
- "Review my diff"
- "Risk-review these changes before I commit"
- "Anything wrong with what I just changed?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ကုဒ်အပြောင်းအလဲများကို ယူပါမယ် (`git diff`၊ `git diff --staged` သို့မဟုတ် `git diff origin/main...HEAD`)။
၂။ ပြောင်းလဲထားတဲ့ အပိုင်း (Hunk) တစ်ခုချင်းစီကို အောက်ပါအချက်တွေနဲ့ ကိုက်ညီမှုရှိမရှိ စစ်ဆေးပါမယ်။ (ပြဿနာတကယ်ရှိမှသာ အစီရင်ခံပါမယ်)

### စစ်ဆေးမည့် အချက်များ (What to look for)
**မှန်ကန်မှု (Correctness)**
- Off-by-one errors၊ ပြောင်းပြန်ဖြစ်နေတဲ့ conditions တွေ၊ operator အမှားတွေ (`=` vs `==`, `&&` vs `||`)။
- အသစ်ခေါ်သုံးထားတဲ့ နေရာတွေမှာ Null/undefined ဖြစ်နိုင်ချေရှိမှုများ။
- Function လိုအပ်ချက်ပြောင်းသွားပေမယ့် လှမ်းခေါ်တဲ့နေရာ (callers) တွေမှာ မပြင်ရသေးတာတွေ။
- Async: `await` ကျန်ခဲ့တာတွေ၊ Error ကိုမဖြေရှင်းထားတာတွေ (unhandled rejection)။

**လုံခြုံရေး (Security)**
- User input တွေကို မစစ်ဆေးဘဲ SQL, shell, `eval`, file paths, သို့မဟုတ် HTML တွေထဲ တိုက်ရိုက်ထည့်ထားတာတွေ။
- Secrets/Tokens အသစ်တွေကို ကုဒ်ထဲမှာ တိုက်ရိုက်ရေးထားတာတွေ (Hardcoded)။
- AuthZ: Route အသစ်တွေမှာ ပိုင်ဆိုင်မှု (ownership/permission) စစ်ဆေးဖို့ ကျန်နေတာတွေ။
- Log မှတ်တဲ့နေရာမှာ လျှို့ဝှက်ကုဒ်တွေ၊ ကိုယ်ရေးအချက်အလက် (PII) တွေ ပါသွားနိုင်တာတွေ။

**စွမ်းဆောင်ရည် (Performance)**
- N+1 query အသစ်တွေ သို့မဟုတ် Loop ထဲမှာ IO အလုပ်လုပ်နေတာတွေ။
- User ကန့်သတ်ချက်မရှိဘဲ အများကြီး ဆွဲယူတာ/နေရာယူတာတွေ။
- Main thread ကို ပိတ်ဆို့သွားစေနိုင်တဲ့ အလုပ်တွေ။

၃။ တွေ့ရှိချက်များကို အရေးကြီးမှုအလိုက် **BLOCKER** (app ပျက်နိုင်၊ အဟက်ခံရနိုင်)၊ **WARNING** (အမှားဖြစ်နိုင်) နှင့် **NIT** (သပ်ရပ်မှု/ရှင်းလင်းမှု) ဟု အဆင့် ၃ ဆင့်ခွဲခြားပြီး `file:line` နှင့်တကွ အစီရင်ခံပါမယ်။
၄။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
