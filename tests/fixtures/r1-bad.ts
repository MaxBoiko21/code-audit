export function deepNesting(x: number): number {
  if (x > 0) {
    for (let i = 0; i < x; i++) {
      if (i % 2 === 0) {
        return i;
      }
    }
  }
  return 0;
}

export function elseAfterReturn(x: number): number {
  if (x > 0) {
    return x;
  } else {
    return -x;
  }
}
