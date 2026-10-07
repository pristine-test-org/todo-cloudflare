# Tally

One short list for the things that need doing today. Add an item, tick it off, remove it.
Tally is a static React app with a Supabase table behind it; there is no sign-in, everyone who
opens the site sees and edits the same list.

Live site: _not deployed yet_ (add the URL here after the first deploy)

## Tech stack

- **Vite + React 19 + TypeScript**, plain CSS. The build is a static `dist/` folder.
- **Supabase** for storage: one `todos` table (`id`, `title`, `done`, `created_at`), read and
  written from the browser with `@supabase/supabase-js` and the public anon key.
- **Cloudflare Pages** hosts `dist/`, built from GitHub, with a preview URL for every pull request.

## Supabase

The app uses the team's existing Supabase project:

- Project URL: `https://hszqtfynyogshhltamep.supabase.co` (ref `hszqtfynyogshhltamep`)
- Anon key: not in this repo. Copy it from the Supabase dashboard → the project →
  **Project Settings → API** (on newer dashboards **API Keys → Legacy API keys → anon public**).
  It is safe to ship to the browser; row level security decides what it can do.

The `todos` table already exists on that project, so there is nothing to apply. If the project
shows as paused (the free tier pauses idle projects), open it in the Supabase dashboard and press
**Restore project**.

For a fresh Supabase project, create the table from
`supabase/migrations/20261007120000_todos.sql`: paste it into **SQL Editor** and run it, or from
this folder run:

```bash
npx supabase login
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

The migration turns on row level security with policies that let the `anon` role select,
insert, update and delete every row. That is deliberate for a shared demo list; tighten it before
storing anything private.

## Local setup

```bash
npm install
cp .env.example .env.local   # then paste the anon key
npm run dev                  # http://localhost:5173
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Vite dev server |
| `npm run build` | Type-checks and builds `dist/` |
| `npm run preview` | Serves the built `dist/` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc -b` only |

## Environment variables

| Name | Value |
| --- | --- |
| `VITE_SUPABASE_URL` | `https://hszqtfynyogshhltamep.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | the project's anon key (see above) |

Vite bakes both into the bundle at build time, so set them on the host **before** the first build
and redeploy after changing them. Without them the app still loads and says what is missing.

## Deploy (Cloudflare Pages)

Cloudflare builds the app from GitHub on every push, and every pull request gets its own preview
URL.

1. Copy the anon key (see **Supabase** above). The table is already there.
2. In the Cloudflare dashboard: **Workers & Pages → Create → Pages → Connect to Git**, authorize
   GitHub if asked, and pick this repository.
3. Build settings:
   - Production branch: `main`
   - Framework preset: `React (Vite)` (or `None`)
   - Build command: `npm run build`
   - Build output directory: `dist`
4. Under **Environment variables (advanced)** add `VITE_SUPABASE_URL` and
   `VITE_SUPABASE_ANON_KEY` with the values above. After the project exists, check
   **Settings → Variables and Secrets** has both in **Production** and **Preview**, or preview
   builds will show the "can't reach its database" message.
5. **Save and Deploy.** The site lands on `todo-cloudflare.pages.dev` (or a similar name if that
   one is taken). Put it in the **Live site** line at the top of this README.

Pages serves `index.html` for unknown paths on its own, so the app needs no redirect file.

`wrangler.jsonc` describes the same site as a Workers static-assets project
(`assets.directory: ./dist`, single-page-app fallback). Pages builds ignore it, because it has no
`pages_build_output_dir`; it is there for `npx wrangler dev` / `npx wrangler deploy`, or for
**Workers & Pages → Create → Import a repository** if you would rather run it as a Worker.

## Project structure

```
src/
  App.tsx            The list: load, add, toggle, remove; loading, empty and error states
  lib/supabase.ts    supabase-js client and the Todo type
  index.css          Styles; tokens match DESIGN.md
supabase/
  migrations/        The todos table and its row level security policies
wrangler.jsonc      Static-assets settings for Wrangler (Pages uses the dashboard build settings)
```
