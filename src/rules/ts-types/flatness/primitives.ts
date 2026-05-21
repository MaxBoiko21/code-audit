import { SyntaxKind } from 'ts-morph';

export const PRIMITIVE_KEYWORDS = new Set<SyntaxKind>([
  SyntaxKind.StringKeyword,
  SyntaxKind.NumberKeyword,
  SyntaxKind.BooleanKeyword,
  SyntaxKind.BigIntKeyword,
  SyntaxKind.NullKeyword,
  SyntaxKind.UndefinedKeyword,
  SyntaxKind.SymbolKeyword,
  SyntaxKind.VoidKeyword,
]);

export const PRIMITIVE_REFS = new Set(['Date', 'RegExp', 'URL']);

export const PRIMITIVE_GENERICS = new Set([
  'Array',
  'ReadonlyArray',
  'Promise',
  'Set',
  'Map',
  'Readonly',
  'Partial',
  'Record',
]);
