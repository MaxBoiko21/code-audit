export function compactRanges(sorted: number[]): string {
  const [first, ...rest] = sorted;
  if (first === undefined) { return ''; }
  const parts: string[] = [];
  let start = first;
  let prev = first;
  for (const n of rest) {
    if (n === prev || n === prev + 1) { prev = n; continue; }
    parts.push(formatRange(start, prev));
    start = n;
    prev = n;
  }
  parts.push(formatRange(start, prev));
  return parts.join(', ');
}

function formatRange(start: number, end: number): string {
  if (start === end) { return String(start); }
  return `${start}-${end}`;
}
