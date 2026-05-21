import { type SourceFile, type TypeLiteralNode, type ParameterDeclaration, Node } from 'ts-morph';
import type { Violation } from '../../types.ts';
import { inlineDuplicateViolation } from '../_shared/builders/ts-types.ts';

type DupCtx = { file: SourceFile; seen: Set<string>; out: Violation[] };

export function checkDuplicateInlineLiterals(file: SourceFile, out: Violation[]): void {
  const ctx: DupCtx = { file, seen: new Set(), out };
  file.forEachDescendant((node) => {
    if (!Node.isParameterDeclaration(node)) { return; }
    const typeNode = node.getTypeNode();
    if (!typeNode || !Node.isTypeLiteral(typeNode)) { return; }
    pushIfDuplicate(ctx, node, typeNode);
  });
}

function pushIfDuplicate(ctx: DupCtx, param: ParameterDeclaration, typeNode: TypeLiteralNode): void {
  const key = normalizeTypeLiteral(typeNode);
  if (!ctx.seen.has(key)) {
    ctx.seen.add(key);
    return;
  }
  ctx.out.push(inlineDuplicateViolation(ctx.file, param));
}

function normalizeTypeLiteral(literal: TypeLiteralNode): string {
  return literal
    .getProperties()
    .map((p) => p.getText().replace(/\s+/g, ' ').trim())
    .sort()
    .join('|');
}
