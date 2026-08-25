# Vercel adapter (default)

- Nitro preset `vercel` (zero-config).
- Git push to `main` deploys production.
- Preview deployments are **disabled** so they cannot write to the single Supabase project.
- Database schema: GitHub Actions `deploy-migrations.yml` pushes `supabase/migrations` to the hosted project via secret `SUPABASE_DB_URL`.
- Custom domain: `vercel domains add {slug}.pierre-reynaud.fr` then OVH CNAME to `cname.vercel-dns.com`.
- Agent tools: MCP `https://mcp.vercel.com` (`deploy_to_vercel`, logs, `use_vercel_cli`). Domain MCP tools buy domains; they do not attach a subdomain you already own.
- Hobby is personal/non-commercial. A commercial app needs Pro ($20/seat).
