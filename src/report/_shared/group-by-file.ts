export function groupByFile<T extends { file: string }>(items: T[]): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    const list = map.get(item.file) ?? [];
    list.push(item);
    map.set(item.file, list);
  }
  return map;
}
