import type { Severity, Violation } from './types.ts';
import { formatJson } from './report/json.ts';
import { formatPretty } from './report/pretty.ts';
import { formatSummary } from './report/summary.ts';

export type ReportFormat = 'json' | 'pretty' | 'summary';

export function formatReport(
  violations: Violation[],
  format: ReportFormat,
  severity?: Severity,
): string {
  if (format === 'json') { return formatJson(violations); }
  const filtered = filterBySeverity(violations, severity);
  if (format === 'summary') { return formatSummary(filtered); }
  return formatPretty(filtered);
}

function filterBySeverity(violations: Violation[], severity: Severity | undefined): Violation[] {
  if (!severity) { return violations; }
  return violations.filter((v) => v.severity === severity);
}
