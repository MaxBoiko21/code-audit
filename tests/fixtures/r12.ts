export function bad(x: number, items: number[]): number {
  if (x <= 0) return 0;
  for (const i of items) console.log(i);
  while (x > 100) x--;
  if (x > 50) {
    return 50;
  } else return x;
  return x;
}

export function good(x: number, items: number[]): number {
  if (x <= 0) {
    return 0;
  }
  for (const i of items) {
    console.log(i);
  }
  while (x > 100) {
    x--;
  }
  if (x > 50) {
    return 50;
  } else {
    return x;
  }
}

export function elseIfChainIsOk(x: number): string {
  if (x < 0) {
    return 'neg';
  } else if (x === 0) {
    return 'zero';
  } else {
    return 'pos';
  }
}
