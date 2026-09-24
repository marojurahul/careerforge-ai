# CareerForge AI 🚀

**Free AI-powered tools for Business Analysts moving into AI-enabled roles.**

🔗 **Live Platform:** [careerforge-ai-rahul.netlify.app](https://careerforge-ai-rahul.netlify.app)

---

## What Is CareerForge AI?

CareerForge AI is a free platform built specifically for Business Analysts who want to transition into AI-enabled roles. Instead of searching across 10 different tools, everything a BA needs is in one place.

Built by **Rahul Maroju** — AI-Enabled Business Analyst — after personally experiencing the gap in resources for BAs navigating the AI era.

---

## 7 Live AI-Powered Tools

| Tool | Description |
|---|---|
| 🔍 ATS Resume Scanner | Paste your resume and job description — get ATS compatibility score and improvement suggestions |
| 🗺️ AS-IS / TO-BE Process Mapper | Describe any business process — get structured AS-IS analysis, root cause, and TO-BE recommendations |
| 📋 AI Requirements Generator | Describe your AI project — get complete requirements document with performance thresholds and acceptance criteria |
| ✅ AI Governance Checklist | Select industry and risk level — get complete governance checklist covering bias, compliance, and oversight |
| 💬 Prompt Library | Ready-to-use prompts for common BA tasks — requirements, stakeholder communication, process analysis |
| 💰 Salary Calculator | Benchmark your salary expectations for BA and AI roles in India |
| 🎯 Interview Question Generator | Generate behavioral, technical, case study, and AI knowledge questions with STAR answer frameworks |

---

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **AI:** GPT API via OpenAI
- **Serverless Functions:** Netlify Functions (handles CORS and API security)
- **Deployment:** Netlify (auto-deploy from GitHub)
- **Version Control:** GitHub

---

## How It Works


API calls are handled server-side via Netlify Functions to keep API keys secure and avoid CORS issues.

---

## Project Structure

```
careerforge-ai/
├── index.html
├── process-mapper.html
├── requirements-generator.html
├── governance-checklist.html
├── interview-generator.html
├── prompt-library.html
├── salary-calculator.html
├── netlify/
│   └── functions/
│       ├── analyze.js
│       ├── governance.js
│       └── interview.js
└── README.md
```

## Running Locally

1. Clone the repository
```bash
git clone https://github.com/marojurahul/careerforge-ai.git
```

2. Open any HTML file directly in your browser for static tools

3. For AI-powered tools — you need a Netlify account with OPENAI_API_KEY set as environment variable

---

## Contributing

Contributions are welcome. Here are ways you can help:

- 🐛 **Bug reports** — found something broken? Open an issue
- 💡 **Feature suggestions** — have an idea for a new BA tool? Open an issue
- 📝 **Documentation** — help improve guides and tool descriptions
- 🎨 **Design** — suggest UI improvements

Please open an issue before submitting a pull request.

---

## About The Builder

**Rahul Maroju** — AI-Enabled Business Analyst based in Hyderabad

- 4+ years operations experience at Cognizant and Metro Home Needs
- MBA Technology Management — Osmania University — CGPA 8.89
- Built CareerForge AI to help BA professionals navigate the AI transition

📧 rahulmaroju822@gmail.com
🔗 [LinkedIn](https://linkedin.com/in/rahulmaroju)
🌐 [CareerForge AI](https://careerforge-ai-rahul.netlify.app)

---

## License

MIT License — free to use, modify, and distribute with attribution.

---

*Built with intent, not templates.*
