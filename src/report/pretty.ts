import type { Violation } from '../types.ts';
import { collapseCascades, type CollapsedGroup } from './collapse.ts';
import { groupByFile } from './_shared/group-by-file.ts';

export function formatPretty(violations: Violation[]): string {
  if (violations.length === 0) { return 'No violations.'; }
  const groups = collapseCascades(violations);
  const byFile = groupByFile(groups);
  const sections = [...byFile.entries()].map(([file, gs]) => renderFile(file, gs));
  return [...sections, '', renderSummary(violations)].join('\n');
}

function renderFile(file: string, gs: CollapsedGroup[]): string {
  const lines = gs.map(renderLine);
  return [`\n${file}`, ...lines].join('\n');
}

function renderLine(g: CollapsedGroup): string {
  const head = `  ${g.firstLine}:${g.firstColumn}  ${g.severity.padEnd(5)}  ${g.rule}  ${g.message}`;
  if (g.count === 1) { return head; }
  return `${head}  (×${g.count} sites: ${g.lineRanges})`;
}

function renderSummary(violations: Violation[]): string {
  const errors = violations.filter((v) => v.severity === 'error').length;
  const warnings = violations.filter((v) => v.severity === 'warn').length;
  return `${violations.length} problems (${errors} errors, ${warnings} warnings)`;
}
