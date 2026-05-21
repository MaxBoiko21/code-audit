import type { Node, SourceFile } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { makeViolation } from '../violations.ts';

export function blockBodyViolation(file: SourceFile, at: Node, construct: string): Violation {
  return makeViolation({
    rule: 'R12-block-bodies',
    severity: 'warn',
    file,
    at,
    message: `${construct} body must be wrapped in { }`,
  });
}
