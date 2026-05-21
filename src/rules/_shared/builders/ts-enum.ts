import type { Node, SourceFile } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { makeViolation } from '../violations.ts';

export function enumViolation(file: SourceFile, at: Node): Violation {
  return makeViolation({
    rule: 'TS-enum-interface',
    severity: 'warn',
    file,
    at,
    message: '`enum` — prefer union literals (`type X = \'a\' | \'b\'`)',
  });
}

export function interfaceViolation(file: SourceFile, at: Node): Violation {
  return makeViolation({
    rule: 'TS-enum-interface',
    severity: 'warn',
    file,
    at,
    message: '`interface` — prefer `type` unless you need declaration merging',
  });
}
