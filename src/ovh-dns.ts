export const DEFAULT_ZONE = 'pierre-reynaud.fr';
export const VERCEL_CNAME_TARGET = 'cname.vercel-dns.com';

export interface CnameRecordInput {
  zone: string
  subdomain: string
  target: string
  ttl?: number
}

export interface CnameRecordPayload {
  fieldType: 'CNAME'
  subDomain: string
  target: string
  ttl: number
}

export function normalizeCnameTarget(target: string): string {
  return target.endsWith('.') ? target : `${target}.`;
}

export function buildCnameRecord(input: CnameRecordInput): CnameRecordPayload {
  const subdomain = input.subdomain.trim().replace(/\.$/, '');
  if (!subdomain || subdomain.includes('.')) {
    throw new Error(`Invalid subdomain "${input.subdomain}". Use a single label such as "foo".`);
  }

  return {
    fieldType: 'CNAME',
    subDomain: subdomain,
    target: normalizeCnameTarget(input.target),
    ttl: input.ttl ?? 60
  };
}

export function zoneRecordPath(zone: string): string {
  return `/domain/zone/${zone}/record`;
}

export function zoneRefreshPath(zone: string): string {
  return `/domain/zone/${zone}/refresh`;
}

export function describeCnamePlan(input: CnameRecordInput): string {
  const record = buildCnameRecord(input);
  return `POST ${zoneRecordPath(input.zone)} ${record.fieldType} ${record.subDomain} -> ${record.target} (ttl ${record.ttl}) then POST ${zoneRefreshPath(input.zone)}`;
}
