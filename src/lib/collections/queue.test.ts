import { describe, it } from "node:test";
import { Queue } from "./queue";

describe("Queue", () => {
  describe("enqueue", () => {
    it("should add an element to the queue", (t) => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);

      t.assert.equal(queue.size, 2);
    });
  });

  describe("enqueueAll", () => {
    it("should add all elements to the queue", (t) => {
      const queue = new Queue<number>();
      queue.enqueueAll([3, 1, 2]);

      t.assert.equal(queue.size, 3);
      t.assert.equal(queue.dequeue(), 3);
      t.assert.equal(queue.dequeue(), 1);
      t.assert.equal(queue.dequeue(), 2);
    });
  });

  describe("dequeue", () => {
    it("should remove and return the first element in the queue", (t) => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);

      t.assert.equal(queue.dequeue(), 1);
      t.assert.equal(queue.size, 1);
    });

    it("should throw an error if the queue is empty", (t) => {
      const queue = new Queue<number>();

      t.assert.throws(() => queue.dequeue());
    });
  });

  describe("peek", () => {
    it("should return the first element in the queue", (t) => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);

      t.assert.equal(queue.peek(), 1);
      t.assert.equal(queue.size, 2);
    });

    it("should throw an error if the queue is empty", (t) => {
      const queue = new Queue<number>();

      t.assert.throws(() => queue.peek());
    });
  });

  describe("peekLast", () => {
    it("should return the last element in the queue", (t) => {
      const queue = new Queue<number>();
      queue.enqueue(1);
      queue.enqueue(2);
      queue.enqueue(3);

      t.assert.equal(queue.peekLast(), 3);
      t.assert.equal(queue.size, 3);
    });

    it("should throw an error if the queue is empty", (t) => {
      const queue = new Queue<number>();

      t.assert.throws(() => queue.peekLast());
    });
  });

  describe("[Symbol.iterator]", () => {
    it("should iterate over the elements in the queue in order", (t) => {
      const queue = new Queue<number>();
      queue.enqueue(3);
      queue.enqueue(1);
      queue.enqueue(2);

      const values = [...queue];
      t.assert.deepEqual(values, [3, 1, 2]);
    });

    it("should not mutate the queue", (t) => {
      const queue = new Queue<number>();
      queue.enqueue(3);
      queue.enqueue(1);
      queue.enqueue(2);

      const _ = [...queue];
      t.assert.equal(queue.size, 3);
    });
  });

  describe("dequeueIterator", () => {
    it("should iterate over the elements in the queue in order", (t) => {
      const queue = new Queue<number>();
      queue.enqueue(3);
      queue.enqueue(1);
      queue.enqueue(2);

      const values = [...queue];
      t.assert.deepEqual(values, [3, 1, 2]);
    });

    it("should dequeue when iterating", (t) => {
      const queue = new Queue<number>();
      queue.enqueue(3);
      queue.enqueue(1);
      queue.enqueue(2);

      const it = queue.dequeueIterator();
      it.next();
      it.next();

      t.assert.equal(queue.size, 1);
    });
  });
});
