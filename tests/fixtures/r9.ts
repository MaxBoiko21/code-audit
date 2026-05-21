export function withAny(x: any): number {
  return x;
}

export function missingReturn(x: number) {
  return x + 1;
}

export const arrowMissing = (x: number) => x + 1;

export function withChainCast(raw: string): number {
  return raw as unknown as number;
}

export function ok(x: number): number {
  return x;
}
