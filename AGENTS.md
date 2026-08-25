# AGENT.md — software-factory

- Chat in English or French, matching the user. Produce English artifacts only.
- Never copy this repo into a generated app.
- Always `--dry-run` factory-new-app and factory-upgrade before mutating resources.
- Inspect-before-create. Persist step results in `.factory-state/{slug}.json` without secrets.
- App folders default to `C:\Users\pierr\Documents\Projects\{slug}`.
- Default deploy is Vercel. Cloudflare and Coolify are stubs.
- Supabase Free: 2 active projects. Offer pause before Pro. Human confirm before billable creates.
- Production migrations: template `deploy-migrations.yml` + GitHub secret `SUPABASE_DB_URL` (set during factory-new-app; never store in `.factory-state`).
