import { type Node, type SourceFile, Node as N } from 'ts-morph';
import type { Violation } from '../../types.ts';
import { checkClassMethods } from './return-checks/class.ts';
import { checkFunction } from './return-checks/function.ts';
import { checkVariableArrows } from './return-checks/variable.ts';

export function checkMissingExportReturnType(file: SourceFile, out: Violation[]): void {
    for (const stmt of file.getStatements()) {
        dispatch(file, stmt, out)
    };
}

function dispatch(file: SourceFile, stmt: Node, out: Violation[]): void {
    if (N.isFunctionDeclaration(stmt)) { return checkFunction(file, stmt, out); }
    if (N.isClassDeclaration(stmt)) { return checkClassMethods(file, stmt, out); }
    if (N.isVariableStatement(stmt)) { return checkVariableArrows(file, stmt, out); }
}
