#!/usr/bin/env node
import { homedir } from 'node:os';
import { join } from 'node:path';
import { getAdapter } from './adapters';
import { loadState, remainingSteps, saveState, type FactoryState } from './state';
import { DEFAULT_ZONE, planNewApp, slugify, type NewAppOptions } from './plan';

interface ParsedArgs {
  command: 'new-app' | 'upgrade' | 'smoke'
  dryRun: boolean
  resume: boolean
  status: boolean
  noPwa: boolean
  name?: string
  slug?: string
}

function parseArgs(argv: string[]): ParsedArgs {
  const [, , command, ...rest] = argv;
  if (command !== 'new-app' && command !== 'upgrade' && command !== 'smoke') {
    throw new Error('Usage: tsx src/cli.ts <new-app|upgrade|smoke> [--dry-run] [--resume] [--status] [--no-pwa] --name <Name>');
  }

  const args: ParsedArgs = {
    command,
    dryRun: rest.includes('--dry-run'),
    resume: rest.includes('--resume'),
    status: rest.includes('--status'),
    noPwa: rest.includes('--no-pwa')
  };

  const nameIndex = rest.indexOf('--name');
  if (nameIndex >= 0) {
    args.name = rest[nameIndex + 1];
  }

  const slugIndex = rest.indexOf('--slug');
  if (slugIndex >= 0) {
    args.slug = rest[slugIndex + 1];
  }

  return args;
}

function factoryRoot(): string {
  return process.cwd();
}

function projectsRoot(): string {
  return process.env.PROJECTS_ROOT || join(homedir(), 'Documents', 'Projects');
}

async function runSmoke(): Promise<void> {
  const deploy = (process.env.FACTORY_DEPLOY || 'vercel') as 'vercel' | 'cloudflare' | 'coolify';
  const adapter = getAdapter(deploy);
  const result = await adapter.smoke();
  console.log(result.message);
  if (!result.ok) {
    process.exitCode = 1;
  }
}

function printStatus(state: FactoryState): void {
  console.log(`App ${state.name} (${state.slug})`);
  for (const [step, value] of Object.entries(state.completed)) {
    console.log(`  done  ${step} @ ${value?.at}`);
  }
  const remaining = remainingSteps(state);
  if (remaining.length === 0) {
    console.log('  remaining: none');
    return;
  }
  console.log(`  remaining: ${remaining.join(', ')}`);
}

async function runNewApp(args: ParsedArgs): Promise<void> {
  if (!args.name && !args.slug) {
    throw new Error('--name is required (or --slug with --status/--resume)');
  }

  const slug = args.slug || slugify(args.name || '');
  const name = args.name || slug;
  const options: NewAppOptions = {
    name,
    slug,
    dryRun: args.dryRun,
    resume: args.resume,
    noPwa: args.noPwa,
    deploy: (process.env.FACTORY_DEPLOY || 'vercel') as NewAppOptions['deploy'],
    projectsRoot: projectsRoot(),
    zone: process.env.OVH_ZONE || DEFAULT_ZONE,
    templateRepo: process.env.GITHUB_TEMPLATE_REPO || 'PReynaud/nuxt-app-template'
  };

  const existing = loadState(factoryRoot(), slug);

  if (args.status) {
    if (!existing) {
      console.log(`No state for ${slug}`);
      return;
    }
    printStatus(existing);
    return;
  }

  const lines = planNewApp(options, existing);
  console.log(lines.join('\n'));

  if (args.dryRun) {
    console.log('\nDry run: no resources created.');
    return;
  }

  if (!getAdapter(options.deploy).implemented) {
    throw new Error(`Deploy adapter ${options.deploy} is a stub. Use FACTORY_DEPLOY=vercel.`);
  }

  const state: FactoryState = existing ?? {
    slug,
    name,
    dryRun: false,
    completed: {}
  };

  saveState(factoryRoot(), state);
  console.log(`\nState written to .factory-state/${slug}.json`);
  console.log('Mutating steps are executed by the factory-new-app skill (GitHub, Supabase, Vercel, OVH).');
  console.log('Re-run with --resume after each completed step. Use --status to inspect.');
}

async function runUpgrade(args: ParsedArgs): Promise<void> {
  const lines = [
    'factory-upgrade plan',
    '1. Read .factory-version in the target app',
    '2. Diff against nuxt-app-template tag (allowlist in .factory/managed-files.json)',
    '3. Open a reviewable PR — never merge automatically',
    args.dryRun ? 'Dry run: no files copied, no PR opened' : 'Skill performs the copy and gh pr create'
  ];
  console.log(lines.join('\n'));
}

const args = parseArgs(process.argv);

if (args.command === 'smoke') {
  await runSmoke();
} else if (args.command === 'upgrade') {
  await runUpgrade(args);
} else {
  await runNewApp(args);
}
