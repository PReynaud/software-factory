# Deployment

Default host is **Vercel**. DNS stays on **OVH** (`pierre-reynaud.fr`). Every adapter still needs an OVH CNAME (except a future Coolify wildcard).

## Vercel (implemented)

See [deploy/vercel/README.md](../deploy/vercel/README.md).

Bootstrap: GitHub public repo → Vercel project on `main` only → `vercel domains add {slug}.pierre-reynaud.fr` → OVH CNAME `{slug}` → `cname.vercel-dns.com`.

Schema: template workflow `.github/workflows/deploy-migrations.yml` runs `supabase db push --db-url` on `main` when `supabase/migrations/**` changes. Factory sets repo secret `SUPABASE_DB_URL` (direct Postgres URI) during `factory-new-app`. One secret; no Supabase access token required for that job.

Hobby is free for personal use. Commercial use requires Pro.

## Cloudflare Workers (stub)

See [deploy/cloudflare/README.md](../deploy/cloudflare/README.md). Cheaper commercial edge, official MCP, but 10 ms CPU on the free Workers plan can hurt Nuxt SSR.

## Coolify on OVH VPS (stub)

See [deploy/coolify/README.md](../deploy/coolify/README.md). One VPS (~3–5 €/month) plus wildcard DNS when you run many apps.

## Not used as defaults

Netlify, Clever Cloud, Fly, Railway, Render, GitHub Pages.

## Override

`FACTORY_DEPLOY=vercel|cloudflare|coolify` (only `vercel` works in v1).
