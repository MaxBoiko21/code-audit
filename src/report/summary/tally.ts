import type { RuleId, Violation } from '../../types.ts';

export type Tally = { total: number; errors: number; warnings: number };

export function formatRow(label: string, t: Tally, padTo: number): string {
  const left = `  ${label}`.padEnd(padTo);
  const total = String(t.total).padStart(5);
  return `${left}  ${total}  (${t.errors} err / ${t.warnings} warn)`;
}

export function tally(violations: Violation[]): Tally {
  let errors = 0;
  let warnings = 0;
  for (const v of violations) {
    if (v.severity === 'error') { errors++; continue; }
    warnings++;
  }
  return { total: violations.length, errors, warnings };
}

export function tallyByRule(violations: Violation[]): Map<RuleId, Tally> {
  const map = new Map<RuleId, Tally>();
  for (const v of violations) {
    const cur = map.get(v.rule) ?? { total: 0, errors: 0, warnings: 0 };
    cur.total++;
    if (v.severity === 'error') { cur.errors++; } else { cur.warnings++; }
    map.set(v.rule, cur);
  }
  return map;
}
