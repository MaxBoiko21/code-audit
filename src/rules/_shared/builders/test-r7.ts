import type { Node, SourceFile } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { makeViolation } from '../violations.ts';

export function testNameViolation(file: SourceFile, at: Node, label: string): Violation {
  return makeViolation({
    rule: 'TEST-R7-naming',
    severity: 'warn',
    file,
    at,
    message: `test name "${label}" should start with a feature anchor (identifier-like first token)`,
  });
}
