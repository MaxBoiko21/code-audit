import type { Args } from './parse-args.ts';
import { splitList, parseSeverity, parseChangedScope } from './match-arg/parsers.ts';

export function matchFormat(acc: Args, arg: string): boolean {
  if (arg === '--json') { acc.format = 'json'; return true; }
  if (arg === '--summary') { acc.format = 'summary'; return true; }
  return false;
}

export function matchRuleFilters(acc: Args, arg: string): boolean {
  if (arg.startsWith('--rules=')) {
    acc.ruleIds = splitList(arg, '--rules=');
    return true;
  }
  if (arg.startsWith('--exclude-rules=')) {
    acc.excludeRuleIds = splitList(arg, '--exclude-rules=');
    return true;
  }
  return false;
}

export function matchSeverity(acc: Args, arg: string): boolean {
  if (!arg.startsWith('--severity=')) { return false; }
  acc.severity = parseSeverity(arg.slice('--severity='.length));
  return true;
}

export function matchChanged(acc: Args, arg: string): boolean {
  if (arg === '--changed') { acc.changed = 'working'; return true; }
  if (arg.startsWith('--changed=')) {
    acc.changed = parseChangedScope(arg.slice('--changed='.length));
    return true;
  }
  return false;
}
