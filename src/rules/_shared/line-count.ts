// Count executable lines in a block of source text.
// Excludes blank lines and standalone comments (// and /* */).
export function countExecutableLines(text: string): number {
  const lines = text.split('\n');
  let count = 0;
  let inBlock = false;
  for (const raw of lines) {
    const line = raw.trim();
    const next = classifyLine(line, inBlock);
    inBlock = next.inBlock;
    if (next.executable) { count++; }
  }
  return count;
}

type LineState = { inBlock: boolean; executable: boolean };

function classifyLine(line: string, inBlock: boolean): LineState {
  if (inBlock) { return { inBlock: !line.includes('*/'), executable: false }; }
  if (line === '' || line.startsWith('//')) { return { inBlock: false, executable: false }; }
  if (line.startsWith('/*')) { return { inBlock: !line.includes('*/'), executable: false }; }
  return { inBlock: false, executable: true };
}
