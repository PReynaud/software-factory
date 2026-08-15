# software-factory

Control plane for apps generated from [nuxt-app-template](https://github.com/PReynaud/nuxt-app-template).

This repo is **not** copied into apps. It provisions GitHub, Supabase, Vercel, and OVH DNS.

## Quick start

```bash
pnpm install
cp .env.example .env
pnpm new-app -- --dry-run --name Foo
pnpm test
```

Then invoke the `factory-new-app` skill (confirm the plan before any mutating API call).

## Layout

- `.agents/skills/factory-new-app` — create a public app
- `.agents/skills/factory-upgrade` — PR structural updates into an existing app
- `src/` — dry-run CLI, OVH CNAME builder, adapters, state
- `deploy/` — adapter notes (Vercel implemented; Cloudflare and Coolify stubs)
- `docs/deploy.md` — host comparison

## Rules

- Generated GitHub repos are **public** (required checks work on Free).
- One Supabase project per app. Free plan: 2 active projects. Pause before creating a third. Never enable Pro automatically.
- Vercel previews are off (one database).
- Chat may be English or French. All produced artifacts are English.

## Commands

```bash
pnpm new-app -- --dry-run --name Foo
pnpm new-app -- --status --slug foo
pnpm upgrade -- --dry-run --name Foo
pnpm smoke
pnpm test
pnpm lint
pnpm typecheck
```
