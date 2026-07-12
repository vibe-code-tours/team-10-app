> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# iac-misconfig-scan အသုံးပြုနည်း

Infrastructure-as-code (IaC) ဖိုင်တွေဖြစ်တဲ့ Dockerfiles, Compose, Terraform နဲ့ GitHub Actions တွေမှာ လုံခြုံရေး အားနည်းချက်တွေ (ဥပမာ root အနေနဲ့ run နေတာ၊ file တွေကို 0777 ပေးထားတာ၊ version အသေမသတ်မှတ်ထားတာ နဲ့ လျှို့ဝှက်ကုဒ်တွေ ပါနေတာ) ရှိမရှိ စစ်ဆေးပေးမယ့် Skill ဖြစ်ပါတယ်။ (Read-only ဖြစ်လို့ ဘာမှပြောင်းလဲမည်မဟုတ်ဘဲ အစီရင်ခံစာသာ ထုတ်ပေးပါမည်)

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး IaC ဖိုင်များကို တိုက်ရိုက်ဖတ်မည်ဖြစ်ကာ MCP မလိုအပ်ပါ။)

## အသုံးပြုရန် Command များ (Trigger)
- "Scan my Dockerfile / Terraform / workflows for misconfigs"
- "Is my infrastructure-as-code secure?"
- "IaC security review"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ IaC ဖိုင်များကို ရှာဖွေပါမယ် (`Dockerfile`, `docker-compose*.yml`, `*.tf`, `.github/workflows/*.yml`)။
၂။ ဖိုင်တစ်ခုချင်းစီကို အောက်ပါအချက်များဖြင့် စစ်ဆေးပြီး `file:line`၊ ပြင်းထန်မှုအဆင့် နှင့် ပြင်ဆင်ရမည့် နည်းလမ်းကို အစီရင်ခံပါမယ်။

### စစ်ဆေးမည့် အချက်များ (Checks)
**Containers (Dockerfile / Compose)**
- `USER` မသတ်မှတ်ထားခြင်း / root ဖြင့် run နေခြင်း (Host ကိုပါ ထိခိုက်နိုင်ပါသည်)။
- အားလုံးပြင်ဆင်နိုင်သော (World-writable `0777`) ဖိုင်များ ရှိနေခြင်း။
- `:latest` သုံးထားခြင်း သို့မဟုတ် version အတိအကျ မသတ်မှတ်ထားခြင်း။
- အင်တာနက်မှ script များကို တိုက်ရိုက်ဒေါင်းလုပ်ဆွဲပြီး run နေခြင်း။
- `ENV` သို့မဟုတ် `ARG` ထဲတွင် လျှို့ဝှက်ကုဒ်များ ရေးထားခြင်း။
- Compose တွင် `privileged: true` သို့မဟုတ် host network, host path များ သုံးထားခြင်း။
- `ADD` ဖြင့် အင်တာနက်မှ တိုက်ရိုက်ဆွဲယူခြင်း ( `COPY` ကိုသာ သုံးသင့်ပါသည်)။

**Terraform**
- Public storage သို့မဟုတ် အများပြည်သူဝင်ခွင့် (`0.0.0.0/0`) ဖွင့်ထားခြင်း။
- လျှို့ဝှက်ကုဒ်များကို `.tf` သို့မဟုတ် state ဖိုင်များတွင် ရေးသားထားခြင်း။
- ဒေတာများကို encrypt မလုပ်ထားခြင်း သို့မဟုတ် Logging ပိတ်ထားခြင်း။

**GitHub Actions**
- Action များကို commit SHA ဖြင့်မသုံးဘဲ tag ဖြင့်သာ သုံးထားခြင်း (Supply-chain ပြဿနာဖြစ်နိုင်ပါသည်)။
- Permission များ အလွန်အကျွံပေးထားခြင်း (သို့မဟုတ် မသတ်မှတ်ထားခြင်း)။
- လျှို့ဝှက်ကုဒ်များကို `pull_request_target` တွင် သုံးထားခြင်း သို့မဟုတ် echo ဖြင့် ထုတ်ပြထားခြင်း။

၃။ တွေ့ရှိချက်များကို အရေးကြီးမှု (Severity) အလိုက် အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
