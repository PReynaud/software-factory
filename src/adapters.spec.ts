import { describe, expect, it } from 'vitest';
import { getAdapter } from './adapters';

describe('deploy adapters', () => {
  it('marks Vercel as implemented', () => {
    expect(getAdapter('vercel').implemented).toBe(true);
    expect(getAdapter('vercel').describe('foo', 'foo.pierre-reynaud.fr').length).toBeGreaterThan(0);
  });

  it('keeps Cloudflare and Coolify as stubs', () => {
    expect(getAdapter('cloudflare').implemented).toBe(false);
    expect(getAdapter('coolify').implemented).toBe(false);
  });

  it('skips Vercel smoke when token is missing', async () => {
    const previous = process.env.VERCEL_TOKEN;
    delete process.env.VERCEL_TOKEN;
    const result = await getAdapter('vercel').smoke();
    if (previous) {
      process.env.VERCEL_TOKEN = previous;
    }
    expect(result.ok).toBe(true);
    expect(result.message).toMatch(/Skipped/);
  });
});
