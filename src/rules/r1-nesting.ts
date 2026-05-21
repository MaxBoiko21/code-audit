import { type SourceFile, Node } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { type FunctionLike, isFunctionLike } from './_shared/function-like.ts';
import { walkDepth } from './r1/depth.ts';
import { walkElseAfterReturn } from './r1/else-after-return.ts';

const rule: Rule = {
  id: 'R1-nesting',
  appliesTo: isSourceTsFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    file.forEachDescendant((node) => {
      if (!isFunctionLike(node)) { return; }
      checkFunction(file, node, out);
    });
    return out;
  },
};

function checkFunction(file: SourceFile, fn: FunctionLike, out: Violation[]): void {
  const body = fn.getBody();
  if (!body || !Node.isBlock(body)) { return; }
  walkDepth(file, body, out);
  walkElseAfterReturn(file, body, out);
}

export default rule;
