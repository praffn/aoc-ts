type PrimitiveKey = string | number | bigint | symbol;
type KeyFn<T> = (value: T) => PrimitiveKey;

type StructuralMapEntry<K, V> = {
  key: K;
  value: V;
};

export class StructuralMap<K, V> {
  #map: Map<PrimitiveKey, StructuralMapEntry<K, V>>;
  #keyFn: KeyFn<K>;

  constructor(keyFn: KeyFn<K>);
  constructor(keyFn: KeyFn<K>, entries: Iterable<[K, V]>);
  constructor(keyFn: KeyFn<K>, entries?: Iterable<[K, V]>) {
    this.#map = new Map();
    this.#keyFn = keyFn;

    if (entries) {
      for (const [key, value] of entries) {
        this.set(key, value);
      }
    }
  }

  key(value: K) {
    return this.#keyFn(value);
  }

  set(key: K, value: V) {
    this.#map.set(this.key(key), {
      key,
      value,
    });
  }

  get(key: K) {
    return this.#map.get(this.key(key))?.value;
  }

  getOrDefault(key: K, defaultValue: V): V;
  getOrDefault(key: K, defaultFactory: () => V): V;
  getOrDefault(key: K, defaultValueOrFactory: V | (() => V)) {
    const entry = this.#map.get(this.key(key));
    if (entry) {
      return entry.value;
    }

    const value =
      typeof defaultValueOrFactory === "function"
        ? (defaultValueOrFactory as () => V)()
        : defaultValueOrFactory;
    this.set(key, value);
    return value;
  }

  update(key: K, updater: (value: V) => V): void;
  update(key: K, updater: (value: V) => V, defaultValue: V): void;
  update(key: K, updater: (value: V) => V, defaultValue?: V) {
    const entry = this.#map.get(this.key(key));
    if (entry) {
      entry.value = updater(entry.value);
      return;
    }

    if (defaultValue !== undefined) {
      this.set(key, updater(defaultValue));
    }
  }

  delete(key: K) {
    return this.#map.delete(this.key(key));
  }

  clear() {
    this.#map.clear();
  }

  get size() {
    return this.#map.size;
  }

  has(key: K) {
    return this.#map.has(this.key(key));
  }

  keys() {
    return this.#map.values().map((entry) => entry.key);
  }

  values() {
    return this.#map.values().map((entry) => entry.value);
  }

  entries() {
    return this.#map.values().map((entry) => [entry.key, entry.value] as const);
  }

  increment(this: StructuralMap<K, number>, key: K, amount = 1) {
    const current = this.get(key) ?? 0;
    const newAmount = current + amount;
    this.set(key, newAmount);
    return newAmount;
  }

  decrement(this: StructuralMap<K, number>, key: K, amount = 1) {
    this.increment(key, -amount);
  }

  forEach(callback: (value: V, key: K) => void) {
    for (const entry of this.#map.values()) {
      callback(entry.value, entry.key);
    }
  }

  filter(predicate: (value: V, key: K) => boolean) {
    const result = new StructuralMap<K, V>(this.#keyFn);
    for (const entry of this.#map.values()) {
      if (predicate(entry.value, entry.key)) {
        result.set(entry.key, entry.value);
      }
    }

    return result;
  }

  [Symbol.iterator]() {
    return this.entries();
  }
}
