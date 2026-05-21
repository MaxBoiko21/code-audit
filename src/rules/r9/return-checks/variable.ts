import { type SourceFile, type VariableStatement, Node } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { missingReturnViolation } from '../../_shared/builders/r9.ts';

export function checkVariableArrows(
  file: SourceFile,
  stmt: VariableStatement,
  out: Violation[],
): void {
  if (!stmt.isExported()) { return; }
  for (const decl of stmt.getDeclarations()) {
    if (decl.getTypeNode()) { continue; }
    const init = decl.getInitializer();
    if (!init) { continue; }
    if (!Node.isArrowFunction(init) && !Node.isFunctionExpression(init)) { continue; }
    if (init.getReturnTypeNode()) { continue; }
    out.push(missingReturnViolation(file, decl, decl.getName()));
  }
}
