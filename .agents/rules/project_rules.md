# Agent Rules — Critical Minerals Intelligence Dashboard

> These are non-negotiable engineering guardrails. Any agent implementing this plan MUST follow every rule below. Violating these rules is not permitted, even for speed.

---

## RULE 1 — Architecture Boundaries

### 1.1 Feature Isolation
- Code belonging to the `minerals` feature lives **exclusively** inside `src/features/minerals/`.
- A feature component **MUST NOT** import directly from another feature's folder.
- If two features need to share something, it is extracted into `src/components/` (shared UI) or `src/lib/` (shared utilities). Never import across feature boundaries.

### 1.2 Page Components are Thin
- Files inside `src/pages/` are **routing shells only**. They import feature components and compose them. They contain zero business logic, zero data fetching, and zero styling beyond layout wrappers.

### 1.3 No Barrel File Abuse
- `index.js` files are only used to expose the **public API** of a feature. Internal sub-components are not re-exported unless explicitly needed outside the feature.

---

## RULE 2 — Styling (Tailwind Only)

### 2.1 No Inline Styles
- `style={{}}` props are **strictly forbidden** on any component, with the exception defined below.

### 2.1.1 Exception: Data-Driven Dynamic Values
- Inline styles are permitted **only** for values that are dynamically derived from data at runtime and cannot be expressed as Tailwind utility classes (e.g., mineral hex colors from the schema, percentage-based widths for progress bars).
- Each usage **must** include a comment explaining why an inline style is necessary (e.g., `// Dynamic color from data — Rule 2.1.1 exception`).
- All styling MUST use Tailwind utility classes except for these documented exceptions.

### 2.2 No Hardcoded Values
- No hardcoded hex colors, pixel values, or font sizes anywhere in JSX or CSS.
- All values MUST come from `tailwind.config.js` tokens (e.g., `text-risk-high`, `bg-bg-surface`, `shadow-glass`).
- If a needed value doesn't exist in the config, **add it to `tailwind.config.js` first**, then use it.

### 2.3 No External CSS Files for Components
- Components do **not** have their own `.css` or `.module.css` files.
- The only CSS file in the project is `src/index.css` which contains only three lines: `@tailwind base; @tailwind components; @tailwind utilities;`

### 2.4 Responsive by Default
- Every component must be built mobile-first. Use Tailwind responsive prefixes (`sm:`, `md:`, `lg:`) proactively.
- Test breakpoints: `375px` (mobile), `768px` (tablet), `1440px` (desktop).

### 2.5 Dark Mode is the Default
- The dashboard is a dark-mode-only application. Light mode is **not in scope**.
- Background color of the root is always `bg-bg-base` (`#080d1a`). Never use `bg-white` or `bg-gray-*` without a `dark:` prefix.

---

## RULE 3 — Data & Schema

### 3.1 Never Break the Data Contract
- The Supabase database schema is the contract between the data layer and the UI. Every mineral entry fetched MUST contain all required fields as validated by the Zod schema.
- If adding a new field, add it to **all 10 mineral entries simultaneously**. Never add a field to only one entry.
- **NEW:** All data MUST be validated at runtime using Zod schemas before entering the application state.

### 3.2 Reserves and Production are Always Separate
- `reserves` (what's in the ground) and `production` (what's actively mined) are **always rendered as separate, distinct visualizations**. They must never be merged or conflated in the UI.

### 3.3 No Data Logic in Components
- Components display data. They do not transform, filter, sort, or aggregate it.
- All data transformation lives in `src/features/minerals/hooks/useMineral.js` or in a utility file inside the feature.

### 3.4 Data Sourcing Watermark
- Because the MVP uses demonstration data, **every page** that displays figures (charts, percentages, country shares) must include a small, non-intrusive watermark or footer note: `"Data for illustrative purposes only. Sources: USGS, IEA, World Bank."`

---

## RULE 4 — Animations (Framer Motion)

### 4.1 No CSS Transition or Keyframe Animations
- `transition:`, `animation:`, and `@keyframes` are **not used** in this project.
- All motion is handled exclusively via **Framer Motion** (`motion.*` components, `variants`, `AnimatePresence`).

### 4.2 All Routes Wrapped in AnimatePresence
- Every page transition uses `AnimatePresence` to ensure exit animations fire correctly before a new page mounts.

### 4.3 Animation Variants are Defined Outside JSX
- Animation `variants` objects are declared as `const` variables **outside** the component function body. They are never defined inline inside JSX to avoid unnecessary re-renders.
- Example: `const cardVariants = { hidden: {...}, show: {...} }` sits at the module level, not inside `<MineralCard>`.

### 4.4 Respect `prefers-reduced-motion`
- All Framer Motion animations must respect the user's system setting via `useReducedMotion()`. If reduced motion is preferred, animations are reduced to simple `opacity` fades only.

---

## RULE 5 — Components

### 5.1 Every Component Has a Single Responsibility
- A component does one thing. `MineralCard` renders a card. `ReservesChart` renders the reserves chart. If a component is doing two distinct things, split it.

### 5.2 Use shadcn/ui for Primitives, Not Custom Builds
- Never build a custom `Tooltip`, `Badge`, `Tabs`, or `Dialog` from scratch.
- Always check if `shadcn/ui` has the primitive first. Install it (`npx shadcn-ui add <component>`) and then restyle it with Tailwind tokens.

