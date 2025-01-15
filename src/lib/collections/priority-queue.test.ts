import { describe, it } from "node:test";
import { PriorityQueue } from "./priority-queue";

describe("PriorityQueue", () => {
  describe("dequeue", () => {
    it("should throw if empty", (t) => {
      const pq = new PriorityQueue();
      t.assert.throws(() => pq.dequeue());
    });

    it("should return lowest priority item", (t) => {
      const pq = new PriorityQueue<string>();
      pq.enqueueAll([
        ["foo", 8],
        ["bar", 3],
        ["baz", 6],
      ]);

      const result = pq.dequeue();
      t.assert.equal(result, "bar");
    });

    it("should decrease size when dequeueing", (t) => {
      const pq = new PriorityQueue<string>();
      pq.enqueueAll([
        ["foo", 8],
        ["bar", 3],
        ["baz", 6],
      ]);

      pq.dequeue();
      t.assert.equal(pq.size(), 2);
    });
  });

  describe("dequeueWithPriority", () => {
    it("should throw if empty", (t) => {
      const pq = new PriorityQueue();
      t.assert.throws(() => pq.dequeueWithPriority());
    });

    it("should return lowest priority item", (t) => {
      const pq = new PriorityQueue<string>();
      pq.enqueueAll([
        ["foo", 8],
        ["bar", 3],
        ["baz", 6],
      ]);

      const [value, priority] = pq.dequeueWithPriority();
      t.assert.equal(value, "bar");
      t.assert.equal(priority, 3);
    });

    it("should decrease size when dequeueing", (t) => {
      const pq = new PriorityQueue<string>();
      pq.enqueueAll([
        ["foo", 8],
        ["bar", 3],
        ["baz", 6],
      ]);

      pq.dequeueWithPriority();
      t.assert.equal(pq.size(), 2);
    });
  });

  describe("peek", () => {
    it("should throw if empty", (t) => {
      const pq = new PriorityQueue();
      t.assert.throws(() => pq.peek());
    });

    it("should return lowest priority item", (t) => {
      const pq = new PriorityQueue<string>();
      pq.enqueueAll([
        ["foo", 8],
        ["bar", 3],
        ["baz", 6],
      ]);

      const result = pq.peek();
      t.assert.equal(result, "bar");
    });

    it("should not decrease size when peeking", (t) => {
      const pq = new PriorityQueue<string>();
      pq.enqueueAll([
        ["foo", 8],
        ["bar", 3],
        ["baz", 6],
      ]);

      pq.peek();
      t.assert.equal(pq.size(), 3);
    });
  });
});
