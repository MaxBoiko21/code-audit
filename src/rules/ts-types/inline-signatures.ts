import { type SourceFile, type ParameterDeclaration, Node } from 'ts-morph';
import type { Violation } from '../../types.ts';
import { inlineOversizeViolation, inlineNestedViolation } from '../_shared/builders/ts-types.ts';
import { hasNestedTypeLiteral } from './flatness.ts';

const INLINE_PROP_LIMIT = 3;

export function checkInlineSignatures(file: SourceFile, out: Violation[]): void {
  file.forEachDescendant((node) => {
    if (!Node.isParameterDeclaration(node)) { return; }
    inspectParam(file, node, out);
  });
}

function inspectParam(file: SourceFile, param: ParameterDeclaration, out: Violation[]): void {
  const typeNode = param.getTypeNode();
  if (!typeNode || !Node.isTypeLiteral(typeNode)) { return; }
  const props = typeNode.getProperties();
  if (props.length > INLINE_PROP_LIMIT) {
    out.push(inlineOversizeViolation({ file, at: param, count: props.length, limit: INLINE_PROP_LIMIT }));
    return;
  }
  if (hasNestedTypeLiteral(typeNode)) { out.push(inlineNestedViolation(file, param)); }
}
