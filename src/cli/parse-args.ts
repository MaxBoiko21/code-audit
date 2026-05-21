import type { ReportFormat } from '../report.ts';
import type { ChangedScope } from '../git-changed.ts';

export type Args = {
  paths: string[];
  format: ReportFormat;
  ruleIds?: string[];
  changed?: ChangedScope;
};

export function parseArgs(argv: string[]): Args {
  const acc: Args = { paths: [], format: 'pretty' };
  for (const a of argv) {
    applyArg(acc, a);
  }
  return acc;
}

function applyArg(acc: Args, arg: string): void {
  if (arg === '--json') {
    acc.format = 'json';
    return;
  }
  if (arg.startsWith('--rules=')) {
    acc.ruleIds = arg.slice('--rules='.length).split(',');
    return;
  }
  if (arg === '--changed') {
    acc.changed = 'working';
    return;
  }
  if (arg.startsWith('--changed=')) {
    acc.changed = parseChangedScope(arg.slice('--changed='.length));
    return;
  }
  acc.paths.push(arg);
}

function parseChangedScope(value: string): ChangedScope {
  if (value === 'staged') {
    return 'staged';
  }
  if (value === 'working' || value === '') {
    return 'working';
  }
  return { against: value };
}
