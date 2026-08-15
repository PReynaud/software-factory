import { describe, expect, it } from 'vitest';
import { slugify, planNewApp } from './plan';
import { remainingSteps, type FactoryState } from './state';

describe('slugify', () => {
  it('normalizes the app name', () => {
    expect(slugify('Foo Bar')).toBe('foo-bar');
  });
});

describe('planNewApp dry-run', () => {
  it('lists GitHub, Supabase, Vercel, and OVH steps', () => {
    const lines = planNewApp({
      name: 'Foo',
      slug: 'foo',
      dryRun: true,
      resume: false,
      noPwa: false,
      deploy: 'vercel',
      projectsRoot: 'C:\\Users\\pierr\\Projects',
      zone: 'pierre-reynaud.fr',
      templateRepo: 'PReynaud/nuxt-app-template'
    }, null);

    expect(lines.some((line) => line.includes('public repo'))).toBe(true);
    expect(lines.some((line) => line.includes('eu-west-3'))).toBe(true);
    expect(lines.some((line) => line.includes('vercel-dns'))).toBe(true);
    expect(lines.some((line) => line.includes('foo.pierre-reynaud.fr'))).toBe(true);
  });

  it('shows remaining steps on resume', () => {
    const state: FactoryState = {
      slug: 'foo',
      name: 'Foo',
      dryRun: false,
      completed: {
        'github-repo': { at: '2026-08-15T00:00:00.000Z', details: { url: 'https://github.com/PReynaud/foo' } }
      }
    };

    expect(remainingSteps(state)).toEqual([
      'clone-customize',
      'supabase',
      'vercel',
      'ovh-dns',
      'auth-urls'
    ]);
  });
});
