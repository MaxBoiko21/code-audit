import { type SourceFile, type Statement, Node } from 'ts-morph';
import type { Rule, Violation } from '../types.ts';
import { isSourceTsFile } from './_shared/applies-to.ts';
import { countExecutableLines } from './_shared/line-count.ts';
import { fileLineViolation, fileUnitViolation } from './_shared/builders/r4.ts';

const WARN_LINES = 150;
const ERROR_LINES = 200;
const MAX_UNITS = 4;

const rule: Rule = {
  id: 'R4-file-size',
  appliesTo: isSourceTsFile,
  check(file: SourceFile): Violation[] {
    const out: Violation[] = [];
    const lines = countExecutableLines(file.getFullText());
    const units = countCognitiveUnits(file);
    if (lines > WARN_LINES) { out.push(buildLineViolation(file, lines)); }
    if (units > MAX_UNITS) { out.push(fileUnitViolation(file, units, MAX_UNITS)); }
    return out;
  },
};

function buildLineViolation(file: SourceFile, lines: number): Violation {
  const severity = lines > ERROR_LINES ? 'error' : 'warn';
  const target = lines > ERROR_LINES ? ERROR_LINES : WARN_LINES;
  return fileLineViolation({ file, lines, target, severity });
}

function countCognitiveUnits(file: SourceFile): number {
  let units = 0;
  for (const stmt of file.getStatements()) { units += unitsForStatement(stmt); }
  return units;
}

function unitsForStatement(stmt: Statement): number {
  if (Node.isFunctionDeclaration(stmt)) { return 1; }
  if (Node.isClassDeclaration(stmt)) { return stmt.getMethods().length; }
  if (Node.isVariableStatement(stmt)) { return countArrowsInside(stmt); }
  return 0;
}

function countArrowsInside(stmt: Node): number {
  let n = 0;
  stmt.forEachDescendant((d) => {
    if (Node.isArrowFunction(d) || Node.isFunctionExpression(d)) { n++; }
  });
  return n;
}

export default rule;
