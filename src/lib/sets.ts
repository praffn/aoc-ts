export function union<T, U>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a, ...b]);
}

export function intersection<T>(a: Set<T>, b: Set<T>): Set<T> {
  return new Set([...a].filter((x) => b.has(x)));
}
