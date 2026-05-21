import {
  type SourceFile,
  type TypeAliasDeclaration,
  type InterfaceDeclaration,
  Node,
} from 'ts-morph';
import type { Violation } from '../../types.ts';
import { notFlatLocalViolation } from '../_shared/builders/ts-types.ts';
import { isFlatLiteral, isFlatInterface } from './flatness.ts';

export function checkFlatLocalTypes(file: SourceFile, out: Violation[]): void {
  if (!hasRuntimeCode(file)) { return; }
  for (const alias of file.getTypeAliases()) { checkAlias(file, alias, out); }
  for (const iface of file.getInterfaces()) { checkIface(file, iface, out); }
}

function hasRuntimeCode(file: SourceFile): boolean {
  for (const stmt of file.getStatements()) {
    if (Node.isFunctionDeclaration(stmt)) { return true; }
    if (Node.isClassDeclaration(stmt)) { return true; }
    if (Node.isVariableStatement(stmt)) { return true; }
    if (Node.isExpressionStatement(stmt)) { return true; }
  }
  return false;
}

function checkAlias(file: SourceFile, alias: TypeAliasDeclaration, out: Violation[]): void {
  const typeNode = alias.getTypeNode();
  if (!typeNode || !Node.isTypeLiteral(typeNode)) { return; }
  if (isFlatLiteral(typeNode, file)) { return; }
  out.push(notFlatLocalViolation(file, alias, alias.getName()));
}

function checkIface(file: SourceFile, iface: InterfaceDeclaration, out: Violation[]): void {
  if (isFlatInterface(iface, file)) { return; }
  out.push(notFlatLocalViolation(file, iface, iface.getName()));
}
