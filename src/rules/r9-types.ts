import type { SourceFile } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { checkAnyKeyword } from './r9/any-keyword.ts';
import { checkUnknownChainCast } from './r9/chain-cast.ts';
import { checkMissingExportReturnType } from './r9/missing-return.ts';

const rule: Rule = {
  id: 'R9-types',
  appliesTo: isSourceTsFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    checkAnyKeyword(file, out);
    checkUnknownChainCast(file, out);
    checkMissingExportReturnType(file, out);
    return out;
  },
};

export default rule;
