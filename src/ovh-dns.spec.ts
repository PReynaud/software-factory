import { describe, expect, it } from 'vitest';
import {
  buildCnameRecord,
  describeCnamePlan,
  normalizeCnameTarget,
  zoneRecordPath,
  zoneRefreshPath
} from './ovh-dns';

describe('buildCnameRecord', () => {
  it('builds a CNAME payload with a trailing-dot target', () => {
    expect(buildCnameRecord({
      zone: 'pierre-reynaud.fr',
      subdomain: 'foo',
      target: 'cname.vercel-dns.com'
    })).toEqual({
      fieldType: 'CNAME',
      subDomain: 'foo',
      target: 'cname.vercel-dns.com.',
      ttl: 60
    });
  });

  it('keeps an already-qualified target', () => {
    expect(normalizeCnameTarget('cname.vercel-dns.com.')).toBe('cname.vercel-dns.com.');
  });

  it('rejects empty or dotted subdomains', () => {
    expect(() => buildCnameRecord({
      zone: 'pierre-reynaud.fr',
      subdomain: '',
      target: 'cname.vercel-dns.com'
    })).toThrow(/Invalid subdomain/);

    expect(() => buildCnameRecord({
      zone: 'pierre-reynaud.fr',
      subdomain: 'foo.bar',
      target: 'cname.vercel-dns.com'
    })).toThrow(/Invalid subdomain/);
  });
});

describe('OVH paths', () => {
  it('points record create and zone refresh at the zone', () => {
    expect(zoneRecordPath('pierre-reynaud.fr')).toBe('/domain/zone/pierre-reynaud.fr/record');
    expect(zoneRefreshPath('pierre-reynaud.fr')).toBe('/domain/zone/pierre-reynaud.fr/refresh');
  });

  it('describes the mutate plan for dry-run', () => {
    expect(describeCnamePlan({
      zone: 'pierre-reynaud.fr',
      subdomain: 'foo',
      target: 'cname.vercel-dns.com'
    })).toContain('POST /domain/zone/pierre-reynaud.fr/record');
    expect(describeCnamePlan({
      zone: 'pierre-reynaud.fr',
      subdomain: 'foo',
      target: 'cname.vercel-dns.com'
    })).toContain('POST /domain/zone/pierre-reynaud.fr/refresh');
  });
});
