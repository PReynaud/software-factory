export interface AdapterResult {
  ok: boolean
  message: string
  details?: Record<string, string>
}

export interface DeployAdapter {
  id: 'vercel' | 'cloudflare' | 'coolify'
  implemented: boolean
  describe(slug: string, fqdn: string): string[]
  smoke(): Promise<AdapterResult>
}

export const vercelAdapter: DeployAdapter = {
  id: 'vercel',
  implemented: true,
  describe(slug, fqdn) {
    return [
      `vercel link --yes --project ${slug} (or import GitHub repo ${slug})`,
      'Disable preview deployments (production branch main only)',
      'Set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_KEY (do not log values)',
      `vercel domains add ${fqdn}`,
      `OVH CNAME ${slug} -> cname.vercel-dns.com`
    ];
  },
  async smoke() {
    if (!process.env.VERCEL_TOKEN) {
      return { ok: true, message: 'Skipped Vercel smoke test (VERCEL_TOKEN unset)' };
    }

    const response = await fetch('https://api.vercel.com/v9/projects?limit=1', {
      headers: { Authorization: `Bearer ${process.env.VERCEL_TOKEN}` }
    });

    if (!response.ok) {
      return { ok: false, message: `Vercel API ${response.status}: ${await response.text()}` };
    }

    return { ok: true, message: 'Vercel API reachable' };
  }
};

export const cloudflareAdapter: DeployAdapter = {
  id: 'cloudflare',
  implemented: false,
  describe() {
    return ['Cloudflare Workers adapter is a v1 stub. Set FACTORY_DEPLOY=vercel.'];
  },
  async smoke() {
    return { ok: true, message: 'Cloudflare adapter is a stub (no API calls)' };
  }
};

export const coolifyAdapter: DeployAdapter = {
  id: 'coolify',
  implemented: false,
  describe() {
    return ['Coolify adapter is a v1 stub. Set FACTORY_DEPLOY=vercel.'];
  },
  async smoke() {
    return { ok: true, message: 'Coolify adapter is a stub (no API calls)' };
  }
};

export function getAdapter(id: DeployAdapter['id']): DeployAdapter {
  if (id === 'cloudflare') {
    return cloudflareAdapter;
  }
  if (id === 'coolify') {
    return coolifyAdapter;
  }
  return vercelAdapter;
}
