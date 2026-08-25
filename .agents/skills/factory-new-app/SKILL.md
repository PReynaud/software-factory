---
name: factory-new-app
description: Create a new public Nuxt app from nuxt-app-template with GitHub, Supabase, Vercel, and an OVH CNAME on pierre-reynaud.fr. Use when the user wants to spawn a new app, provision hosting, or run factory-new-app.
---

# factory-new-app

Spawn a new app from `PReynaud/nuxt-app-template`. Conversation may be English or French. Every created file, commit, PR, and UI string is **English**.

## Always start with dry-run

```bash
pnpm new-app -- --dry-run --name "Foo"
```

Show the printed plan. Do not create resources until the user confirms.

Resume and status:

```bash
pnpm new-app -- --status --slug foo
pnpm new-app -- --resume --name Foo
```

State lives in gitignored `.factory-state/{slug}.json` (IDs and URLs only, never secrets).

## Steps (inspect-before-create)

1. **Slug + folder** — `C:\Users\pierr\Documents\Projects\{slug}`.
2. **GitHub (public)**
   - `gh repo create {slug} --template PReynaud/nuxt-app-template --public --clone`
   - Enable secret scanning + push protection.
   - Ruleset on `main`: PRs required, required checks from `.github/workflows/ci.yml`.
3. **Customize** — replace tokens in `.factory/managed-files.json`. If `--no-pwa`, delete the PWA file list and drop `@vite-pwa/nuxt` from `nuxt.config.ts` / `package.json`. Write `.factory-version` from the template tag.
4. `pnpm install` in the app. Install latest stable BMAD + skills, then write `skills-lock.json` / `.factory/toolchain.json`. Run the app CI locally (`lint`, `typecheck`, `test:unit`, `build:vercel`). Stop if it fails. `app/app.config.ts` must import `defineAppConfig` from `#imports` (auto-imports are off; omitting it fails prerender).
5. **Supabase** (human confirm before anything billable)
   - List orgs; user picks one (default `Preynaud` / `cnvbvgdjhlhbgalosugb`).
   - Count **active** projects. Free plan allows 2. If full, offer to pause an existing project. Never enable Pro automatically.
   - `confirm_cost` then `create_project` in `eu-west-3`. Wait until `ACTIVE_HEALTHY`.
   - Fetch URL + publishable key. Write `.env` locally and Vercel env. Never print secrets.
   - Apply `supabase/migrations`, generate types.
   - **Auto-deploy migrations** (template ships `.github/workflows/deploy-migrations.yml`):
     1. Ask the user for the project database password (Dashboard → Project Settings → Database). MCP cannot read it. Never print it, never write it to `.factory-state`.
     2. Build the direct Postgres URI (URL-encode the password):
        `postgresql://postgres:{password}@db.{project_ref}.supabase.co:5432/postgres`
     3. Set the repo secret (stdin, do not echo):
        `gh secret set SUPABASE_DB_URL --repo {owner}/{slug}`
     4. Optionally run `workflow_dispatch` once to confirm a no-op push.
   - Auth URLs: `http://localhost:3000/confirm` and `https://{slug}.pierre-reynaud.fr/confirm`. No preview URLs.
   - Run advisors before marking the step done.
6. **Vercel**
   - Link the GitHub repo. Production branch `main` only. **Disable preview deployments** (one Supabase project; previews would write to prod).
   - `vercel domains add {slug}.pierre-reynaud.fr`
7. **OVH DNS** — CNAME `{slug}` → `cname.vercel-dns.com.` then refresh the zone. Inspect existing records first.
8. `move_agent_to_root` into the new app.

On hard failure: print cleanup links/commands. No automatic destructive rollback.

## Deploy override

`FACTORY_DEPLOY=vercel` (default). `cloudflare` and `coolify` are stubs in v1.
