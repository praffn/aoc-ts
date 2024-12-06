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

export function* combinations<T>(
  elements: Array<T>,
  k: number
): Generator<Array<T>> {
  if (k === 0) {
    yield [];
  } else if (k === elements.length) {
    yield elements;
  } else {
    const [first, ...rest] = elements;
    yield* combinations(rest, k);
    yield* combinations(rest, k - 1).map((c) => [first, ...c]);
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
