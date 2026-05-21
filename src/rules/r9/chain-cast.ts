import { type SourceFile, Node } from 'ts-morph';
import type { Violation } from '../../types.ts';
import { chainCastViolation } from '../_shared/builders/r9.ts';

export function checkUnknownChainCast(file: SourceFile, out: Violation[]): void {
  file.forEachDescendant((node) => {
    if (!Node.isAsExpression(node)) { return; }
    const inner = node.getExpression();
    if (!Node.isAsExpression(inner)) { return; }
    if (inner.getTypeNode()?.getText() !== 'unknown') { return; }
    out.push(chainCastViolation(file, node));
  });
}
