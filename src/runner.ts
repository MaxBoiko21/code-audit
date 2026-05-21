import type { SourceFile } from 'ts-morph';
import type { Rule, RuleContext, RuleId, Violation } from './types.ts';
import { rules } from './rules/index.ts';
import { loadProject } from './project-loader.ts';
import { buildInterfaceNameCounts } from './rules/_shared/interface-merging.ts';
import { exemptRuleIdsFor } from './rules/_shared/exemptions.ts';

export type RunOptions = {
  paths: string[];
  ruleIds?: string[];
  excludeRuleIds?: string[];
};

export function runAudit(opts: RunOptions): Violation[] {
  const project = loadProject(opts.paths);
  const activeRules = filterRules(rules, opts);
  const files = project.getSourceFiles();
  const ctx: RuleContext = { interfaceNameCounts: buildInterfaceNameCounts(files) };
  return collectViolations(files, activeRules, ctx);
}

function filterRules(all: Rule[], opts: RunOptions): Rule[] {
  const include = opts.ruleIds && opts.ruleIds.length > 0 ? new Set(opts.ruleIds) : null;
  const exclude = opts.excludeRuleIds && opts.excludeRuleIds.length > 0
    ? new Set(opts.excludeRuleIds)
    : null;
  return all.filter((r) => {
    if (include && !include.has(r.id)) { return false; }
    if (exclude && exclude.has(r.id)) { return false; }
    return true;
  });
}

function collectViolations(
  files: SourceFile[],
  activeRules: Rule[],
  ctx: RuleContext,
): Violation[] {
  const out: Violation[] = [];
  for (const file of files) { out.push(...runRulesOnFile(file, activeRules, ctx)); }
  return out;
}

function runRulesOnFile(
  file: SourceFile,
  activeRules: Rule[],
  ctx: RuleContext,
): Violation[] {
  const path = file.getFilePath();
  const exempt = exemptRuleIdsFor(path);
  const out: Violation[] = [];
  for (const rule of activeRules) {
    if (!rule.appliesTo(path)) { continue; }
    if (exempt.has(rule.id as RuleId)) { continue; }
    out.push(...rule.check(file, ctx));
  }
  return out;
}
