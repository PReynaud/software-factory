---
name: factory-upgrade
description: Open a reviewable PR that syncs factory-managed files from a newer nuxt-app-template release into an existing app. Use when upgrading generated apps.
---

# factory-upgrade

Propagate structural template changes into an existing app. Never merge automatically.

## Dry-run first

```bash
pnpm upgrade -- --dry-run --name Foo
```

## Steps

1. Read `{app}/.factory-version` and the target `nuxt-app-template` SemVer tag.
2. Diff only files listed in the template `.factory/managed-files.json` allowlist (CI, Cursor rules, BMAD customizations, MCP config, auth shell, fixtures).
3. Copy those files onto a new branch. Leave product files untouched.
4. Open a PR with the changelog delta in English.
5. Stop on conflicts and describe them in the PR body.

Renovate owns dependency updates. This skill owns structural sync.
