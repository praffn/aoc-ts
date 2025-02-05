import { describe, it } from "node:test";
import { Deque } from "./deque";

describe("Deque", () => {
  describe("pushFront", () => {
    it("should push the value to the front of the deque", (t) => {
      const deque = new Deque<number>();
      deque.pushFront(1);
      deque.pushFront(2);
      t.assert.equal(deque.size, 2);
      t.assert.equal(deque.toString(), "2,1");
    });
  });

  describe("pushBack", () => {
    it("should push the value to the back of the deque", (t) => {
      const deque = new Deque<number>();
      deque.pushBack(1);
      deque.pushBack(2);
      t.assert.equal(deque.size, 2);
      t.assert.equal(deque.toString(), "1,2");
    });
  });

  describe("popFront", (t) => {
    it("should return and remove the element at the front", (t) => {
      const deque = new Deque<number>();
      deque.pushFront(1);
      deque.pushFront(2);

      t.assert.equal(deque.popFront(), 2);
      t.assert.equal(deque.size, 1);
    });

    it("should throw if deque is empty", (t) => {
      const deque = new Deque<number>();
      t.assert.throws(() => deque.popFront());
    });
  });

  describe("popBack", (t) => {
    it("should return and remove the element at the back", (t) => {
      const deque = new Deque<number>();
      deque.pushFront(1);
      deque.pushFront(2);

      t.assert.equal(deque.popBack(), 1);
      t.assert.equal(deque.size, 1);
    });

    it("should throw if deque is empty", (t) => {
      const deque = new Deque<number>();
      t.assert.throws(() => deque.popBack());
    });
  });

  describe("peekFront", (t) => {
    it("should return the element at the front", (t) => {
      const deque = new Deque<number>();
      deque.pushFront(1);
      deque.pushFront(2);

      t.assert.equal(deque.peekFront(), 2);
      t.assert.equal(deque.size, 2);
    });

    it("should throw if deque is empty", (t) => {
      const deque = new Deque<number>();
      t.assert.throws(() => deque.peekFront());
    });
  });

  describe("peekBack", (t) => {
    it("should return the element at the back", (t) => {
      const deque = new Deque<number>();
      deque.pushFront(1);
      deque.pushFront(2);

      t.assert.equal(deque.peekBack(), 1);
      t.assert.equal(deque.size, 2);
    });

    it("should throw if deque is empty", (t) => {
      const deque = new Deque<number>();
      t.assert.throws(() => deque.peekBack());
    });
  });

  describe("slice", () => {
    it("should return a new deque with the elements from start to end", (t) => {
      const deque = new Deque<number>();
      deque.pushBack(1);
      deque.pushBack(2);
      deque.pushBack(3);
      deque.pushBack(4);
      deque.pushBack(5);

      const actual = deque.slice(1, 4);
      t.assert.equal(actual.size, 3);
      t.assert.equal(actual.toString(), "2,3,4");
    });
  });

  describe("isEmpty", () => {
    it("should return true if the deque is empty", (t) => {
      const deque = new Deque<number>();
      t.assert.equal(deque.isEmpty(), true);
    });

    it("should return false if the deque is not empty", (t) => {
      const deque = new Deque<number>();
      deque.pushFront(1);
      t.assert.equal(deque.isEmpty(), false);
    });
  });

  describe("[Symbol.iterator]", () => {
    it("should iterate over the elements in the deque front to back", (t) => {
      const deque = new Deque<number>();
      deque.pushBack(1);
      deque.pushBack(2);
      deque.pushBack(3);

      const values = [...deque];
      t.assert.deepEqual(values, [1, 2, 3]);
    });
  });
});
