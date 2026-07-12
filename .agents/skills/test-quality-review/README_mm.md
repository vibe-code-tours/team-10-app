> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# test-quality-review အသုံးပြုနည်း

ပရောဂျက်မှာ ရေးထားတဲ့ Test တွေဟာ တကယ်ရော အလုပ်လုပ်ရဲ့လား၊ သေချာစစ်ဆေးပေးရဲ့လား ဆိုတဲ့ Test တွေရဲ့ အရည်အသွေး (Quality) ကို စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး test ဖိုင်များကို တိုက်ရိုက်ဖတ်မည်ဖြစ်ကာ MCP မလိုအပ်ပါ။)

## အသုံးပြုရန် Command များ (Trigger)
- "Review the quality of my tests"
- "Are these tests actually testing anything?"
- "Audit my test suite for weak tests"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ Test ဖိုင်များကို ရှာဖွေပါမယ် (`*.test.*`, `*_test.go`, `test_*.py`, `*.spec.*`)။
၂။ Test တစ်ခုချင်းစီကို အောက်ပါ အားနည်းချက် (Smells) များ ရှိမရှိ စစ်ဆေးပါမယ်:
   - **No real assertion**: အမှန်တကယ် စစ်ဆေးရမယ့် အချက် (Assertion) မပါဝင်တာ၊ ဒါမှမဟုတ် `expect(true).toBe(true)` လိုမျိုး ဘာမှအဓိပ္ပါယ်မရှိတာ စစ်ဆေးနေတာ။
   - **Weak assertions**: ရလဒ်တိတိကျကျ သိနိုင်ရက်နဲ့ "မှန်သလား/မှားသလား" လောက်ပဲ စစ်ဆေးနေတာ၊ Array ရဲ့ အရှည်ကိုပဲစစ်ပြီး ပါဝင်တဲ့ data ကို မစစ်တာ။
   - **Disabled / hidden**: ခေတ္တပိတ်ထားတဲ့ `skip`, `only` လိုမျိုး Test တွေ ပါဝင်နေတာ။
   - **Over-mocking**: တကယ်စမ်းသပ်ရမယ့် အရာကြီးကိုပဲ အတု (Mock) လုပ်ထားပြီး စမ်းသပ်နေတာ။
   - **Missing edge cases**: အဆင်ပြေတဲ့ လမ်းကြောင်း (Happy path) ကိုပဲ စမ်းသပ်ထားပြီး၊ Error တက်နိုင်တဲ့ အခြေအနေ (Empty/null/boundary) တွေကို မစမ်းသပ်ထားတာ။
၃။ တွေ့ရှိချက် တစ်ခုချင်းစီအတွက် `file:line`၊ အားနည်းချက် အကြောင်းရင်းနဲ့ ပိုကောင်းတဲ့ စစ်ဆေးမှု (Stronger assertion) ကို အကြံပြုပေးပါမယ်။
၄။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
