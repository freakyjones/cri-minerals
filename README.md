# Critical Minerals Intelligence Dashboard

![React 19](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-6.0.1-646CFF?style=for-the-badge&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.19-38B2AC?style=for-the-badge&logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=for-the-badge&logo=typescript)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=for-the-badge)

**Empowering strategic decision-making through actionable intelligence on the global critical minerals supply chain.**

*(Add a high-quality dashboard screenshot or GIF here)*

---

## 🎯 Who Is This For?

- **Policymakers (National Security & Trade Strategy):** Identify strategic dependencies, formulate resource independence initiatives, and monitor geopolitical chokepoints.
- **Industry Analysts (Market Intelligence & Risk Mitigation):** Access pinpoint data accuracy, trend forecasting, and assess upstream supply chain shocks before they hit the market.

**Quick Use Case:** 
> *Scenario: A sudden export ban is announced in a major producing nation. Use the dashboard to immediately visualize downstream impacts on Cobalt availability and identify alternative sourcing regions.*

---

## ✨ Core Features

*   🌍 **Global Reserves & Production Pulse:** Track the highest-stakes minerals (Lithium, Cobalt, Rare Earth Elements). Data tracks both current reserves and active production rates to prevent conflating ground capacity with output.
*   ⚠️ **Predictive Supply Chain Risk Scoring:** The core analytical engine. Synthesizes geopolitical stability, market concentration, and environmental factors into an actionable vulnerability index/score for rapid triage.
*   📊 **Interactive Threat Mapping:** The visual command center. Maps out global dependencies, trade routes, and production hubs, allowing users to visually spot supply chain bottlenecks.

---

## 🛠 Tech Stack

*   **Core:** React 19, Vite, TypeScript
*   **Styling:** Tailwind CSS (Dark Mode Native), shadcn/ui
*   **State Management:** Zustand (Modular, feature-specific slices)
*   **Data & Backend:** Supabase (Auth & Database)
*   **Data Validation:** Zod (Runtime validation & TS inference)
*   **Animations:** Framer Motion
*   **Testing:** Vitest (Unit/Integration), Playwright (E2E)

---

## 🏗 Architecture & Engineering Rules

> [!WARNING]
> **Strict Adherence Required:** This project utilizes an `.agents/rules/project_rules.md` file. All developers and AI Agents MUST abide by these guardrails. 

This project enforces strict boundaries to maintain scalability.

```text
src/
├── components/   # Generic, reusable, stateless UI (e.g., shadcn)
├── features/     # Domain-specific modules (e.g., minerals, auth)
├── hooks/        # Shared custom hooks
├── lib/          # Utilities and shared configurations
├── pages/        # Thin routing wrappers
├── stores/       # Global Zustand state management
└── types/        # TypeScript interfaces and generated Supabase types
```

### 🚨 Strict Engineering Guardrails

1. **Feature-Based Isolation:** Domain features are bounded contexts. A feature (e.g., `src/features/minerals`) CANNOT import from another feature. Shared logic must be in `src/components` or `src/lib`. No God Objects.
2. **No Inline Styles:** The `style={{}}` prop is strictly forbidden unless styles are dynamically derived from data (e.g., hex codes from DB). All styling MUST use Tailwind CSS.
3. **Data Boundary Validation:** All external data payloads MUST be parsed and validated through Zod schemas before entering the application state.
4. **Thin Pages:** Files inside `src/pages/` contain zero business logic and zero data fetching; they are exclusively for composing feature components for routing.

---

## 🚀 Getting Started

### Prerequisites
*   Node.js >= 18.x
*   npm

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cri-minerals
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Environment Setup:
   Copy `.env.example` to `.env` and fill in your Supabase credentials.
   ```bash
   cp .env.example .env
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite dev server with Hot Module Replacement. |
| `npm run build` | Compiles TypeScript and builds for production. |
| `npm run test` | Runs unit and integration tests using Vitest. |
| `npm run lint` | Lints code using ESLint. |
| `npm run preview` | Previews the production build locally. |

---

## 🧪 Testing Strategy
- **Unit & Integration:** Written in Vitest. Core business logic, Zod schemas, and Zustand stores require test coverage.
- **End-to-End (E2E):** Written in Playwright. Tests must interact with the DOM using resilient `data-testid` attributes rather than brittle CSS classes.
