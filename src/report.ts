import type { Violation } from './types.ts';
import { formatJson } from './report/json.ts';
import { formatPretty } from './report/pretty.ts';

export type ReportFormat = 'json' | 'pretty';

export function formatReport(violations: Violation[], format: ReportFormat): string {
  if (format === 'json') { return formatJson(violations); }
  return formatPretty(violations);
}
