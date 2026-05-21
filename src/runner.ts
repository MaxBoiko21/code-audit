import type { SourceFile } from 'ts-morph';
import type { Rule, Violation } from './types.ts';
import { rules } from './rules/index.ts';
import { loadProject } from './project-loader.ts';

export type RunOptions = {
  paths: string[];
  ruleIds?: string[];
};

export function runAudit(opts: RunOptions): Violation[] {
  const project = loadProject(opts.paths);
  const activeRules = filterRules(rules, opts.ruleIds);
  return collectViolations(project.getSourceFiles(), activeRules);
}

function filterRules(all: Rule[], ids: string[] | undefined): Rule[] {
  if (!ids || ids.length === 0) { return all; }
  const set = new Set(ids);
  return all.filter((r) => set.has(r.id));
}

function collectViolations(files: SourceFile[], activeRules: Rule[]): Violation[] {
  const out: Violation[] = [];
  for (const file of files) { out.push(...runRulesOnFile(file, activeRules)); }
  return out;
}

function runRulesOnFile(file: SourceFile, activeRules: Rule[]): Violation[] {
  const path = file.getFilePath();
  const out: Violation[] = [];
  for (const rule of activeRules) {
    if (!rule.appliesTo(path)) { continue; }
    out.push(...rule.check(file));
  }
  return out;
}
