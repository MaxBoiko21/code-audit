import type { SourceFile } from 'ts-morph';

export type RuleId =
  | 'R1-nesting'
  | 'R3-function-size'
  | 'R4-file-size'
  | 'R7-params'
  | 'R9-types'
  | 'R12-block-bodies'
  | 'TS-enum-interface'
  | 'TS-types-placement'
  | 'TEST-R7-naming';

export type Severity = 'warn' | 'error';

export type Violation = {
  rule: RuleId;
  severity: Severity;
  file: string;
  line: number;
  column: number;
  message: string;
};

export type RuleContext = {
  interfaceNameCounts: Map<string, number>;
};

export type Rule = {
  id: RuleId;
  appliesTo: (filePath: string) => boolean;
  check: (sourceFile: SourceFile, ctx: RuleContext) => Violation[];
};
