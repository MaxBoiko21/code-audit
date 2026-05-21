import type { SourceFile } from 'ts-morph';
import type { Severity, Violation } from '../../../types.ts';
import { fileLevel } from '../violations.ts';

export type FileLineInput = {
  file: SourceFile;
  lines: number;
  target: number;
  severity: Severity;
};

export function fileLineViolation(input: FileLineInput): Violation {
  return fileLevel({
    rule: 'R4-file-size',
    severity: input.severity,
    file: input.file,
    message: `file has ${input.lines} executable lines (target <= ${input.target})`,
  });
}

export function fileUnitViolation(file: SourceFile, units: number, max: number): Violation {
  return fileLevel({
    rule: 'R4-file-size',
    severity: 'warn',
    file,
    message: `file has ${units} cognitive units (target <= ${max})`,
  });
}
