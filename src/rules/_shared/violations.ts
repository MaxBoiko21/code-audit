import type { Node, SourceFile } from 'ts-morph';
import type { RuleId, Severity, Violation } from '../../types.ts';

export type ViolationInput = {
  rule: RuleId;
  severity: Severity;
  file: SourceFile;
  at: Node | number;
  message: string;
};

export function makeViolation(input: ViolationInput): Violation {
  const pos = typeof input.at === 'number' ? input.at : input.at.getStart();
  const { line, column } = input.file.getLineAndColumnAtPos(pos);
  return {
    rule: input.rule,
    severity: input.severity,
    file: input.file.getFilePath(),
    line,
    column,
    message: input.message,
  };
}

export type FileLevelInput = {
  rule: RuleId;
  severity: Severity;
  file: SourceFile;
  message: string;
};

export function fileLevel(input: FileLevelInput): Violation {
  return {
    rule: input.rule,
    severity: input.severity,
    file: input.file.getFilePath(),
    line: 1,
    column: 1,
    message: input.message,
  };
}
