import { type SourceFile, type TypeNode, Node } from 'ts-morph';
import { PRIMITIVE_KEYWORDS, PRIMITIVE_REFS, PRIMITIVE_GENERICS } from './primitives.ts';

export function isFlatPropertyType(typeNode: TypeNode, file: SourceFile): boolean {
  if (PRIMITIVE_KEYWORDS.has(typeNode.getKind())) { return true; }
  if (Node.isLiteralTypeNode(typeNode)) { return true; }
  if (Node.isUnionTypeNode(typeNode)) {
    return typeNode.getTypeNodes().every((t) => isFlatPropertyType(t, file));
  }
  if (Node.isArrayTypeNode(typeNode)) {
    return isFlatPropertyType(typeNode.getElementTypeNode(), file);
  }
  if (Node.isTypeReference(typeNode)) { return isFlatTypeReference(typeNode, file); }
  return false;
}

function isFlatTypeReference(typeNode: TypeNode, file: SourceFile): boolean {
  if (!Node.isTypeReference(typeNode)) { return false; }
  const name = typeNode.getTypeName().getText();
  if (PRIMITIVE_REFS.has(name)) { return true; }
  if (PRIMITIVE_GENERICS.has(name)) {
    return typeNode.getTypeArguments().every((a) => isFlatPropertyType(a, file));
  }
  return !isLocalTypeReference(name, file);
}

function isLocalTypeReference(name: string, file: SourceFile): boolean {
  if (file.getTypeAlias(name)) { return true; }
  if (file.getInterface(name)) { return true; }
  return false;
}
