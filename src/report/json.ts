import type { Violation } from '../types.ts';

export function formatJson(violations: Violation[]): string {
  const payload = {
    total: violations.length,
    errors: violations.filter((v) => v.severity === 'error').length,
    warnings: violations.filter((v) => v.severity === 'warn').length,
    violations,
  };
  return JSON.stringify(payload, null, 2);
}
