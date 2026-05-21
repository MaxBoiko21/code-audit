import type { Node, SourceFile } from 'ts-morph';
import type { Severity, Violation } from '../../../types.ts';
import { makeViolation } from '../violations.ts';

export type FunctionSizeInput = {
  file: SourceFile;
  at: Node;
  name: string;
  lines: number;
  target: number;
  severity: Severity;
};

export function functionSizeViolation(input: FunctionSizeInput): Violation {
  return makeViolation({
    rule: 'R3-function-size',
    severity: input.severity,
    file: input.file,
    at: input.at,
    message: `function ${input.name} is ${input.lines} lines (target <= ${input.target})`,
  });
}
