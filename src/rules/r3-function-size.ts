import type { SourceFile } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { type FunctionLike, getFunctionName, isFunctionLike } from './_shared/function-like.ts';
import { countExecutableLines } from './_shared/line-count.ts';
import { functionSizeViolation } from './_shared/builders/r3.ts';

const WARN_LINES = 30;
const ERROR_LINES = 50;

const rule: Rule = {
  id: 'R3-function-size',
  appliesTo: isSourceTsFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    file.forEachDescendant((node) => {
      if (!isFunctionLike(node)) { return; }
      const lines = countExecutableLines(node.getText());
      if (lines <= WARN_LINES) { return; }
      out.push(buildForFn(file, node, lines));
    });
    return out;
  },
};

function buildForFn(file: SourceFile, fn: FunctionLike, lines: number): Violation {
  const severity = lines > ERROR_LINES ? 'error' : 'warn';
  const target = lines > ERROR_LINES ? ERROR_LINES : WARN_LINES;
  return functionSizeViolation({
    file,
    at: fn,
    name: getFunctionName(fn),
    lines,
    target,
    severity,
  });
}

export default rule;
