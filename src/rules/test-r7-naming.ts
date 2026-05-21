import { type SourceFile, type CallExpression, Node } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isTestFile } from './_shared/applies-to.ts';
import { testNameViolation } from './_shared/builders/test-r7.ts';

const TEST_CALLEES = new Set(['describe', 'it', 'test']);

const rule: Rule = {
  id: 'TEST-R7-naming',
  appliesTo: isTestFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    file.forEachDescendant((node) => {
      if (!Node.isCallExpression(node)) { return; }
      if (!isTestCall(node)) { return; }
      const label = readFirstStringArg(node);
      if (label === null) { return; }
      if (startsWithFeatureNoun(label)) { return; }
      out.push(testNameViolation(file, node, label));
    });
    return out;
  },
};

function isTestCall(call: CallExpression): boolean {
  const expr = call.getExpression();
  if (Node.isIdentifier(expr)) { return TEST_CALLEES.has(expr.getText()); }
  if (Node.isPropertyAccessExpression(expr)) {
    return TEST_CALLEES.has(expr.getExpression().getText());
  }
  return false;
}

function readFirstStringArg(call: CallExpression): string | null {
  const first = call.getArguments()[0];
  if (!first) { return null; }
  if (Node.isStringLiteral(first) || Node.isNoSubstitutionTemplateLiteral(first)) {
    return first.getLiteralText();
  }
  return null;
}

const FEATURE_ANCHOR = /^[A-Za-z_]\w*[:\-]?$/;

function startsWithFeatureNoun(label: string): boolean {
  const first = label.trim().split(/\s+/)[0];
  if (!first) { return false; }
  return FEATURE_ANCHOR.test(first);
}

export default rule;
