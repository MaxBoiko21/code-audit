import type { SourceFile } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { isFunctionLike } from './_shared/function-like.ts';
import { paramCountViolation } from './_shared/builders/r7.ts';

const MAX_PARAMS = 3;

const rule: Rule = {
  id: 'R7-params',
  appliesTo: isSourceTsFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    file.forEachDescendant((node) => {
      if (!isFunctionLike(node)) { return; }
      const count = node.getParameters().length;
      if (count <= MAX_PARAMS) { return; }
      out.push(paramCountViolation({ file, at: node, count, limit: MAX_PARAMS }));
    });
    return out;
  },
};

export default rule;
