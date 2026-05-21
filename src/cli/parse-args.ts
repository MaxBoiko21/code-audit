import type { ReportFormat } from '../report.ts';
import type { Severity } from '../types.ts';
import type { ChangedScope } from '../git-changed.ts';
import {
  matchFormat,
  matchRuleFilters,
  matchSeverity,
  matchChanged,
} from './match-arg.ts';

export type Args = {
  paths: string[];
  format: ReportFormat;
  ruleIds?: string[];
  excludeRuleIds?: string[];
  severity?: Severity;
  changed?: ChangedScope;
};

export function parseArgs(argv: string[]): Args {
  const acc: Args = { paths: [], format: 'pretty' };
  for (const a of argv) {
    applyArg(acc, a);
  }
  assertRuleFiltersExclusive(acc);
  return acc;
}

function applyArg(acc: Args, arg: string): void {
  if (matchFormat(acc, arg)) { return; }
  if (matchRuleFilters(acc, arg)) { return; }
  if (matchSeverity(acc, arg)) { return; }
  if (matchChanged(acc, arg)) { return; }
  acc.paths.push(arg);
}

function assertRuleFiltersExclusive(acc: Args): void {
  const hasInclude = acc.ruleIds && acc.ruleIds.length > 0;
  const hasExclude = acc.excludeRuleIds && acc.excludeRuleIds.length > 0;
  if (hasInclude && hasExclude) {
    throw new Error('--rules and --exclude-rules cannot be combined; use one or the other');
  }
}
