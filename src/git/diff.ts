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
  const tracked = runGit(root, buildDiffArgs(scope));
  if (scope !== 'working') {
    return tracked;
  }
  const untracked = runGit(root, ['ls-files', '--others', '--exclude-standard']);
  return [...tracked, ...untracked];
}

function runGit(root: string, args: string[]): string[] {
  const r = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (r.status !== 0) {
    throw new Error('git ' + args[0] + ' failed: ' + r.stderr.trim());
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
