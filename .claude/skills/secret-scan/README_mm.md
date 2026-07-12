> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# secret-scan အသုံးပြုနည်း

ကုဒ်တွေထဲမှာ လျှို့ဝှက်ကုဒ်တွေ (ဥပမာ - API keys, tokens, private keys, connection strings) မတော်တဆ ပါသွားတာမျိုး ရှိ/မရှိ ကို git history ထဲ မရောက်ခင် ရှာဖွေဖော်ထုတ်ပေးမယ့် Skill ဖြစ်ပါတယ်။ ပေါက်ကြားသွားတဲ့ လျှို့ဝှက်ကုဒ်ကို ဖုံးကွယ် (Mask) ပြီးမှသာ အစီရင်ခံပါမယ်။

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး git repo ရှိတဲ့ မည်သည့်နေရာတွင်မဆို အလုပ်လုပ်ပါတယ်။ MCP မလိုအပ်ပါ။)

## အသုံးပြုရန် Command များ (Trigger)
- "Scan for hardcoded secrets"
- "Any leaked keys in my changes?"
- "Secret scan before I commit"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ ဘယ်အပိုင်းကို စစ်ဆေးမလဲ ရွေးချယ်ပါမယ်:
   - **Pre-commit (Default)**: Git ထဲကို ဝင်ခါနီး အပြောင်းအလဲများ (`git diff` + `git diff --staged`)။
   - **Full tree**: ပရောဂျက်တစ်ခုလုံး (`.git`, `node_modules` စသည်တို့ကို ချန်လှပ်၍)။
၂။ AWS, Google, GitHub, Slack, Stripe, OpenAI, JWT, Database Connection စတဲ့ နာမည်ကြီး Provider တွေရဲ့ လျှို့ဝှက်ကုဒ်ပုံစံတွေ ပါ/မပါ ရှာဖွေပါမယ်။ တွေ့ရှိပါက အပြည့်အစုံမပြဘဲ ရှေ့ဆုံး ၄ လုံးကိုသာ ပြပြီး ကျန်တာကို ဖုံးကွယ်ထားပါမယ်။
၃။ တွေ့ရှိချက် တစ်ခုချင်းစီကို အောက်ပါအတိုင်း ခွဲခြားပါမယ်:
   - **Real secret (အစစ်အမှန်)** → (BLOCKER) ကုဒ်ထဲကနေ ချက်ချင်းဖျက်ပစ်ဖို့၊ အသစ်ပြန်ပြောင်း (Rotate) ဖို့ အကြံပြုပါမယ်။
   - **Placeholder (နမူနာပြထားခြင်း)** → (ဥပမာ - `your-key-here`, `xxxxx`) အန္တရာယ်မရှိဟု သတ်မှတ်ပါမယ်။
   - **Git history ထဲ ရောက်နှင့်ပြီးသားများ** → ကုဒ်ထဲက ဖျက်ရုံနဲ့ မလုံလောက်ဘဲ လျှို့ဝှက်ကုဒ်ကို မဖြစ်မနေ အသစ်ပြောင်းရန် (Rotate) သတိပေးပါမယ်။
၄။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
