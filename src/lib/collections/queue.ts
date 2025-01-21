export class Queue<T> {
  #buffer: Array<T>;
  #capacity: number;
  #head = 0;
  #tail = 0;
  #size = 0;

  constructor();
  constructor(initialCapacity: number);
  constructor(initialCapacity = 16) {
    this.#buffer = new Array(initialCapacity);
    this.#capacity = initialCapacity;
  }

  #resize() {
    const newCapacity = this.#capacity << 1;
    const newBuffer = new Array(newCapacity);
    for (let i = 0; i < this.#size; i++) {
      newBuffer[i] = this.#buffer[(this.#head + i) % this.#capacity];
    }

    this.#buffer = newBuffer;
    this.#head = 0;
    this.#tail = this.#size;
    this.#capacity = newCapacity;
  }

  enqueue(value: T) {
    if (this.#size === this.#capacity) {
      this.#resize();
    }
    this.#buffer[this.#tail] = value;
    this.#tail = (this.#tail + 1) % this.#capacity;
    this.#size++;
  }

  dequeue() {
    if (this.#size === 0) {
      throw new Error("Queue is empty");
    }

    const value = this.#buffer[this.#head];
    this.#head = (this.#head + 1) % this.#capacity;
    this.#size--;
    return value;
  }

  peek() {
    if (this.#size === 0) {
      throw new Error("Queue is empty");
    }

    return this.#buffer[this.#head];
  }

  get size() {
    return this.#size;
  }

  isEmpty() {
    return this.#size === 0;
  }
}
