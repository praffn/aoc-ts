export type Comparator<T> = (a: T, b: T) => number;

export class ComparePriorityQueue<T> {
  #heap: Array<T> = [];
  #compare: Comparator<T>;

  constructor(compare: Comparator<T>) {
    this.#compare = compare;
  }

  #parentIndex(index: number) {
    return Math.floor((index - 1) / 2);
  }

  #leftChildIndex(index: number) {
    return 2 * index + 1;
  }

  #rightChildIndex(index: number) {
    return 2 * index + 2;
  }

  #swap(i: number, j: number) {
    const temp = this.#heap[i];
    this.#heap[i] = this.#heap[j];
    this.#heap[j] = temp;
  }

  #heapifyUp(index: number) {
    while (
      index > 0 &&
      this.#compare(this.#heap[index], this.#heap[this.#parentIndex(index)]) < 0
    ) {
      this.#swap(index, this.#parentIndex(index));
      index = this.#parentIndex(index);
    }
  }

  #heapifyDown(index: number) {
    let smallest = index;
    const left = this.#leftChildIndex(index);
    const right = this.#rightChildIndex(index);

    if (
      left < this.#heap.length &&
      this.#compare(this.#heap[left], this.#heap[smallest]) < 0
    ) {
      smallest = left;
    }

    if (
      right < this.#heap.length &&
      this.#compare(this.#heap[right], this.#heap[smallest]) < 0
    ) {
      smallest = right;
    }

    if (smallest !== index) {
      this.#swap(index, smallest);
      this.#heapifyDown(smallest);
    }
  }

  enqueue(value: T) {
    this.#heap.push(value);
    this.#heapifyUp(this.#heap.length - 1);
  }

  enqueueAll(items: Iterable<T>) {
    for (const value of items) {
      this.enqueue(value);
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("PriorityQueue is empty");
    }

    if (this.#heap.length === 1) {
      return this.#heap.pop()!;
    }

    const root = this.#heap[0];
    this.#heap[0] = this.#heap.pop()!;
    this.#heapifyDown(0);
    return root;
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("PriorityQueue is empty");
    }

    return this.#heap[0];
  }

  isEmpty() {
    return this.#heap.length === 0;
  }

  size() {
    return this.#heap.length;
  }
}
