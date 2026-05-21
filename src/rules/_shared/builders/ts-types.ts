import type { Node, SourceFile } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { makeViolation } from '../violations.ts';

export type InlineOversizeInput = {
  file: SourceFile;
  at: Node;
  count: number;
  limit: number;
};

export function inlineOversizeViolation(input: InlineOversizeInput): Violation {
  return makeViolation({
    rule: 'TS-types-placement',
    severity: 'warn',
    file: input.file,
    at: input.at,
    message: `inline object type has ${input.count} properties (limit ${input.limit}) — move to <domain>/types.ts`,
  });
}

export function inlineNestedViolation(file: SourceFile, at: Node): Violation {
  return makeViolation({
    rule: 'TS-types-placement',
    severity: 'warn',
    file,
    at,
    message: 'inline object type contains nested object — move to <domain>/types.ts',
  });
}

export function inlineDuplicateViolation(file: SourceFile, at: Node): Violation {
  return makeViolation({
    rule: 'TS-types-placement',
    severity: 'warn',
    file,
    at,
    message: 'inline object type duplicates an earlier signature — extract to a named type',
  });
}

export function notFlatLocalViolation(file: SourceFile, at: Node, name: string): Violation {
  return makeViolation({
    rule: 'TS-types-placement',
    severity: 'warn',
    file,
    at,
    message: `local type ${name} is not flat — nested objects or local type refs — move to <domain>/types.ts`,
  });
}
