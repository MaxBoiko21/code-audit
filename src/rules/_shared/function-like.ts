import {
  type FunctionDeclaration,
  type FunctionExpression,
  type ArrowFunction,
  type MethodDeclaration,
  Node,
} from 'ts-morph';

export type FunctionLike =
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunction
  | MethodDeclaration;

export function isFunctionLike(node: Node): node is FunctionLike {
  return (
    Node.isFunctionDeclaration(node) ||
    Node.isFunctionExpression(node) ||
    Node.isArrowFunction(node) ||
    Node.isMethodDeclaration(node)
  );
}

export function getFunctionName(node: FunctionLike): string {
  if (Node.isFunctionDeclaration(node)) { return node.getName() ?? '<anonymous>'; }
  if (Node.isMethodDeclaration(node)) { return node.getName(); }
  if (Node.isFunctionExpression(node)) { return node.getName() ?? '<anonymous>'; }
  return getArrowName(node);
}

function getArrowName(arrow: ArrowFunction): string {
  const parent = arrow.getParent();
  if (Node.isVariableDeclaration(parent)) { return parent.getName(); }
  if (Node.isPropertyAssignment(parent)) { return parent.getName(); }
  return '<anonymous>';
}
