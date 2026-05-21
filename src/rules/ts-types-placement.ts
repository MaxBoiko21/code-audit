import type { SourceFile } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { checkInlineSignatures } from './ts-types/inline-signatures.ts';
import { checkDuplicateInlineLiterals } from './ts-types/duplicate-inline.ts';
import { checkFlatLocalTypes } from './ts-types/flat-local.ts';

const rule: Rule = {
  id: 'TS-types-placement',
  appliesTo: isSourceTsFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    checkInlineSignatures(file, out);
    checkDuplicateInlineLiterals(file, out);
    checkFlatLocalTypes(file, out);
    return out;
  },
};

export default rule;
