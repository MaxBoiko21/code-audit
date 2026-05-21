import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { getRepoRoot, listChangedPaths, type ChangedScope } from './git/diff.ts';

export type { ChangedScope };

export function resolveChangedFiles(scope: ChangedScope): string[] {
  const root = getRepoRoot();
  const raw = listChangedPaths(root, scope);
  return raw
    .map((p) => resolve(root, p))
    .filter((p) => existsSync(p))
    .filter(isTsFile);
}

function isTsFile(path: string): boolean {
  return /\.(ts|tsx)$/.test(path);
}
