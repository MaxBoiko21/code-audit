const TS_FILE = /\.(ts|tsx)$/;
const TEST_FILE = /\.(test|spec)\.(ts|tsx|js|jsx)$/;

export function isSourceTsFile(path: string): boolean {
  return TS_FILE.test(path) && !TEST_FILE.test(path);
}

export function isTestFile(path: string): boolean {
  return TEST_FILE.test(path);
}