### 5.3 Props Must Be Typed (PropTypes or JSDoc)
- Every component documents its props with either `PropTypes` or a JSDoc `@param` comment.
- A component with undocumented props will be flagged as incomplete.

### 5.4 Loading Skeleton Required
- Any component that renders data from the Supabase backend MUST have a corresponding skeleton/loading state.
- Skeletons use Framer Motion opacity pulse, not CSS animations.
- Blank screens on load are not acceptable.

---

## RULE 6 — Naming Conventions

| Thing | Convention | Example |
|---|---|---|
| React components | `PascalCase` | `MineralCard`, `ChokePointCard` |
| Hooks | `camelCase` prefixed with `use` | `useMineral`, `useRiskScore` |
| Utility functions | `camelCase` | `getTopProducers`, `formatShare` |
| JSON data files | `camelCase` | `minerals.json` |
| Route slugs | `kebab-case` | `/mineral/rare-earth-elements` |
| Tailwind config keys | `kebab-case` | `bg-bg-base`, `text-risk-high` |
| Framer Motion variants | `camelCase` const at module level | `cardVariants`, `pageVariants` |

---

## RULE 7 — Routing

### 7.1 URL Structure is Sacred
- Routes are defined in the implementation plan and must not change without a plan update. The URL structure is:
  - `/` → Home (mineral grid)
  - `/mineral/:slug` → Mineral detail page
- New routes must be added to `App.jsx` and documented in the plan.

### 7.2 Navigate Only via `Link` or `useNavigate`
- `window.location.href` and `window.location.replace` are **forbidden**.
- All navigation uses React Router's `<Link>` or `useNavigate()` hook.

---

## RULE 8 — Performance & Testing

### 8.1 Lazy Load All Pages
- `HomePage` and `MineralPage` are lazy-loaded using `React.lazy()` and `<Suspense>`. The browser does not load the detail page code until the user actually navigates to it.

### 8.2 No Unnecessary Re-renders
- Framer Motion variant objects and data transformation functions that are expensive are memoized with `useMemo` or `useCallback` where appropriate.
- Never define object or array literals directly inside JSX props that are passed to child components.

### 8.3 Chart and Map Libraries are Not Imported Globally
- `recharts` and `react-leaflet` components are imported only inside the components that use them, enabling Vite's tree-shaking to eliminate unused chart types from the bundle.

### 8.4 Automated Testing Required
- All critical data parsing, validation, and utility functions MUST have accompanying unit tests using Vitest.

---

## RULE 9 — Code Quality

### 9.1 No `console.log` in Committed Code
- `console.log`, `console.warn`, and `console.error` are not permitted in committed code. Use them during development, remove them before any checkpoint.

### 9.2 Every File Has One Default Export
- Each component file exports exactly one default component. Named exports are used only for utilities and hooks.

### 9.3 Build Must Pass Clean
- `npm run build` must complete with **zero errors** and **zero warnings** before any feature is considered done. ESLint warnings are treated as errors.

---

## RULE 10 — Agent Behavior

### 10.1 Never Start Building Without a Confirmed Plan
- An agent may not write source code until the implementation plan for that feature has been reviewed and approved.

### 10.2 Update `task.md` Continuously
- As work progresses, `task.md` is updated in real time. Items are marked `[/]` (in progress) when started and `[x]` (done) when complete. The task list must never be stale.

### 10.3 One Feature at a Time
- Work is completed one feature at a time, in the order defined in the plan. An agent does not skip ahead or work on Phase 2 items while Phase 1 items are incomplete.

### 10.4 Verify Before Reporting Done
- An agent reports a task as complete only after:
  1. `npm run build` passes cleanly.
  2. Test suite passes (`npm run test`).
  3. The component renders correctly in the browser (no blank screen, no console errors).
  4. The feature matches the requirements defined in the implementation plan.

---

## RULE 11 — TypeScript

### 11.1 Strict Mode Always
- `tsconfig.json` must always have `"strict": true`.
- Using `any` is strictly forbidden. If a type is unknown, use `unknown` and type-guard it.

### 11.2 Single Source of Truth for Models
- Do not manually write interfaces for data models if a Zod schema exists.
- Always use `z.infer<typeof schemaName>` to generate TypeScript types from the Zod validation layer.

### 11.3 Component Props
- All React components must type their props using an interface or type alias.
- `PropTypes` or basic JSDoc are no longer sufficient; use strict TS types.

---

## RULE 12 — PRD Compliance

### 12.1 Source of Truth
- The product requirements documented in `.agents/prd.md` are the single source of truth for the project's scope, features, and constraints.
- Before writing any new implementation plans or source code, an agent MUST cross-reference `.agents/prd.md` to ensure alignment.

### 12.2 Strict Scope Management
- Agents are explicitly forbidden from adding new pages, charts, or features that contradict the defined scope in the PRD, unless a scope-change is formally requested by the user.

### 12.3 Automated Documentation Updates
- Whenever a database migration is created or a new feature is successfully implemented and tested, the agent **MUST** automatically update `.agents/prd.md` and `.agents/rules/project_rules.md` to reflect the new architecture, data contracts, and capabilities BEFORE declaring the task complete.
- The user should **never** have to ask the agent to update the PRD or rules. It is an automated part of the Definition of Done.
