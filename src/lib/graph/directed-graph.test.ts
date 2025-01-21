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

  describe("inDegree", () => {
    it("should return the in-degree of a vertex", (t) => {
      const graph = new DirectedGraph<string>();
      graph.addVertex("TARGET");
      graph.addVertex("A");
      graph.addVertex("B");
      graph.addVertex("C");
      graph.addEdge("A", "TARGET");
      graph.addEdge("B", "TARGET");
      graph.addEdge("C", "TARGET");

      t.assert.equal(graph.inDegree("TARGET"), 3);
      graph.removeEdge("A", "TARGET");
      t.assert.equal(graph.inDegree("TARGET"), 2);
      graph.removeVertex("B");
      t.assert.equal(graph.inDegree("TARGET"), 1);
    });

    it("should return 0 for a vertex with no incoming edges", (t) => {
      const graph = new DirectedGraph<string>();
      graph.addVertex("A");
      graph.addVertex("B");
      graph.addEdge("A", "B");

      t.assert.equal(graph.inDegree("A"), 0);
    });

    it("should return 0 for a vertex that does not exist", (t) => {
      const graph = new DirectedGraph<string>();

      t.assert.equal(graph.inDegree("A"), 0);
    });
  });

  describe("outDegree", () => {
    it("should return the out-degree of a vertex", (t) => {
      const graph = new DirectedGraph<string>();
      graph.addVertex("A");
      graph.addVertex("B");
      graph.addVertex("C");
      graph.addEdge("A", "B");
      graph.addEdge("A", "C");

      t.assert.equal(graph.outDegree("A"), 2);
      t.assert.equal(graph.outDegree("B"), 0);
      graph.removeEdge("A", "B");
      t.assert.equal(graph.outDegree("A"), 1);
      graph.removeVertex("C");
      t.assert.equal(graph.outDegree("A"), 0);
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

  describe("topologicalSort", () => {
    it("should return a topological ordering of the vertices", (t) => {
      const graph = new DirectedGraph<string>();
      graph.addEdge("A", "D");
      graph.addEdge("A", "B");
      graph.addEdge("B", "C");
      graph.addEdge("B", "D");

      const result = Array.from(graph.topologicalSort());
      t.assert.deepEqual(result, ["A", "B", "C", "D"]);
    });
  });
});
