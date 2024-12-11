/**
 * Directed graph with unweighted edges.
 */
export class DirectedGraph<V> {
  #vertices = new Set<V>();
  #adjacency = new Map<V, Set<V>>();

  addEdge(from: V, to: V) {
    this.#vertices.add(from);
    this.#vertices.add(to);
    this.#adjacency.set(from, (this.#adjacency.get(from) || new Set()).add(to));
  }

  neighbors(vertex: V): Set<V> {
    return this.#adjacency.get(vertex) || new Set();
  }
}
