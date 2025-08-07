# BURME AI
# BURME AI - မြန်မာဘာသာစကား AI အကူအညီ

<div align="center">
  <img src="assets/image/logo.png" alt="BURME AI Logo" width="200"/>
  
  [![Deploy to Cloudflare Workers](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Workers-F38020?style=for-the-badge&logo=cloudflare)](https://dash.cloudflare.com)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
  [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=for-the-badge)](https://github.com/yourusername/burme-ai/pulls)
</div>

## 📜 နိဒါန်း

BURME AI သည် မြန်မာဘာသာစကားအတွက် အထူးဒီဇိုင်းပြုလုပ်ထားသော AI အကူအညီစနစ်ဖြစ်ပြီး HyperOS design system ဖြင့် တည်ဆောက်ထားပါသည်။ ဤစနစ်တွင် အောက်ပါ feature များပါဝင်ပါသည်။

- 💬 မြန်မာဘာသာဖြင့် စကားပြောဆိုခြင်း
- ✍️ စာသားများထုတ်လုပ်ခြင်း
- 🎨 AI ဖြင့် ပုံများဖန်တီးခြင်း
- 💻 ကုဒ်ရေးသားခြင်းအကူအညီ
- ⚙️ အဆင့်မြင့် စိတ်ကြိုက်ပြင်ဆင်နိုင်မှုများ

## 🚀 အမြန်စတင်အသုံးပြုနည်း

### လိုအပ်သော အခြေခံပစ္စည်းများ
- Node.js v16.x သို့မဟုတ် အထက်
- npm v8.x သို့မဟုတ် အထက်
- Cloudflare account

```bash
# Repository ကို clone လုပ်ပါ
git clone https://github.com/yourusername/burme-ai.git

# Project folder ထဲသို့ ဝင်ပါ
cd burme-ai

# Dependency များ တပ်ဆင်ပါ
npm install

# Development server စတင်ပါ
npm run dev
```

## 🛠 တည်ဆောက်ခြင်းနှင့် ဖြန့်ချိခြင်း

### Build လုပ်ခြင်း
```bash
npm run build
```

### Cloudflare Workers တွင် ဖြန့်ချိခြင်း
```bash
npm run deploy
```

## 🔄 အလိုအလျောက် ဖြန့်ချိခြင်း

ဤ project ကို 1 နာရီတစ်ကြိမ် အလိုအလျောက် ဖြန့်ချိရန် GitHub Actions ကို အသုံးပြုထားပါသည်။

`.github/workflows/auto-deploy.yml` ဖိုင်တွင် အောက်ပါအတိုင်း သတ်မှတ်ထားပါသည်။

