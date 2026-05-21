#!/usr/bin/env bun
import { runAudit } from './runner.ts';
import { formatReport } from './report.ts';
import { resolveChangedFiles } from './git-changed.ts';
import { parseArgs, type Args } from './cli/parse-args.ts';

function main(): void {
  const args = parseArgsOrExit(process.argv.slice(2));
  const paths = resolvePaths(args);
  if (paths.length === 0) {
    console.log('No files to audit.');
    process.exit(0);
  }
  const violations = runAudit({
    paths,
    ruleIds: args.ruleIds,
    excludeRuleIds: args.excludeRuleIds,
  });
  const out = formatReport(violations, args.format, args.severity);
  console.log(out);
  const hasErrors = violations.some((v) => v.severity === 'error');
  process.exit(hasErrors ? 1 : 0);
}

function parseArgsOrExit(argv: string[]): Args {
  try {
    return parseArgs(argv);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`code-audit: ${msg}`);
    process.exit(2);
  }
}

function resolvePaths(args: Args): string[] {
  if (args.changed) {
    return resolveChangedFiles(args.changed);
  }
  if (args.paths.length > 0) {
    return args.paths;
  }
  return ['src/**/*.{ts,tsx}'];
}

main();
