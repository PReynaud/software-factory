import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';

export type StepName =
  | 'github-repo'
  | 'clone-customize'
  | 'supabase'
  | 'vercel'
  | 'ovh-dns'
  | 'auth-urls';

export interface FactoryState {
  slug: string
  name: string
  dryRun: boolean
  completed: Partial<Record<StepName, { at: string, details: Record<string, string> }>>
}

export function statePath(root: string, slug: string): string {
  return join(root, '.factory-state', `${slug}.json`);
}

export function loadState(root: string, slug: string): FactoryState | null {
  const file = statePath(root, slug);
  if (!existsSync(file)) {
    return null;
  }

  return JSON.parse(readFileSync(file, 'utf8')) as FactoryState;
}

export function saveState(root: string, state: FactoryState): void {
  const file = statePath(root, state.slug);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, `${JSON.stringify(state, null, 2)}\n`);
}

export function markStep(
  state: FactoryState,
  step: StepName,
  details: Record<string, string>
): FactoryState {
  return {
    ...state,
    completed: {
      ...state.completed,
      [step]: {
        at: new Date().toISOString(),
        details
      }
    }
  };
}

export function remainingSteps(state: FactoryState): StepName[] {
  const order: StepName[] = [
    'github-repo',
    'clone-customize',
    'supabase',
    'vercel',
    'ovh-dns',
    'auth-urls'
  ];

  return order.filter((step) => !state.completed[step]);
}
