import { type SourceFile, type Node, type Statement, Node as N } from 'ts-morph';
import type { Violation } from '../../types.ts';
import { elseAfterReturnViolation } from '../_shared/builders/r1.ts';

export function walkElseAfterReturn(file: SourceFile, root: Node, out: Violation[]): void {
  root.forEachDescendant((node) => {
    if (!N.isIfStatement(node)) { return; }
    const elseStmt = node.getElseStatement();
    if (!elseStmt) { return; }
    if (!thenBranchExitsEarly(node.getThenStatement())) { return; }
    out.push(elseAfterReturnViolation(file, elseStmt));
  });
}

function thenBranchExitsEarly(stmt: Statement): boolean {
  if (N.isReturnStatement(stmt) || N.isThrowStatement(stmt)) { return true; }
  if (!N.isBlock(stmt)) { return false; }
  const stmts = stmt.getStatements();
  const last = stmts[stmts.length - 1];
  if (!last) { return false; }
  return N.isReturnStatement(last) || N.isThrowStatement(last);
}
