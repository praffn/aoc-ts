type Predicate<T> = (value: T) => boolean;

export function slidingWindow<T>(ns: Iterable<T>, size: 2): Generator<[T, T]>;
export function slidingWindow<T>(
  ns: Iterable<T>,
  size: 3
): Generator<[T, T, T]>;
export function slidingWindow<T>(ns: Iterable<T>, size: number): Generator<T[]>;
export function* slidingWindow<T>(
  ns: Iterable<T>,
  size: number
): Generator<T[]> {
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

export function isNonDecreasing(ns: Iterable<number>): boolean {
  return all(slidingWindow(ns, 2), ([a, b]) => a <= b);
}

export function isNonIncreasing(ns: Iterable<number>): boolean {
  return all(slidingWindow(ns, 2), ([a, b]) => a >= b);
}

export function isStrictlyIncreasing(ns: Iterable<number>): boolean {
  return all(slidingWindow(ns, 2), ([a, b]) => a < b);
}

export function isStrictlyDecreasing(ns: Iterable<number>): boolean {
  return all(slidingWindow(ns, 2), ([a, b]) => a > b);
}

export function* permute<T>(it: Iterable<T>): Generator<Array<T>> {
  const arr = Array.from(it);
  const len = arr.length;
  const control = Array(len).fill(0);

  yield arr.slice();

  let i = 0;
  while (i < len) {
    if (control[i] < i) {
      if (i % 2 === 0) {
        const tmp = arr[0];
        arr[0] = arr[i];
        arr[i] = tmp;
      } else {
        const tmp = arr[control[i]];
        arr[control[i]] = arr[i];
        arr[i] = tmp;
      }

      yield arr.slice();
      control[i]++;
      i = 0;
    } else {
      control[i] = 0;
      i++;
    }
  }
}

export function range(end: number): Generator<number>;
export function range(start: number, end: number): Generator<number>;
export function range(
  start: number,
  end: number,
  step: number
): Generator<number>;
export function* range(
  start: number,
  end?: number,
  step = 1
): Generator<number> {
  if (end === undefined) {
    end = start;
    start = 0;
  }

  if (step === 0) {
    throw new Error("Step cannot be zero");
  }

  if (step > 0) {
    for (let i = start; i < end; i += step) {
      yield i;
    }
  } else {
    for (let i = start; i > end; i += step) {
      yield i;
    }
  }
}

export function* cartesianRange(
  xStart: number,
  xEnd: number,
  yStart: number,
  yEnd: number
): Generator<[number, number]> {
  for (const x of range(xStart, xEnd)) {
    for (const y of range(yStart, yEnd)) {
      yield [x, y];
    }
  }
}

export function* chain<T>(...iterables: Array<Iterable<T>>): Generator<T> {
  for (const it of iterables) {
    yield* it;
  }
}

export function* zip<T, U>(
  a: Iterable<T>,
  b: Iterable<U>
): IteratorObject<[T, U]> {
  const itA = a[Symbol.iterator]();
  const itB = b[Symbol.iterator]();

  while (true) {
    const { value: valueA, done: doneA } = itA.next();
    const { value: valueB, done: doneB } = itB.next();

    if (doneA || doneB) {
      return;
    }

    yield [valueA, valueB];
  }
}

export function* enumerate<T>(
  iterable: Iterable<T>
): IteratorObject<[number, T]> {
  return yield* zip(range(0, Infinity), iterable);
}

export function permutations<T>(iterable: Iterable<T>): Iterable<Array<T>>;
export function permutations<T>(
  iterable: Iterable<T>,
  r: number
): Iterable<Array<T>>;
export function* permutations<T>(
  iterable: Iterable<T>,
  r?: number
): Iterable<Array<T>> {
  const items = Array.from(iterable);
  r ??= items.length;

  if (r > items.length) {
    return;
  }

  const indices = Array.from({ length: items.length }, (_, i) => i);
  const cycles = Array.from({ length: r }, (_, i) => items.length - i);

  yield indices.slice(0, r).map((i) => items[i]);

  let n = items.length;
  outer: while (n > 0) {
    for (let i = r - 1; i >= 0; i--) {
      cycles[i]--;
      if (cycles[i] === 0) {
        const [removed] = indices.splice(i, 1);
        indices.push(removed);
        cycles[i] = n - i;
      } else {
        const j = n - cycles[i];
        [indices[i], indices[j]] = [indices[j], indices[i]];
        yield indices.slice(0, r).map((i) => items[i]);
        continue outer;
      }
    }
    return;
  }
}

export function combinations<T>(iterable: Iterable<T>, k: 2): Generator<[T, T]>;
export function combinations<T>(
  iterable: Iterable<T>,
  k: number
): Generator<Array<T>>;
export function* combinations<T>(
  iterable: Iterable<T>,
  k: number
): Generator<Array<T>> {
  const items = Array.isArray(iterable) ? iterable : Array.from(iterable); // Convert the iterable to an array to allow indexing
  const n = items.length;

  // If the number of items to choose is greater than available items, return nothing.
  if (k > n) return;

  // Indices array that tracks the current combination
  const indices = Array.from({ length: k }, (_, i) => i);

  // Yield the first combination
  yield indices.map((i) => items[i]);

  while (true) {
    let i: number;
    // Find the rightmost index that can be incremented
    for (i = k - 1; i >= 0; i--) {
      if (indices[i] !== i + n - k) {
        break;
      }
    }

    // All combinations have been generated
    if (i < 0) return;

    indices[i]++;
    // Reset all subsequent indices
    for (let j = i + 1; j < k; j++) {
      indices[j] = indices[j - 1] + 1;
    }

    // Yield the next combination
    yield indices.map((i) => items[i]);
  }
}

// divisors returns a generator that yields all divisors of n, including 1 and n.
// runtime: O(sqrt(n))
export function* divisors(n: number): Generator<number> {
  const sqrtN = Math.sqrt(n);

  for (let k = 1; k <= sqrtN; k++) {
    if (n % k === 0) {
      yield k;
      const nk = n / k;
      if (k !== nk) {
        yield nk;
      }
    }
  }
}

// product returns a generator that yields the cartesian product of the input iterables.
export function product<A, B>(
  a: Iterable<A>,
  b: Iterable<B>
): Generator<[A, B]>;
export function product<A, B, C>(
  a: Iterable<A>,
  b: Iterable<B>,
  c: Iterable<C>
): Generator<[A, B, C]>;
export function product<A, B, C, D>(
  a: Iterable<A>,
  b: Iterable<B>,
  c: Iterable<C>,
  d: Iterable<D>
): Generator<[A, B, C, D]>;
export function product<T>(
  ...iterables: Array<Iterable<T>>
): Generator<Array<T>>;
export function* product<T>(
  ...iterables: Array<Iterable<T>>
): Generator<Array<T>> {
  if (iterables.length === 0) {
    return yield [];
  }

  const [first, ...rest] = iterables;

  for (const value of first) {
    for (const subproduct of product(...rest)) {
      yield [value, ...subproduct];
    }
  }
}

export function max(ns: Iterable<number>): number | undefined;
export function max(ns: Iterable<number>, defaultValue: number): number;
export function max(
  ns: Iterable<number>,
  defaultValue?: number
): number | undefined {
  let max = -Infinity;
  for (const n of ns) {
    max = Math.max(max, n);
  }
  return max === -Infinity ? defaultValue : max;
}

export function min(ns: Iterable<number>): number | undefined;
export function min(ns: Iterable<number>, defaultValue: number): number;
export function min(
  ns: Iterable<number>,
  defaultValue?: number
): number | undefined {
  let min = Infinity;
  for (const n of ns) {
    min = Math.min(min, n);
  }
  return min === Infinity ? defaultValue : min;
}

export function minBy<T>(
  iterable: Iterable<T>,
  selector: (item: T) => number
): T | undefined {
  let min = Infinity;
  let minItem: T | undefined = undefined;
  for (const item of iterable) {
    const value = selector(item);
    if (value < min) {
      min = value;
      minItem = item;
    }
  }

  return minItem;
}

export function minMax(iterable: Iterable<number>): [number, number] {
  let min = Infinity;
  let max = -Infinity;

  for (const n of iterable) {
    min = Math.min(min, n);
    max = Math.max(max, n);
  }

  return [min, max];
}

export function sum(ns: Iterable<number>): number {
  let sum = 0;
  for (const n of ns) {
    sum += n;
  }
  return sum;
}

export function numericProduct(ns: Iterable<number>): number {
  let product = 1;
  for (const n of ns) {
    product *= n;
  }
  return product;
}

export function count(iterable: Iterable<unknown>): number;
export function count<T>(
  iterable: Iterable<T>,
  predicate: Predicate<T>
): number;
export function count<T>(
  iterable: Iterable<T>,
  predicate?: Predicate<T>
): number {
  let count = 0;
  for (const v of iterable) {
    if (predicate === undefined || predicate(v)) {
      count++;
    }
  }
  return count;
}

export function counter<T>(iterable: Iterable<T>): Map<T, number> {
  const counts = new Map<T, number>();
  for (const item of iterable) {
    counts.set(item, (counts.get(item) ?? 0) + 1);
  }
  return counts;
}

export function* chunk<T>(iterable: Iterable<T>, chunkSize: number) {
  let chunk: Array<T> = [];
  for (const item of iterable) {
    chunk.push(item);
    if (chunk.length === chunkSize) {
      yield chunk;
      chunk = [];
    }
  }
  if (chunk.length > 0) {
    yield chunk;
  }
}

export function* chunkWhile<T>(iterable: Iterable<T>, predicate: Predicate<T>) {
  let chunk: Array<T> = [];
  for (const item of iterable) {
    if (predicate(item)) {
      chunk.push(item);
    } else {
      if (chunk.length > 0) {
        yield chunk;
        chunk = [];
      }
    }
  }

  if (chunk.length > 0) {
    yield chunk;
  }
}

export function* powerSet<T>(iterable: Iterable<T>): Generator<Array<T>> {
  const items = Array.from(iterable);
  const size = 2n ** BigInt(items.length);
  for (let i = 0; i < size; i++) {
    const current = [];
    for (let j = 0; j < items.length; j++) {
      if ((i & (1 << j)) > 0) {
        current.push(items[j]);
      }
    }

    yield current;
  }
}

export function combine<T, U>(a: Iterable<T>, b: Iterable<U>): Generator<T | U>;
export function combine<T, U, V>(
  a: Iterable<T>,
  b: Iterable<U>,
  c: Iterable<V>
): Generator<T | U | V>;
export function combine(
  ...iterables: Array<Iterable<unknown>>
): Generator<unknown>;
export function* combine(
  ...iterables: Array<Iterable<unknown>>
): Generator<unknown> {
  for (const iterable of iterables) {
    yield* iterable;
  }
}
