import { spawnSync } from 'node:child_process';

export type ChangedScope = 'working' | 'staged' | { against: string };

export function getRepoRoot(): string {
  const r = spawnSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' });
  if (r.status !== 0) {
    throw new Error('not a git repository (cwd: ' + process.cwd() + ')');
  }
  return r.stdout.trim();
}

export function listChangedPaths(root: string, scope: ChangedScope): string[] {
  const args = buildDiffArgs(scope);
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) {
    throw new Error('git diff failed: ' + r.stderr.trim());
  }
  return r.stdout.split('\n').filter((line) => line.length > 0);
}

function buildDiffArgs(scope: ChangedScope): string[] {
  if (scope === 'working') {
    return ['diff', '--name-only', 'HEAD'];
  }
  if (scope === 'staged') {
    return ['diff', '--name-only', '--cached'];
  }
  return ['diff', '--name-only', scope.against + '...HEAD'];
}
