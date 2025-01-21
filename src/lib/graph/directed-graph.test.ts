import { describe, it } from "node:test";
import { DirectedGraph } from "./directed-graph";

describe("DirectedGraph", () => {
  describe("clear", () => {
    it("should remove all vertices and edges", (t) => {
      const graph = new DirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");
      graph.addEdge("foo", "bar");

      graph.clear();

      t.assert.equal(graph.vertexCount, 0);
      t.assert.equal(graph.edgeCount, 0);
    });
  });

  describe("addVertex", () => {
    it("should add a vertex to the graph", (t) => {
      const graph = new DirectedGraph<number>();
      const didAdd = graph.addVertex(1);

      t.assert.equal(didAdd, true);
      t.assert.equal(graph.hasVertex(1), true);
    });

    it("should not add the same vertex twice", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      const didAdd = graph.addVertex(1);

      t.assert.equal(didAdd, false);
    });
  });

  describe("hasVertex", () => {
    it("should return true if the vertex is in the graph", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);

      t.assert.equal(graph.hasVertex(1), true);
    });

    it("should return false if the vertex is not in the graph", (t) => {
      const graph = new DirectedGraph<number>();

      t.assert.equal(graph.hasVertex(1), false);
    });
  });

  describe("removeVertex", () => {
    it("should remove a vertex from the graph", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);
      graph.addEdge(1, 2);

      const didRemove = graph.removeVertex(1);

      t.assert.equal(didRemove, true);
      t.assert.equal(graph.hasVertex(1), false);
      t.assert.equal(graph.hasVertex(2), true);
      t.assert.equal(graph.hasEdge(1, 2), false);
      t.assert.equal(graph.edgeCount, 0);
      t.assert.equal(graph.edgeCount, 0);
    });

    it("should return false if the vertex does not exist", (t) => {
      const graph = new DirectedGraph<number>();

      const didRemove = graph.removeVertex(1);

      t.assert.equal(didRemove, false);
    });
  });

  describe("addEdge", () => {
    it("should add an edge between two vertices", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);

      graph.addEdge(1, 2);

      t.assert.equal(graph.hasEdge(1, 2), true);
      t.assert.equal(graph.hasEdge(2, 1), false);
    });
  });

  describe("getEdgeWeight", () => {
    it("should return the weight of the edge between two vertices", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);
      graph.addEdge(1, 2, 5);

      t.assert.equal(graph.getEdgeWeight(1, 2), 5);
    });

    it("should return 0 if there is no edge between two vertices", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);

      t.assert.equal(graph.getEdgeWeight(1, 2), undefined);
    });
  });

  describe("removeEdge", () => {
    it("should remove an edge between two vertices", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);
      graph.addEdge(1, 2);

      const didRemove = graph.removeEdge(1, 2);

      t.assert.equal(didRemove, true);
      t.assert.equal(graph.hasEdge(1, 2), false);
    });

    it("should return false if the edge does not exist", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);

      const didRemove = graph.removeEdge(1, 2);

      t.assert.equal(didRemove, false);
    });
  });

  describe("hasEdge", () => {
    it("should return true if there is an edge between two vertices", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);
      graph.addEdge(1, 2);

      t.assert.equal(graph.hasEdge(1, 2), true);
    });

    it("should return true if there is an edge between two vertices with given weight", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);
      graph.addEdge(1, 2, 5);

      t.assert.equal(graph.hasEdge(1, 2, 5), true);
    });

    it("should return false if there is no edge between two vertices", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);

      t.assert.equal(graph.hasEdge(1, 2), false);
    });

    it("should return false if an edge exists, but no with the given weight", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);
      graph.addEdge(1, 2, 5);

      t.assert.equal(graph.hasEdge(1, 2, 10), false);
    });
  });

  describe("edgeCount", () => {
    it("should return the number of edges in the graph", (t) => {
      const graph = new DirectedGraph<number>();
      graph.addVertex(1);
      graph.addVertex(2);
      graph.addVertex(3);
      graph.addEdge(1, 2);
      graph.addEdge(1, 3);
      graph.addEdge(2, 3);
      graph.removeEdge(1, 2);

      t.assert.equal(graph.edgeCount, 2);
    });
  });

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
