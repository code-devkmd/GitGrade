# 🛡️ GitGrade - The Elite AI-Powered GitHub Auditor.

GitGrade is a professional-grade tool designed to scan GitHub profiles and generate an instant, high-fidelity talent assessment. By combining the GitHub API with the speed of the Llama 3.1 inference engine, GitGrade provides a comprehensive breakdown of an engineer's impact.

## ✨ Features
 - Deep Scan Analysis: Goes beyond "stars and followers" to evaluate commit velocity and        architectural depth.

 - Recruiter Verdict: AI-generated summary of professional standing and market-readiness level.

 - Growth Roadmap: Prioritized action items (High/Medium/Low) to improve portfolio quality.

## 🚀 Tech Stack
 - Frontend: React.js, Tailwind CSS, Lucide Icons

 - Intelligence: Llama 3.1 (via Groq API)

 - Data Source: GitHub REST API

## 🛠️ Local Setup

### Clone the repository:

```bash
git clone https://github.com/yourusername/gitgrade.git
cd gitgrade
```
### Install dependencies:

```bash
npm install
```
### Environment Configuration:
Create a .env file in the root directory and add your Groq API Key:

```bash
VITE_GROQ_API_KEY=your_api_key_here
```
### Run the development server:

```bash
npm run dev
```

## 🧠 How it Works
 - GitGrade executes a multi-stage audit:

 - Identity Resolution: Fetches profile metadata and top repositories.

 - Metric Aggregation: Analyzes language distribution and repository consistency.

 - Neural Audit: Passes the filtered data to Llama 3.1 for a professional-grade career assessment.

 - Score Generation: Calculates a 0-100 score based on industry benchmarks.

## ⚖️ License
Distributed under the MIT License. See LICENSE for more information.