interface PriorityQueueNode<T> {
  priority: number;
  value: T;
}

export class PriorityQueue<T> {
  #heap: Array<PriorityQueueNode<T>> = [];

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
      this.#heap[index].priority < this.#heap[this.#parentIndex(index)].priority
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
      this.#heap[left].priority < this.#heap[smallest].priority
    ) {
      smallest = left;
    }

    if (
      right < this.#heap.length &&
      this.#heap[right].priority < this.#heap[smallest].priority
    ) {
      smallest = right;
    }

    if (smallest !== index) {
      this.#swap(index, smallest);
      this.#heapifyDown(smallest);
    }
  }

  enqueue(value: T, priority: number) {
    this.#heap.push({ value, priority });
    this.#heapifyUp(this.#heap.length - 1);
  }

  enqueueAll(items: Iterable<[T, number]>) {
    for (const [value, priority] of items) {
      this.enqueue(value, priority);
    }
  }

  dequeue() {
    if (this.isEmpty()) {
      throw new Error("PriorityQueue is empty");
    }

    if (this.#heap.length === 1) {
      return this.#heap.pop()!.value;
    }

    const root = this.#heap[0].value;
    this.#heap[0] = this.#heap.pop()!;
    this.#heapifyDown(0);
    return root;
  }

  dequeueWithPriority(): [value: T, priority: number] {
    if (this.isEmpty()) {
      throw new Error("PriorityQueue is empty");
    }

    if (this.#heap.length === 1) {
      const { value, priority } = this.#heap.pop()!;
      return [value, priority];
    }

    const { value, priority } = this.#heap[0];
    this.#heap[0] = this.#heap.pop()!;
    this.#heapifyDown(0);
    return [value, priority];
  }

  peek() {
    if (this.isEmpty()) {
      throw new Error("PriorityQueue is empty");
    }

    return this.#heap[0].value;
  }

  isEmpty() {
    return this.#heap.length === 0;
  }

  size() {
    return this.#heap.length;
  }
}
