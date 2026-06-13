# Critical Minerals Intelligence Dashboard - Product Requirements Document (PRD)

## 1. Product Overview
The Critical Minerals Intelligence Dashboard is a highly responsive, modern web application designed for policymakers, analysts, and supply chain managers. It provides live, interactive, and visually stunning data tracking for critical minerals essential to the global energy transition, semiconductors, and defense infrastructure.

## 2. Core Features
- **Live Data Integration:** Data is securely fetched from a normalized, relational Supabase database with strict Row Level Security (RLS) enforcement.
- **Dynamic Filtering:** Users can filter minerals by category (e.g., Battery Metals, Semiconductors) and Risk Score (e.g., Critical, High, Medium, Low).
- **Interactive Risk Heatmap:** A visual summary of global supply chain risks that allows for one-click filtering.
- **Geographic Visualizations:** Market dominance breakdowns showing production, reserves, and refining choke points by country.
- **ESG & Geopolitical Tracking:** Direct surfacing of environmental risks, human rights issues, and historical supply chain events.
- **Premium UI/UX:** 
  - Dark-mode optimized with tailored HSL color palettes and glassmorphism.
  - Fluid micro-animations powered by Framer Motion.
  - Native app feel (sleek scrollbar-free interfaces globally).

## 3. Technology Stack
- **Frontend Framework:** React 19 + Vite
- **Language:** TypeScript
- **Backend / Database:** Supabase (PostgreSQL)
- **Styling:** Tailwind CSS (Utility-first styling with custom base layer and utility configurations)
- **UI Components:** shadcn/ui
- **Animation:** Framer Motion
- **Data Parsing/Validation:** Zod (Strict schema mapping from snake_case DB columns to camelCase frontend props)
- **Testing:** Vitest

## 4. Architecture Updates (Latest)
- **Authentication & Authorization:** 
  - Integrated Supabase Auth utilizing Magic Links and OAuth. 
  - Implemented Feature-Sliced Design pattern (`src/features/auth/`) to isolate Auth Context, UI pages, and Route Guards (`ProtectedRoute` / `GuestRoute`). 
  - Created `public.profiles` table synced securely via Postgres triggers with Supabase `auth.users`, ensuring metadata resilience via `COALESCE` handling.
- **UI Architecture & Layout:** 
  - Transitioned to a dense "Bloomberg Terminal" three-pane architecture.
  - Implemented a strict global `h-screen overflow-hidden` wrapper in `MainLayout.tsx` to completely eliminate global double-scrolling issues, moving `overflow-y-auto` logic strictly into isolated components.
  - Resolved route-transition flash bugs by implementing "Nested Suspense Boundaries," isolating `MainLayout` outside the primary page-level Suspense trigger.
- **Supply Chain Component Refactor:** 
  - Refactored the massive `SupplyChainPage.tsx` into a streamlined orchestrator. 
  - Extracted UI logic into `SupplyChainSidebar`, `SupplyChainMapArea`, and `SupplyChainAnalytics` to enforce separation of concerns and enable robust future iterations.
- **Supabase Migration:** The application has migrated from local static JSON (`minerals.json`) to a live Supabase PostgreSQL backend. Data is fetched using foreign table joins to preserve a normalized structure.
- **UI Polish:** 
  - Fixed an issue where the `RiskHeatmap` was removed from the DOM during data loading. It now uses a seamless loading skeleton.
  - Global CSS scrollbars have been hidden (`-ms-overflow-style: none`, `::-webkit-scrollbar { display: none; }`) to provide a frictionless, native app aesthetic.
- **Feature Deprecation:** Replaced the interactive 3D Supply Chain Globe with a highly performant 2D React Leaflet map using Canvas rendering and marker clustering. This streamlined the application and significantly reduced bundle size.

## 5. Security & Guardrails
- **Dependency Pinning:** All dependencies in `package.json` are strictly pinned without carets (`^`) to mitigate supply chain attacks.
- **Vercel Security Headers:** A `vercel.json` file applies strict HTTP security headers (`X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, `Content-Security-Policy`).
- **Content Security Policy (CSP):** CSP configured to safely permit `self`, Supabase API (`https://*.supabase.co`), external map tiles, and dynamically loaded external user avatars and web fonts, while aggressively blocking inline execution where possible.
- **Supabase RLS:** Database strictly prevents anonymous inserts/updates while allowing public read access. Auth triggers operate under `security definer` context to manage profiles safely.
