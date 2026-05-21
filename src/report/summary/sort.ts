import type { Tally } from './tally.ts';

export type FileEntry = { file: string; tally: Tally };

export function byErrorsThenTotal(a: FileEntry, b: FileEntry): number {
  if (b.tally.errors !== a.tally.errors) { return b.tally.errors - a.tally.errors; }
  return b.tally.total - a.tally.total;
}
