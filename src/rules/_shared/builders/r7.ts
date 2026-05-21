import type { Node, SourceFile } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { makeViolation } from '../violations.ts';

export type ParamCountInput = { file: SourceFile; at: Node; count: number; limit: number };

export function paramCountViolation(input: ParamCountInput): Violation {
  return makeViolation({
    rule: 'R7-params',
    severity: 'warn',
    file: input.file,
    at: input.at,
    message: `function has ${input.count} parameters (limit ${input.limit}) — replace with a single object parameter`,
  });
}
