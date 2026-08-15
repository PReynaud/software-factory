# OVH DNS adapter

Creates `CNAME {slug}.pierre-reynaud.fr -> cname.vercel-dns.com.` via the OVH API, then refreshes the zone.

There is no official OVH MCP. Tokens: `OVH_APPLICATION_KEY`, `OVH_APPLICATION_SECRET`, `OVH_CONSUMER_KEY` (see `.env.example`).

Record construction is unit-tested in `src/ovh-dns.spec.ts`. Inspect existing records before insert (idempotent).
