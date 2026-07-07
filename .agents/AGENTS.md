# Workspace Agent Rules

## Rule Maintenance
- **Do Not Delete Rules**: When adding or updating rules, never delete or drop any existing rules. Always either append new rules to the relevant sections or update existing ones to clarify or expand their behavior.

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
- **Catch Clause Type Safety**: Explicitly type catch parameters as `(err: unknown) => { ... }` or `catch (err: unknown)` rather than leaving them implicit.
- **Template Literals**: Avoid interpolating variables of type `unknown` directly inside template literals. Narrow the type (e.g. using `typeof x === 'string'`) or cast it (`String(x)`) first.
- **Overriding Union Types**: Avoid using type annotations like `Error | unknown` in catch/error parameters; annotate simply as `unknown`.
- **Unnecessary Checks**: Avoid checking variables for `null`/`undefined` (e.g. `x !== null`) if the control flow analysis has already narrowed the type (e.g. inside a truthy `if (x)` check).
- **Async without Await**: Avoid wrapping synchronous code block execution in `async` testing wrappers (e.g. `act(async () => ...)`) if no `await` expression is present inside.

## Security & Static Analysis (Codacy Standards)
- **Object Injection Protection**: Always check `key !== '__proto__' && key !== 'constructor' && key !== 'prototype'` when dynamically mapping or assigning object properties from external or unknown sources. For dictionary lookups with dynamic keys, check ownership via `Object.prototype.hasOwnProperty.call(map, key)` or use a strict local allowlist before performing lookups. To satisfy static analyzers (which flag any dynamic bracket notation as a potential object injection sink), convert dictionary lookups to ES6 `Map` objects using `.get(key)`, and use `Reflect.set(obj, key, value)` for dynamic property assignments.
- **SSRF Protection**: Explicitly validate that URLs start with `http://` or `https://` before passing them to `fetch` or other HTTP clients. If fetch URLs contain dynamic parameters (e.g., model names, dynamic paths), validate them against a strict allowlist of allowed values, and verify the full URL prefix belongs to a trusted domain before execution. Prefer parsing fetch URLs using the `URL` class and explicitly validating `parsed.protocol` and `parsed.hostname` to satisfy static analysis checkers.
- **Code Complexity**: Keep functions and methods under 50 lines. Extract complex inline logic (like HTML generation or large API calls) into isolated helper functions. For complex templates (e.g., HTML/email builders), decompose the template building into dedicated sub-components/helpers (e.g., header, body, footer helpers) to keep each function short and simple. Avoid nested template literals inside HTML string templates (e.g., mapping over arrays inside backticks). Pre-compute the list of HTML elements as a string using safe loop concatenations, and combine them with standard string concatenation `+` to avoid false-positive XSS static analysis warnings.
- **Promise Handling**: Never leave floating promises. Always `await` them, end them with `.catch(console.error)`, or explicitly mark them with the `void` operator.
- **Strict Syntax Invariants**:
  - Avoid non-null assertions (`!`); use explicit truthy checks that throw runtime errors instead.
  - Use Nullish Coalescing (`??`) and Optional Chaining (`?.`) instead of traditional `||` and `&&` fallbacks.
  - Do not return void expressions in arrow function shorthands; wrap them in block braces `{}` (e.g., `setTimeout(() => { fn(); }, 1000)`).
