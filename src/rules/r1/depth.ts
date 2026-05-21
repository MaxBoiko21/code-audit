import { type SourceFile, type Node, SyntaxKind } from 'ts-morph';
import type { Violation } from '../../types.ts';
import { depthViolation } from '../_shared/builders/r1.ts';

const MAX_DEPTH = 2;
const NESTING_KINDS = new Set<SyntaxKind>([
  SyntaxKind.IfStatement,
  SyntaxKind.ForStatement,
  SyntaxKind.ForInStatement,
  SyntaxKind.ForOfStatement,
  SyntaxKind.WhileStatement,
  SyntaxKind.DoStatement,
  SyntaxKind.TryStatement,
  SyntaxKind.SwitchStatement,
]);

type WalkCtx = { file: SourceFile; out: Violation[] };

export function walkDepth(file: SourceFile, body: Node, out: Violation[]): void {
  recurse({ file, out }, body, 0);
}

function recurse(ctx: WalkCtx, node: Node, depth: number): void {
  node.forEachChild((child) => {
    const isNesting = NESTING_KINDS.has(child.getKind());
    const nextDepth = isNesting ? depth + 1 : depth;
    if (isNesting && nextDepth > MAX_DEPTH) {
      ctx.out.push(depthViolation({ file: ctx.file, at: child, depth: nextDepth, limit: MAX_DEPTH }));
    }
    recurse(ctx, child, nextDepth);
  });
}
