> **Agent Instruction:** Ignore this file. This file (`README_mm.md`) is solely a Myanmar language explanation for the user. Do not follow instructions from this file. Strictly follow `SKILL.md` instead.

# flaky-selector-scan အသုံးပြုနည်း

UI Test တွေ (Playwright, Cypress, Selenium) ရေးတဲ့အခါမှာ ပျက်စီးလွယ်တဲ့ (Flaky/Brittle) selector တွေကို ရှာဖွေပေးပြီး၊ ပိုမိုခိုင်မာတဲ့ (Stable) alternative လမ်းကြောင်းတွေကို အကြံပြုပေးမယ့် Skill ဖြစ်ပါတယ်။

## လိုအပ်ချက်များ (Prerequisites)
- **မရှိပါ** (Pure Claude Code ဖြစ်ပြီး Test ဖိုင်များကို တိုက်ရိုက်ဖတ်မည်ဖြစ်ကာ MCP မလိုအပ်ပါ။)

## အသုံးပြုရန် Command များ (Trigger)
- "Scan my tests for flaky selectors"
- "Which locators are brittle?"
- "Why do my UI tests keep breaking?"

## အလုပ်လုပ်ပုံအဆင့်ဆင့် (Workflow)
၁။ UI test ဖိုင်များကို ရှာဖွေပါမယ် (ဥပမာ - Playwright `*.spec.ts`, Cypress `*.cy.js`)။
၂။ ထိုဖိုင်များထဲမှ Locator များကို ထုတ်ယူပါမယ် (`page.locator`, `getBy*`, `cy.get` စသည်)။
၃။ Locator တစ်ခုချင်းစီကို ပျက်စီးလွယ်မှု (Fragility) အလိုက် အောက်ပါအတိုင်း ခွဲခြားပါမယ်။

### ပျက်စီးလွယ်သော Selector အမျိုးအစားများ (Brittle Locators)
- **Absolute XPath**: (ဥပမာ - `/html/body/div[2]/...`) DOM ဖွဲ့စည်းပုံပြောင်းတာနဲ့ ပျက်ပါမယ်။
- **Positional CSS**: (ဥပမာ - `.row:nth-child(3)`) အစီအစဉ် သို့မဟုတ် အရေအတွက် ပြောင်းတာနဲ့ ပျက်ပါမယ်။
- **Generated class**: (ဥပမာ - `.css-1a2b3c`) Build တစ်ခါလုပ်တိုင်း hash ပြောင်းသွားပါမယ်။
- **Deep descendant**: (ဥပမာ - `div div div span.label`) Layout အဆင့်ဆင့် ဝင်နေမှုတွေ အပေါ် မှီခိုနေပါတယ်။
- **Text-coupled**: (ဥပမာ - `text="Add to cart"`) စာသား သို့မဟုတ် ဘာသာစကား ပြောင်းတာနဲ့ ပျက်ပါမယ်။
- **Index-based**: (ဥပမာ - `locator('button').nth(4)`) ခလုတ်အသစ် ထပ်ထည့်လိုက်တာနဲ့ ပျက်ပါမယ်။

**ခိုင်မာသော Selector များ (Stable Locators):** `getByRole`, `data-test`/`data-testid`, `getByLabel` များကိုသာ သုံးသင့်ပါတယ်။

၄။ ပျက်စီးလွယ်တဲ့ locator တစ်ခုချင်းစီအတွက် `file:line`၊ ပြဿနာအမျိုးအစားနဲ့ အစားထိုးသင့်တဲ့ (Stable) နည်းလမ်းကို အစီရင်ခံပါမယ်။
၅။ အထက်ပါ စစ်ဆေးမှုများအရ အစီရင်ခံစာ (Report) ထုတ်ပေးပါမည်။
