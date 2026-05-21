import { type SourceFile, type InterfaceDeclaration, Node } from 'ts-morph';
import type { Rule, RuleContext, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { enumViolation, interfaceViolation } from './_shared/builders/ts-enum.ts';

const rule: Rule = {
  id: 'TS-enum-interface',
  appliesTo: isSourceTsFile,
  check(file: SourceFile, ctx: RuleContext): Violation[] {
    const out: Violation[] = [];
    for (const e of file.getEnums()) { out.push(enumViolation(file, e)); }
    for (const i of file.getInterfaces()) {
      if (isDeclarationMerging(i, ctx)) { continue; }
      out.push(interfaceViolation(file, i));
    }
    return out;
  },
};

function isDeclarationMerging(iface: InterfaceDeclaration, ctx: RuleContext): boolean {
  const parent = iface.getParent();
  if (parent && (Node.isModuleDeclaration(parent) || Node.isModuleBlock(parent))) {
    return true;
  }
  const count = ctx.interfaceNameCounts.get(iface.getName()) ?? 0;
  return count >= 2;
}

export default rule;
