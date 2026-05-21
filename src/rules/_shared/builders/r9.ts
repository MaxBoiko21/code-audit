import type { Node, SourceFile } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { makeViolation } from '../violations.ts';

export function anyKeywordViolation(file: SourceFile, at: Node): Violation {
  return makeViolation({
    rule: 'R9-types',
    severity: 'error',
    file,
    at,
    message: '`any` — use `unknown`, a concrete type, or a generic',
  });
}

export function chainCastViolation(file: SourceFile, at: Node): Violation {
  return makeViolation({
    rule: 'R9-types',
    severity: 'error',
    file,
    at,
    message: '`as unknown as X` — the original type is wrong, fix it at the source',
  });
}

export function missingReturnViolation(file: SourceFile, at: Node, name: string): Violation {
  return makeViolation({
    rule: 'R9-types',
    severity: 'warn',
    file,
    at,
    message: `exported ${name} has no explicit return type`,
  });
}
