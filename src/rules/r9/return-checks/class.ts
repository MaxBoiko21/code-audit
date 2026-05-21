import { type SourceFile, type ClassDeclaration, SyntaxKind } from 'ts-morph';
import type { Violation } from '../../../types.ts';
import { missingReturnViolation } from '../../_shared/builders/r9.ts';

export function checkClassMethods(file: SourceFile, cls: ClassDeclaration, out: Violation[]): void {
  if (!cls.isExported()) { return; }
  for (const m of cls.getMethods()) {
    if (m.getReturnTypeNode()) { continue; }
    if (m.hasModifier(SyntaxKind.PrivateKeyword)) { continue; }
    out.push(missingReturnViolation(file, m, m.getName()));
  }
}
