import type { Violation } from '../types.ts';
import { groupByFile } from './grouping.ts';

export function formatPretty(violations: Violation[]): string {
  if (violations.length === 0) { return 'No violations.'; }
  const byFile = groupByFile(violations);
  const sections = [...byFile.entries()].map(([file, vs]) => renderFile(file, vs));
  return [...sections, '', renderSummary(violations)].join('\n');
}

function renderFile(file: string, vs: Violation[]): string {
  const lines = vs.map(
    (v) => `  ${v.line}:${v.column}  ${v.severity.padEnd(5)}  ${v.rule}  ${v.message}`,
  );
  return [`\n${file}`, ...lines].join('\n');
}

function renderSummary(violations: Violation[]): string {
  const errors = violations.filter((v) => v.severity === 'error').length;
  const warnings = violations.filter((v) => v.severity === 'warn').length;
  return `${violations.length} problems (${errors} errors, ${warnings} warnings)`;
}
