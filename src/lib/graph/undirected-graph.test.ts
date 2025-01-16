import { describe, it } from "node:test";
import { UndirectedGraph } from "./undirected-graph";

describe("UndirectedGraph", () => {
  describe("constructor", () => {
    it("should create an undirected graph without a key function", (t) => {
      const objA = { foo: "bar" };
      const objB = { foo: "bar" };

      const graph = new UndirectedGraph<{ foo: string }>();
      graph.addVertex(objA);

      t.assert.equal(graph.hasVertex(objA), true);
      t.assert.equal(graph.hasVertex(objB), false);
    });

    it("should create an undirected graph with a key function", (t) => {
      const objA = { foo: "bar" };
      const objB = { foo: "bar" };

      const graph = new UndirectedGraph((v: { foo: string }) => v.foo);
      graph.addVertex(objA);

      t.assert.equal(graph.hasVertex(objA), true);
      t.assert.equal(graph.hasVertex(objB), true);
    });
  });

  describe("clear", () => {
    it("should remove all vertices and edges", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");
      graph.addEdge("foo", "bar");

      graph.clear();

      t.assert.equal(graph.vertexCount, 0);
      // t.assert.equal(graph
    });
  });

  describe("addVertex", () => {
    it("can add vertices", (t) => {
      const graph = new UndirectedGraph<string>();
      const didAdd = graph.addVertex("foo");

      t.assert.equal(didAdd, true);
      t.assert.equal(graph.hasVertex("foo"), true);
      t.assert.equal(graph.vertexCount, 1);
    });

    it("should not add the same vertex twice", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      const didAdd = graph.addVertex("foo");

      t.assert.equal(didAdd, false);
      t.assert.equal(graph.vertexCount, 1);
    });

    it("should handle adding vertices by key", (t) => {
      const graph = new UndirectedGraph(
        (v: [number, number]) => `${v[0]},${v[1]}`
      );

      graph.addVertex([1, 2]);
      graph.addVertex([1, 2]);
      graph.addVertex([2, 1]);

      t.assert.equal(graph.vertexCount, 2);
      t.assert.equal(graph.hasVertex([1, 2]), true);
      t.assert.equal(graph.hasVertex([2, 1]), true);
    });
  });

  describe("hasVertex", () => {
    it("should return true if the vertex exists", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");

      t.assert.equal(graph.hasVertex("foo"), true);
    });

    it("should return false if the vertex does not exist", (t) => {
      const graph = new UndirectedGraph<string>();

      t.assert.equal(graph.hasVertex("foo"), false);
    });
  });

  describe("removeVertex", () => {
    it("should remove a vertex and edges connected to it", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");
      graph.addEdge("foo", "bar");

      const didRemove = graph.removeVertex("foo");

      t.assert.equal(didRemove, true);
      t.assert.equal(graph.hasVertex("foo"), false);
      t.assert.equal(graph.hasVertex("bar"), true);
      t.assert.equal(graph.hasEdge("foo", "bar"), false);
    });

    it("should return false if the vertex does not exist", (t) => {
      const graph = new UndirectedGraph<string>();
      const didRemove = graph.removeVertex("foo");
      t.assert.equal(didRemove, false);
    });
  });

  describe("addEdge", () => {
    it("should add an undirected edge between two vertices", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");
      graph.addEdge("foo", "bar");

      t.assert.equal(graph.hasEdge("foo", "bar"), true);
      t.assert.equal(graph.hasEdge("bar", "foo"), true);
    });
  });

  describe("hasEdge", () => {
    it("should return true if an edge exists", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");
      graph.addEdge("foo", "bar");

      t.assert.equal(graph.hasEdge("foo", "bar"), true);
      t.assert.equal(graph.hasEdge("bar", "foo"), true);
    });

    it("should return false if an edge does not exist", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");

      t.assert.equal(graph.hasEdge("foo", "bar"), false);
      t.assert.equal(graph.hasEdge("bar", "foo"), false);
    });
  });

  describe("edgeCount", () => {
    it("should return the number of edges in the graph", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");
      graph.addVertex("baz");
      graph.addVertex("qux");
      graph.addEdge("foo", "bar");
      graph.addEdge("foo", "bar"); // <- duplicate edge should not count
      graph.addEdge("foo", "qux");

      t.assert.equal(graph.edgeCount, 2);
    });
  });

  describe("depthFirstSearch", () => {
    it("should visit all connected vertices in the graph", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");
      graph.addVertex("baz");
      graph.addVertex("qux");
      graph.addEdge("foo", "bar");
      graph.addEdge("foo", "qux");

      const visited = new Set<string>();
      graph.depthFirstSearch("foo", (vertex) => {
        visited.add(vertex);
      });

      t.assert.deepEqual(visited, new Set(["foo", "bar", "qux"]));
    });
  });

  describe("connectedComponents", () => {
    it("should return the connected components of the graph", (t) => {
      const graph = new UndirectedGraph<string>();
      graph.addVertex("foo");
      graph.addVertex("bar");
      graph.addVertex("baz");
      graph.addVertex("qux");
      graph.addVertex("quux");
      graph.addEdge("foo", "bar");
      graph.addEdge("baz", "qux");

      const components = Array.from(graph.connectedComponents());
      t.assert.equal(components.length, 3);
      t.assert.deepEqual(components[0], new Set(["foo", "bar"]));
      t.assert.deepEqual(components[1], new Set(["baz", "qux"]));
      t.assert.deepEqual(components[2], new Set(["quux"]));
    });
  });
});
