import { remainingSteps, type FactoryState, type StepName } from './state';
import { describeCnamePlan, DEFAULT_ZONE, VERCEL_CNAME_TARGET } from './ovh-dns';

export interface NewAppOptions {
  name: string
  slug: string
  dryRun: boolean
  resume: boolean
  noPwa: boolean
  deploy: 'vercel' | 'cloudflare' | 'coolify'
  projectsRoot: string
  zone: string
  templateRepo: string
}

export function slugify(name: string): string {
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug) {
    throw new Error('App name produced an empty slug');
  }

  return slug;
}

export function planNewApp(options: NewAppOptions, state: FactoryState | null): string[] {
  const fqdn = `${options.slug}.${options.zone}`;
  const appDir = `${options.projectsRoot}\\${options.slug}`;
  const lines = [
    `App: ${options.name} (${options.slug})`,
    `Directory: ${appDir}`,
    `GitHub: public repo from template ${options.templateRepo}`,
    `Secret scanning + push protection + main ruleset (required checks)`,
    options.noPwa ? 'Remove PWA files after clone' : 'Keep PWA files',
    `Supabase: dedicated project in eu-west-3 after quota check + human confirm`,
    `GitHub secret SUPABASE_DB_URL + deploy-migrations workflow (db push on main)`,
    `Deploy adapter: ${options.deploy}`,
    options.deploy === 'vercel'
      ? `Vercel: link repo, set env, disable preview deployments, domains add ${fqdn}`
      : `Deploy adapter "${options.deploy}" is a stub in v1`,
    describeCnamePlan({
      zone: options.zone,
      subdomain: options.slug,
      target: options.deploy === 'vercel' ? VERCEL_CNAME_TARGET : 'REPLACE_ME'
    }),
    `Supabase auth redirects: http://localhost:3000/confirm and https://${fqdn}/confirm`
  ];

  if (state) {
    const remaining = remainingSteps(state);
    lines.push(`Resume: completed ${Object.keys(state.completed).join(', ') || 'nothing'}`);
    lines.push(`Remaining: ${remaining.join(', ') || 'none'}`);
  }

  return lines;
}

export function assertDeploySupported(step: StepName, deploy: NewAppOptions['deploy']): void {
  if (step === 'vercel' && deploy !== 'vercel') {
    throw new Error(`Deploy adapter ${deploy} is not implemented. Use FACTORY_DEPLOY=vercel.`);
  }
}

export { DEFAULT_ZONE };
