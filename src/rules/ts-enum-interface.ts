import { type SourceFile, type InterfaceDeclaration, Node } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { enumViolation, interfaceViolation } from './_shared/builders/ts-enum.ts';

const rule: Rule = {
  id: 'TS-enum-interface',
  appliesTo: isSourceTsFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    for (const e of file.getEnums()) { out.push(enumViolation(file, e)); }
    for (const i of file.getInterfaces()) {
      if (isDeclarationMerging(i)) { continue; }
      out.push(interfaceViolation(file, i));
    }
    return out;
  },
};

function isDeclarationMerging(iface: InterfaceDeclaration): boolean {
  const parent = iface.getParent();
  if (!parent) { return false; }
  return Node.isModuleDeclaration(parent) || Node.isModuleBlock(parent);
}

export default rule;
