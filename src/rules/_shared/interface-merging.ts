import type { SourceFile } from 'ts-morph';

const DECLARATION_FILE = /\.d\.ts$/;

export function buildInterfaceNameCounts(files: SourceFile[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const file of files) {
    if (DECLARATION_FILE.test(file.getFilePath())) { continue; }
    tallyFile(file, counts);
  }
  return counts;
}

function tallyFile(file: SourceFile, counts: Map<string, number>): void {
  const seen = new Set<string>();
  for (const iface of file.getInterfaces()) {
    const name = iface.getName();
    if (seen.has(name)) { continue; }
    seen.add(name);
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
}
