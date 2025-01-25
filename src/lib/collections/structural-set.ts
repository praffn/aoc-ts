type PrimitiveKey = string | number | symbol;
type KeyFn<T> = (value: T) => PrimitiveKey;

export class StructuralSet<T> {
  #set: Map<PrimitiveKey, T>;
  #keyFn: KeyFn<T>;

  constructor(keyFn: KeyFn<T>);
  constructor(keyFn: KeyFn<T>, entries: Iterable<T>);
  constructor(keyFn: KeyFn<T>, entries?: Iterable<T>) {
    this.#set = new Map();
    this.#keyFn = keyFn;

    if (entries) {
      for (const entry of entries) {
        this.add(entry);
      }
    }
  }

  key(value: T) {
    return this.#keyFn(value);
  }

  clone() {
    return new StructuralSet(this.#keyFn, this.#set.values());
  }

  add(value: T) {
    this.#set.set(this.key(value), value);
  }

  has(value: T) {
    return this.#set.has(this.key(value));
  }

  delete(value: T) {
    return this.#set.delete(this.key(value));
  }

  clear() {
    this.#set.clear();
  }

  get size() {
    return this.#set.size;
  }

  collect() {
    return Array.from(this.#set.values());
  }

  values() {
    return this.#set.values();
  }

  [Symbol.iterator]() {
    return this.#set.values();
  }
}
