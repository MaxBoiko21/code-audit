import type { Node, SourceFile } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { makeViolation } from '../violations.ts';

export type DepthInput = { file: SourceFile; at: Node; depth: number; limit: number };

export function depthViolation(input: DepthInput): Violation {
  return makeViolation({
    rule: 'R1-nesting',
    severity: 'warn',
    file: input.file,
    at: input.at,
    message: `nesting depth ${input.depth} exceeds limit ${input.limit}`,
  });
}

export function elseAfterReturnViolation(file: SourceFile, at: Node): Violation {
  return makeViolation({
    rule: 'R1-nesting',
    severity: 'warn',
    file,
    at,
    message: 'else after a then-branch that returns — drop else, dedent body',
  });
}
