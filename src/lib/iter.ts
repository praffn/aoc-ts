type Predicate<T> = (value: T) => boolean;

export function slidingWindow<T>(ns: Iterable<T>, size: 2): Generator<[T, T]>;
export function slidingWindow<T>(ns: Iterable<T>, size: number): Generator<T[]>;
export function* slidingWindow<T>(
  ns: Iterable<T>,
  size: number
): Generator<T[]> {
  if (size < 2) {
    throw new Error("Size must be at least 2");
  }

  const buffer: Array<T> = [];

  const it = ns[Symbol.iterator]();
  let next = it.next();

  while (!next.done && buffer.length < size) {
    buffer.push(next.value);
    next = it.next();
  }

  while (!next.done) {
    yield buffer.slice();
    buffer.shift();
    buffer.push(next.value);
    next = it.next();
  }

  if (buffer.length === size) {
    yield buffer;
  }
}

export function all<T>(it: Iterable<T>, predicate: Predicate<T>): boolean {
  for (const value of it) {
    if (!predicate(value)) {
      return false;
    }
  }

  return true;
}

export function isMonotonic(ns: Iterable<number>): boolean {
  return isStrictlyDecreasing(ns) || isStrictlyIncreasing(ns);
}

export function isStrictlyIncreasing(ns: Iterable<number>): boolean {
  return all(slidingWindow(ns, 2), ([a, b]) => a < b);
}

export function isStrictlyDecreasing(ns: Iterable<number>): boolean {
  return all(slidingWindow(ns, 2), ([a, b]) => a > b);
}
