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
