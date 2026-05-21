import { type SourceFile, type Statement, type Node, Node as N } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { blockBodyViolation } from './_shared/builders/r12.ts';

const rule: Rule = {
  id: 'R12-block-bodies',
  appliesTo: isSourceTsFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    file.forEachDescendant((node) => {
      checkNode(file, node, out);
    });
    return out;
  },
};

type CheckCtx = { file: SourceFile; out: Violation[] };

function checkNode(file: SourceFile, node: Node, out: Violation[]): void {
  const ctx: CheckCtx = { file, out };
  if (N.isIfStatement(node)) {
    requireBlock(ctx, { stmt: node.getThenStatement(), construct: 'if' });
    const elseStmt = node.getElseStatement();
    if (elseStmt && !N.isIfStatement(elseStmt)) {
      requireBlock(ctx, { stmt: elseStmt, construct: 'else' });
    }
    return;
  }
  if (N.isForStatement(node) || N.isForInStatement(node) || N.isForOfStatement(node)) {
    requireBlock(ctx, { stmt: node.getStatement(), construct: 'for' });
    return;
  }
  if (N.isWhileStatement(node) || N.isDoStatement(node)) {
    const construct = N.isWhileStatement(node) ? 'while' : 'do-while';
    requireBlock(ctx, { stmt: node.getStatement(), construct });
  }
}

type RequireBlockInput = { stmt: Statement; construct: string };

function requireBlock(ctx: CheckCtx, input: RequireBlockInput): void {
  if (N.isBlock(input.stmt)) {
    return;
  }
  ctx.out.push(blockBodyViolation(ctx.file, input.stmt, input.construct));
}

export default rule;
