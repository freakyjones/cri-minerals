# Critical Minerals Intelligence Dashboard

A strategic intelligence platform designed for policymakers, supply chain managers, and analysts to monitor the global critical minerals landscape. This dashboard provides data on global reserves, production, refining dominance, and supply chain choke points for the top critical minerals.

## Features

- **Top 10 Minerals Tracking:** Deep dives into Lithium, Cobalt, Rare Earth Elements, and more.
- **Supply Chain Risk Scoring:** Visual badges mapping single points of failure.
- **Geographic Visualizations:** Data charts highlighting country-by-country reserves vs. production.
- **Data Guardrails:** Strict runtime validation using Zod to prevent data corruption.
- **Role-Based Access Control:** Dual-tier user access (Admin vs Standard) natively integrated into Supabase Auth and synced via Postgres database triggers.
- **Premium UI:** Built with Tailwind CSS, Framer Motion, and shadcn/ui for a highly responsive, modern dark-mode experience.

## Tech Stack

- **Framework:** React 19 + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Components:** shadcn/ui
- **Animations:** Framer Motion
- **Data Validation:** Zod
- **Testing:** Vitest + React Testing Library

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/freakyjones/cri-minerals.git
   cd cri-minerals
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```
   The dashboard will be available at `http://localhost:5173`.

## Testing & Building

To run the Vitest test suite:
```bash
npm run test
```

To build for production (runs TypeScript type-checks first):
```bash
npm run build
```

## AI Agent Guardrails
This project includes an `.agents/rules/project_rules.md` file. Any AI coding assistant opening this repository will automatically read these rules to ensure all future code follows strict styling, architecture, and typing standards.
