# Tally

- Vite + React 19 + TypeScript single-page app with no server. The browser talks to Supabase
  directly through supabase-js; the client lives in `src/lib/supabase.ts`.
- The whole backend is one `todos` table in `supabase/migrations/`. Schema changes go in a new
  migration file, never in the dashboard only.
- Styling is plain CSS in `src/index.css`, with the tokens from DESIGN.md as custom properties.
  No UI library.
- Checks: `npm run build` (type-checks, then builds `dist/`) and `npm run lint`.
