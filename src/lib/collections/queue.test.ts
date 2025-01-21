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
});
