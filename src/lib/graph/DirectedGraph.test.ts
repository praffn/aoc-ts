import { describe, it } from "node:test";
import { DirectedGraph } from "./DirectedGraph";

describe("DirectedGraph", () => {
  describe("neighbors", () => {
    it("should return an empty set for a vertex with no neighbors", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addEdge(1, 2);
      graph.addEdge(1, 3);
      graph.addEdge(3, 1);

      const neighbors = Array.from(graph.neighbors(2));
      t.assert.deepEqual(neighbors, []);
    });

    it("should return a set of neighbors for a vertex with neighbors", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addEdge(1, 2);
      graph.addEdge(1, 3);
      graph.addEdge(2, 3);

      const neighbors = Array.from(graph.neighbors(1)).toSorted();
      t.assert.deepEqual(neighbors, [2, 3]);
    });
  });
});
