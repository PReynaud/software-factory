# AGENT.md — software-factory

- Chat in English or French, matching the user. Produce English artifacts only.
- Never copy this repo into a generated app.
- Always `--dry-run` factory-new-app and factory-upgrade before mutating resources.
- Inspect-before-create. Persist step results in `.factory-state/{slug}.json` without secrets.
- Default deploy is Vercel. Cloudflare and Coolify are stubs.
- Supabase Free: 2 active projects. Offer pause before Pro. Human confirm before billable creates.
