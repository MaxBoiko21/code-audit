const TS_FILE = /\.(ts|tsx)$/;
const TEST_FILE = /\.(test|spec)\.(ts|tsx|js|jsx)$/;
const DECLARATION_FILE = /\.d\.ts$/;

export function isSourceTsFile(path: string): boolean {
  if (!TS_FILE.test(path)) { return false; }
  if (TEST_FILE.test(path)) { return false; }
  if (DECLARATION_FILE.test(path)) { return false; }
  return true;
}

export function isTestFile(path: string): boolean {
  return TEST_FILE.test(path);
}
