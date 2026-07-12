> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# error-handling-audit အသုံးပြုနည်း

ပရောဂျက်တစ်ခုလုံး (သို့မဟုတ် အပြောင်းအလဲများ) အတွင်းမှာ Error တွေကို သေချာမကိုင်တွယ်ဘဲ အလွတ်ထားခဲ့တာတွေ (swallowed exceptions)၊ Network timeout တွေ မရေးထားတာတွေနဲ့ Error ကို Log မှတ်ရုံသာမှတ်ပြီး အသိမပေးတာတွေကို ရှာဖွေဖော်ထုတ်ပေးမယ့် Skill ဖြစ်ပါတယ်။

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး မည်သည့် repo တွင်မဆို အလုပ်လုပ်ပါတယ်။ MCP မလိုအပ်ပါ။)

## အသုံးပြုရန် Command များ (Trigger)
- "Audit error handling in this repo"
- "Where are we swallowing errors?"
- "Check exception handling on my changes"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ပရောဂျက်တစ်ခုလုံး၊ ဖိုင်တွဲ (Directory) သို့မဟုတ် `git diff` (အပြောင်းအလဲရှိလျှင်) အပေါ်မှာ အခြေခံပြီး စစ်ဆေးပါမယ်။
၂။ အောက်ပါ အမှားကိုင်တွယ်မှု အားနည်းချက် (Anti-patterns) များကို ရှာဖွေပါမယ်:

### ရှာဖွေမည့် အားနည်းချက်များ
**လစ်လျူရှုထားသော Error များ (Swallowed / empty handlers)**
- `except: pass`, `catch (e) {}` ကဲ့သို့ Error ကို ဘာမှမလုပ်ဘဲ ကျော်သွားခြင်း။
- Log မမှတ်၊ Re-throw မလုပ်၊ Recovery မလုပ်ဘဲ `/* ignore */` လုပ်ထားခြင်း။

**ကျယ်ပြန့်လွန်းသော Catches များ (Over-broad catches)**
- App crash သင့်သည့် အခြေအနေများကိုပါ ဖုံးကွယ်ထားသော `except Exception` / `catch (Throwable)` များ။
- Error တက်ပါက Default တန်ဖိုးပြန်ပေးပြီး ပြဿနာကို ဖုံးကွယ်ထားခြင်း။

**Async / Promise ပြဿနာများ**
- `async` function ကို `await` သို့မဟုတ် `.catch()` မပါဘဲ ခေါ်ထားခြင်း (Floating promises)။
- `Promise.all` တွင် တစ်ခု fail ဖြစ်ပါက ကျန်တာတွေပါ အသံတိတ် fail ဖြစ်သွားနိုင်ခြင်း။
- Top-level `unhandledRejection` မရေးထားခြင်း။

**Network / IO ပြဿနာများ**
- `fetch` သို့မဟုတ် HTTP client များကို timeout မပါဘဲ အသုံးပြုခြင်း။
- ပြင်ပ API များ ခေါ်ရာတွင် fail ဖြစ်ပါက ပြန်ကြိုးစားရန် (retry/backoff) မရေးထားခြင်း။
- ဖိုင် သို့မဟုတ် Socket များကို `finally` ဖြင့် သေချာပြန်မပိတ်ခြင်း။

**စောင့်ကြည့်လေ့လာနိုင်မှု (Observability)**
- Error ကို Log သာမှတ်ပြီး User ကို Success (200) ပြန်ပေးနေခြင်း။
- `logger.error(e)` ဟုသာ ရေးပြီး ဘယ်နေရာကနေမှန်း သိနိုင်မည့် Context/Stack မပါဝင်ခြင်း။

၃။ တွေ့ရှိချက် တစ်ခုချင်းစီအတွက် `file:line`၊ ဖြစ်ပေါ်လာနိုင်တဲ့ အန္တရာယ် (ဘာတွေဖုံးကွယ်သွားမလဲ) နဲ့ ပြင်ဆင်ရမည့်နည်းလမ်းကို အစီရင်ခံပါမယ်။
၄။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
