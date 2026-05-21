import { type SourceFile, SyntaxKind } from 'ts-morph';
import type { Violation } from '../../types.ts';
import { anyKeywordViolation } from '../_shared/builders/r9.ts';

export function checkAnyKeyword(file: SourceFile, out: Violation[]): void {
  file.forEachDescendant((node) => {
    if (node.getKind() !== SyntaxKind.AnyKeyword) { return; }
    out.push(anyKeywordViolation(file, node));
  });
}
