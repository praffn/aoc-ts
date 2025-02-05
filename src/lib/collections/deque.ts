/**
 * A double-ended queue (deque) implementation.
 */
export class Deque<T> {
  #capacity = 4;
  #size = 0;
  #data = new Array<T | undefined>(this.#capacity);
  #front = 0;
  #back = 0;

  #resize(newCapacity: number) {
    const newData = new Array<T | undefined>(newCapacity);
    for (let i = 0; i < this.#size; i++) {
      newData[i] = this.#data[(this.#front + i) % this.#capacity];
    }
    this.#data = newData;
    this.#capacity = newCapacity;
    this.#front = 0;
    this.#back = this.#size;
  }

  /**
   * Pushed the value to the front of the deque.
   */
  pushFront(value: T) {
    if (this.#size === this.#capacity) {
      this.#resize(this.#capacity << 1);
    }

    this.#front = (this.#front - 1 + this.#capacity) % this.#capacity;
    this.#data[this.#front] = value;
    this.#size++;
  }

  /**
   * Pushed the value to the back of the deque.
   */
  pushBack(value: T) {
    if (this.#size === this.#capacity) {
      this.#resize(this.#capacity << 1);
    }

    this.#data[this.#back] = value;
    this.#back = (this.#back + 1) % this.#capacity;
    this.#size++;
  }

  /**
   * Returns and removes the value at the front of the deque.
   * Throws an error if the deque is empty.
   */
  popFront(): T {
    if (this.#size === 0) {
      throw new Error("Deque is empty");
    }

    const value = this.#data[this.#front]!;
    this.#data[this.#front] = undefined;
    this.#front = (this.#front + 1) % this.#capacity;
    this.#size--;

    if (this.#size > 0 && this.#size <= this.#capacity >> 2) {
      this.#resize(Math.max(this.#capacity >> 1, 32));
    }

    return value;
  }

  /**
   * Returns the value at the front of the deque without removing it.
   * Throws an error if the deque is empty.
   */
  peekFront(): T {
    if (this.#size === 0) {
      throw new Error("Deque is empty");
    }

    return this.#data[this.#front]!;
  }

  /**
   * Returns and removes the value at the back of the deque.
   * Throws an error if the deque is empty.
   */
  popBack(): T {
    if (this.#size === 0) {
      throw new Error("Deque is empty");
    }

    this.#back = (this.#back - 1 + this.#capacity) % this.#capacity;
    const value = this.#data[this.#back]!;
    this.#data[this.#back] = undefined;
    this.#size--;

    if (this.#size > 0 && this.#size <= this.#capacity >> 2) {
      this.#resize(Math.max(this.#capacity >> 1, 32));
    }

    return value;
  }

  /**
   * Returns the value at the back of the deque without removing it.
   */
  peekBack(): T {
    if (this.#size === 0) {
      throw new Error("Deque is empty");
    }

    return this.#data[(this.#back - 1 + this.#capacity) % this.#capacity]!;
  }

  /**
   * Returns a new deque with the elements from `start` to `end`.
   */
  slice(start: number, end: number) {
    const newDeque = new Deque<T>();
    for (let i = start; i < end; i++) {
      const index = (this.#front + i) % this.#capacity;
      newDeque.pushBack(this.#data[index]!);
    }

    return newDeque;
  }

  /**
   * Return a new shallow clone of the deque.
   */
  clone() {
    return this.slice(0, this.#size);
  }

  /**
   * Returns the number of elements in the deque.
   */
  get size() {
    return this.#size;
  }

  /**
   * Returns true if the deque is empty.
   */
  isEmpty() {
    return this.#size === 0;
  }

  toString(): string;
  toString(separator: string): string;
  toString(separator = ","): string {
    return [...this].join(separator);
  }

  /**
   * Returns a new deque with the elements mapped by the given function.
   * The newly mapped elements stay in order.
   */
  map<U>(fn: (value: T, index: number) => U): Deque<U> {
    const newDeque = new Deque<U>();
    for (let i = 0; i < this.#size; i++) {
      const index = (this.#front + i) % this.#capacity;
      newDeque.pushBack(fn(this.#data[index]!, i));
    }
    return newDeque;
  }

  /**
   * Iterates over the elements of the deque, front to back.
   * No elements are removed from the deque.
   */
  *[Symbol.iterator]() {
    for (let i = 0; i < this.#size; i++) {
      const index = (this.#front + i) % this.#capacity;
      yield this.#data[index]!;
    }
  }
}
