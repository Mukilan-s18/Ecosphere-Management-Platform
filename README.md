<div align="center">
  <img src="public/globe.svg" alt="EcoSphere Logo" width="120" />
  <h1>🌍 EcoSphere Management Platform</h1>
  <p>A comprehensive Environmental, Social, and Governance (ESG) platform built for modern organizations.</p>

  <!-- Badges -->
  <p>
    <img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  </p>
</div>

<hr />

## 🌟 Overview

**EcoSphere** is a next-generation ESG Management Platform designed to help organizations monitor sustainability metrics, gamify employee green initiatives, ensure policy compliance, and generate beautiful, investor-ready insights. 

Whether you're tracking carbon footprints, rewarding employees for sustainable commutes, or generating quarterly "Wrapped" sustainability reports, EcoSphere brings your company's environmental impact into one stunning, interactive dashboard.

## ✨ Key Features

- 📊 **Dynamic ESG Dashboard:** Track Scope 1-3 emissions, energy consumption, and long-term environmental KPIs through interactive `Recharts` data visualizations.
- 🎮 **Gamification & Rewards:** Engage employees with an XP-driven leaderboard, eco-badges, and a dynamic reward catalog for participating in green initiatives.
- 🤖 **ESG Oracle AI:** A built-in AI policy assistant ready to answer governance and compliance questions on the fly.
- 🎁 **EcoSphere Wrapped:** Automatically generate a beautifully animated, highly shareable year-in-review PDF summarizing your company's sustainability milestones.
- 🛡️ **Enterprise Governance:** Hardened API routes, Zod server-side validation, and in-memory rate limiting ensure your platform remains secure and resilient.
- 📈 **Investor-Ready Reporting:** Instantly compile raw metrics into standardized GRI and SASB compliance reports.

## 🛠️ Tech Stack

**Frontend Architecture:**
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)

**Backend & Data Services:**
- **Database:** [Supabase](https://supabase.com/) (PostgreSQL)
- **Validation:** [Zod](https://zod.dev/)
- **Security:** Custom API rate limiting & strict CORS configuration

**UI Components:**
- [Radix UI](https://www.radix-ui.com/) / [Shadcn UI](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/) (Icons)
- [Recharts](https://recharts.org/) (Data Visualization)

## 🚀 Getting Started

Follow these instructions to get a local copy of EcoSphere up and running.

### Prerequisites

- Node.js (v18 or higher recommended)
- npm, yarn, pnpm, or bun

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/Ecosphere-Management-Platform.git
   cd Ecosphere-Management-Platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**<br/>
   Create a `.env.local` file in the root of the project and add your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Explore the App:**<br/>
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the platform in action.

## 📁 Project Structure

```
Ecosphere-Management-Platform/
├── app/                  # Next.js App Router (Pages & API routes)
│   ├── anomalies/        # Anomaly Detection module
│   ├── environmental/    # Environmental Metrics module
│   ├── gamification/     # Employee Gamification & Leaderboards
│   ├── governance/       # Policy & Governance module
│   ├── reports/          # Report Generation module
│   ├── social/           # Social Impact module
│   └── wrapped/          # EcoSphere Wrapped module
├── components/           # Reusable UI components (Shadcn, Charts, etc.)
├── lib/                  # Utility functions, Supabase client, Validations
├── public/               # Static assets & vectors
└── scripts/              # CI/CD and testing scripts
```

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
