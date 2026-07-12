> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# api-security-scan အသုံးပြုနည်း

REST/HTTP API တွေရဲ့ လုံခြုံရေး အားနည်းချက်တွေကို မဖြန့်ချိခင် ကြိုတင်ရှာဖွေပေးမယ့် Skill ဖြစ်ပါတယ်။
(ဤ Skill သည် ကုဒ်ကို ဖတ်ပြီး `file:line` ဖြင့် အမှားများကိုသာ ထောက်ပြပေးမည်ဖြစ်ကာ ကုဒ်များကို ပြင်ဆင်မည်မဟုတ်ပါ။)

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး OpenAPI/Swagger spec သို့မဟုတ် route/handler ကုဒ်များကို တိုက်ရိုက်ဖတ်ပါမည်၊ MCP မလိုအပ်ပါ။)

## အသုံးပြုရန် Command များ (Trigger)
- "Security review my API / OpenAPI spec"
- "Check my endpoints for missing auth"
- "API security scan"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ API များကို ရှာဖွေပါမယ် (OpenAPI/Swagger ဖိုင် ရှိလျှင် အသုံးပြုမည်၊ မရှိလျှင် route များနှင့် handler များကို ဖတ်ပါမည်)။
၂။ Endpoint တစ်ခုချင်းစီကို အောက်ပါအချက်များဖြင့် စစ်ဆေးပြီး `path` သို့မဟုတ် `file:line`၊ ပြင်းထန်မှုအဆင့် နှင့် ပြင်ဆင်ရမည့် အချက်များကို မှတ်တမ်းတင်ပေးပါမယ်။

### စစ်ဆေးမည့် အချက်များ (What to flag)
- **Missing authentication**: Auth မလိုဘဲ အချက်အလက်များ သို့မဟုတ် action များကို အသုံးပြုခွင့်ပေးထားသော Endpoint များ။
- **Broken object-level auth (IDOR/BOLA)**: ID ဖြင့် ခေါ်ယူရာတွင် ပိုင်ဆိုင်မှု သို့မဟုတ် အသုံးပြုခွင့် ရှိမရှိ (ownership/authorization) မစစ်ဆေးထားခြင်း။
- **Missing function-level auth**: သာမန် user များက Admin (သို့) အထူးလုပ်ပိုင်ခွင့်ရှိသူများ၏ လုပ်ဆောင်ချက်များကို ရယူအသုံးပြုနိုင်ခြင်း။
- **No rate limiting**: Auth, search သို့မဟုတ် လုပ်ဆောင်ရခက်ခဲသော endpoint များတွင် အသုံးပြုမှုကန့်သတ်ချက် မထားခြင်း (brute-force / DoS ဖြစ်နိုင်ချေရှိခြင်း)။
- **Verbose errors**: Client များထံသို့ Stack traces, SQL သို့မဟုတ် internal details များကို ပြန်လည်ပေးပို့နေခြင်း။
- **Sensitive data in URLs**: Query string များထဲတွင် Tokens, passwords သို့မဟုတ် PII များ ပါဝင်နေခြင်း။
- **Mass assignment**: လိုအပ်သော အကွက်များ (allowlist) ကန့်သတ်မထားဘဲ request body များကို model များထဲသို့ တိုက်ရိုက် ပေါင်းထည့်ထားခြင်း။
- **CORS misconfig**: Wildcard origin (`*`) ကို credentials များနှင့် ပေါင်းစပ်အသုံးပြုထားခြင်း။
- **Missing input validation**: Body/query/path parameter များကို schema သို့မဟုတ် type စစ်ဆေးခြင်း မရှိဘဲ လက်ခံထားခြင်း။
- **No pagination limits**: List ပြပေးသော endpoint များတွင် အချက်အလက် အရေအတွက် ကန့်သတ်ချက် (pagination) မပါဝင်ခြင်း။
- **Secrets in examples**: Spec ဥပမာများ သို့မဟုတ် sample request များတွင် တကယ့် key များနှင့် token များကို ထည့်သွင်းထားခြင်း။

၃။ ပြင်းထန်မှုအလိုက် စီစဉ်ထားသော Report ကို ထုတ်ပေးပါမည်။
(Report Format Example များကို မူရင်း SKILL.md တွင် ကြည့်ရှုနိုင်ပါသည်။)
