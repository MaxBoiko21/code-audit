import {
  type SourceFile,
  type TypeNode,
  type TypeLiteralNode,
  type InterfaceDeclaration,
  Node,
} from 'ts-morph';
import { isFlatPropertyType } from './flatness/property-type.ts';

export function hasNestedTypeLiteral(literal: TypeLiteralNode): boolean {
  for (const prop of literal.getProperties()) {
    if (!Node.isPropertySignature(prop)) { continue; }
    const t = prop.getTypeNode();
    if (t && containsTypeLiteral(t)) { return true; }
  }
  return false;
}

export function isFlatLiteral(literal: TypeLiteralNode, file: SourceFile): boolean {
  for (const prop of literal.getProperties()) {
    if (!Node.isPropertySignature(prop)) { continue; }
    const t = prop.getTypeNode();
    if (t && !isFlatPropertyType(t, file)) { return false; }
  }
  return true;
}

export function isFlatInterface(iface: InterfaceDeclaration, file: SourceFile): boolean {
  for (const prop of iface.getProperties()) {
    const t = prop.getTypeNode();
    if (t && !isFlatPropertyType(t, file)) { return false; }
  }
  return true;
}

function containsTypeLiteral(typeNode: TypeNode): boolean {
  if (Node.isTypeLiteral(typeNode)) { return true; }
  let found = false;
  typeNode.forEachDescendant((d, traversal) => {
    if (Node.isTypeLiteral(d)) {
      found = true;
      traversal.stop();
    }
  });
  return found;
}
