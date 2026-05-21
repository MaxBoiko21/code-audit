import type { RuleId } from '../../types.ts';

const TEST_PATH = /\.(test|spec)\.(ts|tsx|js|jsx)$/;
const MIGRATION_PATH = /(^|\/)(migrations|seeds)\//;
const GENERATED_PATH = /(^|\/)__generated__\/|\.(gen|generated)\.tsx?$/;

const TEST_EXEMPT: ReadonlySet<RuleId> = new Set<RuleId>([
  'R3-function-size',
  'R4-file-size',
  'R7-params',
]);

const ALL_RULE_IDS: ReadonlySet<RuleId> = new Set<RuleId>([
  'R1-nesting',
  'R3-function-size',
  'R4-file-size',
  'R7-params',
  'R9-types',
  'R12-block-bodies',
  'TS-enum-interface',
  'TS-types-placement',
  'TEST-R7-naming',
]);

export function exemptRuleIdsFor(path: string): ReadonlySet<RuleId> {
  if (MIGRATION_PATH.test(path)) { return ALL_RULE_IDS; }
  if (GENERATED_PATH.test(path)) { return ALL_RULE_IDS; }
  if (TEST_PATH.test(path)) { return TEST_EXEMPT; }
  return EMPTY;
}

const EMPTY: ReadonlySet<RuleId> = new Set<RuleId>();
