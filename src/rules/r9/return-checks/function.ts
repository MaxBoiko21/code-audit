import type { SourceFile, FunctionDeclaration } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { missingReturnViolation } from '../../_shared/builders/r9.ts';

export function checkFunction(file: SourceFile, fn: FunctionDeclaration, out: Violation[]): void {
  if (!fn.isExported()) { return; }
  if (fn.getReturnTypeNode()) { return; }
  out.push(missingReturnViolation(file, fn, fn.getName() ?? '<anonymous>'));
}
