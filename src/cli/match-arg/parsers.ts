import type { Severity } from '../../types.ts';
import type { ChangedScope } from '../../git-changed.ts';

export function splitList(arg: string, prefix: string): string[] {
  return arg.slice(prefix.length).split(',').filter((s) => s.length > 0);
}

export function parseSeverity(value: string): Severity {
  if (value === 'error' || value === 'warn') { return value; }
  throw new Error(`--severity must be 'error' or 'warn', got '${value}'`);
}

export function parseChangedScope(value: string): ChangedScope {
  if (value === 'staged') { return 'staged'; }
  if (value === 'working' || value === '') { return 'working'; }
  return { against: value };
}
