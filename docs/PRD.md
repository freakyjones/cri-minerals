# Critical Minerals Intelligence Dashboard - Product Requirements Document (PRD)

## 1. Product Overview
The Critical Minerals Intelligence Dashboard is a highly responsive, modern web application designed for policymakers, analysts, and supply chain managers. It provides live, interactive, and visually stunning data tracking for critical minerals essential to the global energy transition, semiconductors, and defense infrastructure.

## 2. Core Features
- **Live Data Integration:** Data is securely fetched from a normalized, relational Supabase database with strict Row Level Security (RLS) enforcement.
- **Dynamic Filtering:** Users can filter minerals by category (e.g., Battery Metals, Semiconductors) and Risk Score (e.g., Critical, High, Medium, Low).
- **Interactive Risk Heatmap:** A visual summary of global supply chain risks that allows for one-click filtering.
- **Geographic Visualizations:** Market dominance breakdowns showing production, reserves, and refining choke points by country.
- **ESG & Geopolitical Tracking:** Direct surfacing of environmental risks, human rights issues, and historical supply chain events.
- **Compliance Tracking:** FEOC (Foreign Entity of Concern) and FTA (Free Trade Agreement) tracking at the country and entity level.
- **Export Functionality:** Analysts can export detailed mineral reports as branded PDFs, Markdown documents, and CSV spreadsheets.
- **AI-Driven Market Alerts:** Integration with Gemma LLM via Supabase Edge Functions to monitor news and generate geopolitical risk alerts.
- **Premium UI/UX:** 
  - Dark-mode optimized with tailored HSL color palettes and glassmorphism.
  - Fluid micro-animations powered by Framer Motion.
  - Native app feel (sleek scrollbar-free interfaces globally).

## 3. Technology Stack
- **Frontend Framework:** React 19 + Vite
- **Language:** TypeScript
- **Backend / Database:** Supabase (PostgreSQL) + Edge Functions (Deno)
- **AI/LLM:** Gemini API (Gemma-4-31b)
- **Mapping:** React-Leaflet & Turf.js
- **Styling:** Tailwind CSS (Utility-first styling with custom base layer and utility configurations)
- **UI Components:** shadcn/ui
- **Animation:** Framer Motion
- **Data Parsing/Validation:** Zod (Strict schema mapping from snake_case DB columns to camelCase frontend props)
- **Testing:** Vitest & Playwright

## 4. Architecture Updates (Latest)
- **AI-Driven Smart Simulator (Upcoming):** Hooking the AI-generated alerts directly into the Supply Chain Map using `turf.js` to calculate spatial "blast radius" intersections and instantly disrupt supply chains on the UI.
- **Expert Export Upgrades:** Upgraded the export tools using `jspdf` and `jspdf-autotable` to include fully branded PDFs (incorporating "Uses" and "Reserves" tables) and CSV data dumps for analysts, with full ARIA accessibility and keyboard navigation.
- **Authentication, Authorization & RBAC:** 
  - Integrated Supabase Auth utilizing Email/Password and OAuth (deprecated Magic Links).
  - Implemented comprehensive Role-Based Access Control (RBAC) supporting `admin` and `user` tiers via PostgreSQL enums (`user_role`).
  - Roles are fully protected against privilege escalation by database triggers (`ensure_profile_role_unchanged`) and synced into JWTs (`auth.users.raw_app_meta_data`) using synchronous Postgres triggers (`on_profile_role_change`) for instantaneous zero-latency frontend checks.
  - Implemented strict route guards (`ProtectedRoute` / `GuestRoute`). The entire application strictly requires authentication, while specific interfaces (e.g. Analyst Dashboard / Analytics Queue) are hidden from standard users and accessible exclusively to administrators.
- **UI Architecture & Layout:** 
  - Transitioned to a dense "Bloomberg Terminal" three-pane architecture.
  - Implemented a strict global `h-screen overflow-hidden` wrapper in `MainLayout.tsx` to completely eliminate global double-scrolling issues, moving `overflow-y-auto` logic strictly into isolated components.
  - Resolved route-transition flash bugs by implementing "Nested Suspense Boundaries," isolating `MainLayout` outside the primary page-level Suspense trigger.
- **Supply Chain Component Refactor:** 
  - Refactored the massive `SupplyChainPage.tsx` into a streamlined orchestrator. 
  - Extracted UI logic into `SupplyChainSidebar`, `SupplyChainMapArea`, and `SupplyChainAnalytics` to enforce separation of concerns and enable robust future iterations.
- **Supabase Migration:** The application has migrated from local static JSON (`minerals.json`) to a live Supabase PostgreSQL backend. Data is fetched using foreign table joins to preserve a normalized structure.

## 5. Security & Guardrails
- **Dependency Pinning:** All dependencies in `package.json` are strictly pinned without carets (`^`) to mitigate supply chain attacks.
- **Vercel Security Headers:** A `vercel.json` file applies strict HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`).
- **Content Security Policy (CSP):** CSP configured to safely permit `self`, Supabase API (`https://*.supabase.co`), external map tiles, and dynamically loaded external user avatars and web fonts, while aggressively blocking inline execution where possible.
- **Supabase Row Level Security (RLS) & Triggers:** 
  - Read access to standard app data tables remains public, but the application restricts access dynamically via route protection. Write/Delete actions (e.g. `market_alerts`) are completely locked down by Row-Level Security checks validating the user's role directly against `public.profiles`.
  - Database strictly guards against user-tampering. Privilege escalation is blocked inherently by robust database triggers tracking `NEW` and `OLD` values. Triggers operate under `SECURITY DEFINER` context.
