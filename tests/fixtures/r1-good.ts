export function flatGuards(x: number): number {
  if (x <= 0) return 0;
  for (let i = 0; i < x; i++) {
    if (i % 2 === 0) return i;
  }
  return 0;
}
