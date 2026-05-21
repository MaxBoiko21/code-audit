import type { Violation } from '../types.ts';
import { groupByFile } from './_shared/group-by-file.ts';
import { tally, tallyByRule, formatRow, type Tally } from './summary/tally.ts';
import { byErrorsThenTotal } from './summary/sort.ts';

const TOP_FILES = 10;
const RULE_LABEL_WIDTH = 24;
const FILE_LABEL_WIDTH = 40;

export function formatSummary(violations: Violation[]): string {
  if (violations.length === 0) { return 'No violations.'; }
  const fileCount = new Set(violations.map((v) => v.file)).size;
  const totals = tally(violations);
  return [
    renderHeader(totals, fileCount),
    '',
    renderByRule(violations),
    '',
    renderTopFiles(violations),
  ].join('\n');
}

function renderHeader(t: Tally, fileCount: number): string {
  return `${t.total} violations across ${fileCount} files — ${t.errors} errors, ${t.warnings} warnings`;
}

function renderByRule(violations: Violation[]): string {
  const byRule = tallyByRule(violations);
  const sorted = [...byRule.entries()].sort((a, b) => b[1].total - a[1].total);
  const rows = sorted.map(([rule, t]) => formatRow(rule, t, RULE_LABEL_WIDTH));
  return ['By rule:', ...rows].join('\n');
}

function renderTopFiles(violations: Violation[]): string {
  const byFile = groupByFile(violations);
  const entries = [...byFile.entries()].map(([file, vs]) => ({ file, tally: tally(vs) }));
  entries.sort(byErrorsThenTotal);
  const rows = entries.slice(0, TOP_FILES).map((e) => formatRow(e.file, e.tally, FILE_LABEL_WIDTH));
  return [`Top ${TOP_FILES} files:`, ...rows].join('\n');
}
