# Product Requirements Document (PRD)
**Project Name:** Critical Minerals Intelligence Dashboard
**Version:** 1.0 (MVP)

## 1. Executive Summary
The Critical Minerals Intelligence Dashboard is a strategic intelligence platform designed to monitor the global critical minerals landscape. It visualizes highly structured data regarding global reserves, active production, refining dominance, and supply chain vulnerabilities for the top critical minerals (e.g., Lithium, Cobalt, Rare Earth Elements).

## 2. Target Audience
- **Policymakers & Government Officials:** Needing high-level summaries of supply chain vulnerabilities and geographic choke points.
- **Supply Chain Managers:** Tracking ESG risks, substitutability, and risk scoring to diversify sourcing.
- **Market Analysts:** Analyzing production vs. reserves data and historical timelines to predict market shifts.

## 3. Core Objectives
1. **Actionable Intelligence:** Provide immediate visual cues for high-risk supply chains.
2. **Data Integrity:** Ensure strict adherence to predefined data schemas to prevent corruption or visual breakage.
3. **Premium User Experience:** Deliver a high-performance, dark-mode-first, animated interface that feels professional and responsive.

---

## 4. Feature Requirements

### 4.1 Home Dashboard (Overview)
- **Mineral Grid:** A visually appealing grid displaying tracked critical minerals.
- **Risk Heatmap:** A visual summary indicating the overall risk breakdown (e.g., how many minerals are CRITICAL, HIGH, MEDIUM).
- **Filtering:** Ability to filter minerals by category (e.g., Battery Metals, Semiconductors, Industrial, Defense).
- **Mineral Cards:** At-a-glance cards showing the mineral's symbol, name, and a color-coded Risk Badge.

### 4.2 Mineral Detail View (Deep Dive)
- **Header:** Prominent display of the mineral symbol, name, category, and primary risk score.
- **Summary Stats Strip:**
  - Overall Supply Risk (CRITICAL, HIGH, MEDIUM, LOW)
  - Substitutability (How easily can it be replaced?)
  - Recycling Rate (%)
  - ESG Alerts Count (Environmental, Social, and Governance risks)
- **Geographic Visualizations (Charts):**
  - **Reserves:** Pie chart showing where the mineral is globally located in the ground.
  - **Production:** Horizontal bar chart showing which countries actively mine the mineral.
  - **Refining:** Pie chart tracking dominance in processing and refinement.
- **Vulnerability Breakdown (Choke Points):** Detailed list of single points of failure in the supply chain (e.g., "Chinese Refining Dominance"), including the affected countries and severity.
- **Primary Applications:** Breakdown of what industries use the mineral (e.g., "EV Batteries - 74%").

> [!IMPORTANT]  
> Reserves (in the ground) and Production (active mining) must **never** be conflated or merged. They must remain visually distinct on all dashboards.

### 4.3 Global Layout (Hub-and-Spoke Navigation)
- **Persistent Sidebar (The Hub):** A global left-hand sidebar containing navigation tabs (Dashboard, Minerals Index, Map, Alerts, Settings) to prevent users from getting lost in deep data.
- **Global Topbar:** A sticky top navigation containing a universal Search Bar (to filter minerals or future entities), an Export utility, and Watchlist actions.
- **Contextual Navigation (The Spokes):** 
  - A Quick-Switch Dropdown on detail pages (e.g., "Cobalt ▾") to jump between entities.
  - A crisp `← Back to Dashboard` button with an explicitly visible `Esc` keyboard shortcut indicator.

### 4.4 Actionable Data & Interactive Features
- **Clickable KPIs (Home):** The summary statistics strip must act as clickable filters (e.g., clicking "2 Critical Alerts" immediately filters the dashboard grid).
- **Anchor Link Cards (Detail View):** The Summary Stats cards (Supply Risk, ESG Alerts) must act as quick-navigation anchor links, smooth-scrolling the user to the detailed sections below.

---

## 5. Data & Technical Constraints

### 5.1 Tech Stack
- **Framework:** React 19 + Vite
- **Language:** TypeScript (Strict Mode)
- **Styling:** Tailwind CSS (Dark mode default, no inline styles)
- **Animations:** Framer Motion (Must respect `prefers-reduced-motion`)
- **Data Validation:** Zod

### 5.2 The Data Contract
The UI fetches live data from a hosted Supabase PostgreSQL database. All incoming data must pass strict runtime validation using Zod.
- If data fails to parse, it must gracefully fail or be rejected rather than crashing the UI.
- All numbers representing percentages must fall between `0` and `100`.
- All color codes must be valid Hex strings.

> [!CAUTION]  
> While the dashboard fetches from a live database, it operates on demonstration data for MVP purposes. Every page displaying figures must include a visible watermark: *"Data for illustrative purposes only. Sources: USGS, IEA, World Bank."*

---

## 6. Non-Functional Requirements (NFRs)

- **Performance:** Pages must lazy-load. Heavy charting libraries (Recharts) must be tree-shaken and only loaded when navigating to a detail page.
- **Design System:** The application uses a custom design system built over `shadcn/ui`. No custom CSS files are allowed; all styling must use Tailwind utility classes mapping to defined design tokens (e.g., `bg-bg-base`, `text-risk-high`).
- **Visual Tokens & Colors:** Risk levels must follow a strict, unified semantic mapping across the entire application: Critical (Crimson), High (Amber), Medium (Yellow), Low (Green). Chemical symbols must never inherit risk-based colors; they must remain neutral.
- **Accessibility (WCAG 2.1 AA):** 
  - Risk states cannot rely on color alone (must use explicit geometric icons like 🔴/🔺).
  - High contrast for all text (minimum 4.5:1 ratio).
  - All interactive elements must have clear focus rings (`focus-visible:ring-2`) for keyboard navigation.
- **Responsiveness:** The layout must be built mobile-first, targeting smooth scaling across mobile (375px), tablet (768px), and desktop (1440px).
