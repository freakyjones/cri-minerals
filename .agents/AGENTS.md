# Workspace Agent Rules

## Data Handling & Mapping
- Always prefer standardized identifiers (e.g., ISO-3 codes for countries, UUIDs for entities) over raw string names when mapping data between different sources (like a database and a GeoJSON file) to prevent silent failures.

## UI Transparency
- Any data presented in the UI that is simulated, randomly generated, or mocked must be explicitly labeled (e.g., with a "SIMULATED" badge) to ensure users are not misled about data integrity.

## Supabase Edge Functions & Deployments
- **Always Deploy After Editing**: When modifying Supabase Edge Functions locally (in `supabase/functions/`), you MUST immediately run `npx supabase functions deploy <function-name>` if the frontend is communicating with the remote Supabase Cloud project. Local file changes do not auto-sync to the cloud.

## State Management & Realtime
- **Prefer Polling for Transient State**: Do NOT use Supabase Realtime WebSockets to track short-lived, transient backend status updates (e.g., rapid queue transitions like PENDING -> COMPLETED). WebSockets drop events due to connection establishment races and RLS token propagation latency. Always use **React Query Polling** (`refetchInterval`) for robust state synchronization in these scenarios.

## LLM Data & Postgres Type Safety
- **Strict Integer Enforcement**: When inserting LLM-generated numerical scores (e.g., confidence scores, multipliers) into strict Postgres integer columns, do not trust the raw LLM output. Always explicitly parse, scale (if returned as a decimal), and use `Math.round()` before executing the DB insert to prevent strict type mismatch crashes (e.g., `invalid input syntax for type integer: "0.95"`).

## ESLint and Type Safety
- Strictly forbidden to use `eslint-disable` or `@ts-expect-error` comments to bypass type checking or linting rules. 
- Fix the underlying type errors using proper TypeScript (e.g., using `unknown`, specific interfaces, type narrowing, or generics) instead of resorting to `any` or suppressing the warnings.
- Do not leave empty catch blocks without handling or logging; do not suppress empty block warnings artificially.

## Security & Static Analysis (Codacy Standards)
- **Object Injection Protection**: Always check `key !== '__proto__' && key !== 'constructor' && key !== 'prototype'` when dynamically mapping or assigning object properties from external or unknown sources.
- **SSRF Protection**: Explicitly validate that URLs start with `http://` or `https://` before passing them to `fetch` or other HTTP clients.
- **Code Complexity**: Keep functions and methods under 50 lines. Extract complex inline logic (like HTML generation or large API calls) into isolated helper functions.
- **Promise Handling**: Never leave floating promises. Always `await` them, end them with `.catch(console.error)`, or explicitly mark them with the `void` operator.
- **Strict Syntax Invariants**:
  - Avoid non-null assertions (`!`); use explicit truthy checks that throw runtime errors instead.
  - Use Nullish Coalescing (`??`) and Optional Chaining (`?.`) instead of traditional `||` and `&&` fallbacks.
  - Do not return void expressions in arrow function shorthands; wrap them in block braces `{}` (e.g., `setTimeout(() => { fn(); }, 1000)`).
