import type { Violation } from '../types.ts';

export function groupByFile(violations: Violation[]): Map<string, Violation[]> {
  const map = new Map<string, Violation[]>();
  for (const v of violations) {
    const list = map.get(v.file) ?? [];
    list.push(v);
    map.set(v.file, list);
  }
  return map;
}
