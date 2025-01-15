import { describe, it } from "node:test";
import { ComparePriorityQueue } from "./compare-priority-queue";
import { makeVec2, reverseLexicographicalCompare } from "../linalg/vec2";

describe("PriorityQueue", () => {
  describe("dequeue", () => {
    it("should throw if empty", (t) => {
      const pq = new ComparePriorityQueue(reverseLexicographicalCompare);
      t.assert.throws(() => pq.dequeue());
    });

    it("should return lowest priority item", (t) => {
      const pq = new ComparePriorityQueue(reverseLexicographicalCompare);
      pq.enqueueAll([makeVec2(3, 2), makeVec2(1, 2), makeVec2(3, 4)]);

      const result = pq.dequeue();
      t.assert.deepEqual(result, makeVec2(1, 2));
    });
  });

  it("should decrease size when dequeueing", (t) => {
    const pq = new ComparePriorityQueue(reverseLexicographicalCompare);
    pq.enqueueAll([makeVec2(3, 2), makeVec2(1, 2), makeVec2(3, 4)]);

    pq.dequeue();
    t.assert.equal(pq.size(), 2);
  });

  describe("peek", () => {
    it("should throw if empty", (t) => {
      const pq = new ComparePriorityQueue(reverseLexicographicalCompare);
      t.assert.throws(() => pq.peek());
    });

    it("should return lowest priority item", (t) => {
      const pq = new ComparePriorityQueue(reverseLexicographicalCompare);
      pq.enqueueAll([makeVec2(3, 2), makeVec2(1, 2), makeVec2(3, 4)]);

      const result = pq.peek();
      t.assert.deepEqual(result, makeVec2(1, 2));
    });

    it("should not decrease size when peeking", (t) => {
      const pq = new ComparePriorityQueue(reverseLexicographicalCompare);
      pq.enqueueAll([makeVec2(3, 2), makeVec2(1, 2), makeVec2(3, 4)]);

      pq.peek();
      t.assert.equal(pq.size(), 3);
    });
  });
});
