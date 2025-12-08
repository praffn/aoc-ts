type KeyFn<T> = (v: T) => string;

export class UndirectedGraph<V> {
  #vertexMap = new Map<V | string, V>();
  #adjacencyList = new Map<V | string, Map<V | string, number>>();
  #keyFn?: KeyFn<V>;

  constructor();
  constructor(keyFn: KeyFn<V>);
  constructor(keyFn?: KeyFn<V>) {
    this.#keyFn = keyFn;
  }

  /**
   * Removes all vertices and edges from the graph.
   */
  clear() {
    this.#adjacencyList.clear();
  }

  /**
   * Primarily for internal use. Returns the key for a vertex used in the
   * internal adjacency list. If no key function is provided, the vertex itself
   * is used as the key.
   * @param vertex
   * @returns the key for the vertex
   */
  key(vertex: V) {
    return this.#keyFn ? this.#keyFn(vertex) : vertex;
  }

  /**
   * Attempts to add a vertex to the graph. If vertex is already in the graph,
   * this method does nothing and returns false. Otherwise the vertex is added
   * and the method returns true.
   * @param vertex Vertex to add
   * @returns true if vertex added, otherwise false
   */
  addVertex(vertex: V) {
    const key = this.key(vertex);
    if (!this.#adjacencyList.has(key)) {
      this.#vertexMap.set(key, vertex);
      this.#adjacencyList.set(key, new Map());
      return true;
    }
    return false;
  }

  *vertices() {
    yield* this.#vertexMap.values();
  }

  /**
   * Attempts to remove the vertex from the graph and all edges connected to it.
   * If the vertex is not in the graph, this method does nothing and returns
   * false. Otherwise the vertex is removed and the method returns true.
   * @param vertex Vertex to delete
   * @returns true if the vertex was removed, otherwise false
   */
  removeVertex(vertex: V) {
    const key = this.key(vertex);
    const neighbors = this.#adjacencyList.get(key);
    if (!neighbors) {
      return false;
    }

    for (const neighbor of neighbors.keys()) {
      this.#adjacencyList.get(neighbor)?.delete(key);
    }

    this.#vertexMap.delete(key);
    this.#adjacencyList.delete(key);

    return true;
  }

  /**
   * Checks if the vertex is in the graph.
   * @param vertex Vertex to check
   * @returns true if the vertex is in the graph, otherwise false
   */
  hasVertex(vertex: V) {
    const key = this.key(vertex);
    return this.#adjacencyList.has(key);
  }

  /**
   * Returns the number of vertices in the graph.
   */
  get vertexCount() {
    return this.#adjacencyList.size;
  }

  /**
   * Adds an edge between two vertices. If either vertex is not in the graph,
   * they are added to the graph first. While wording is "from" and "to", the
   * edge is undirected.
   * @param from
   * @param to
   */
  addEdge(from: V, to: V): void;
  addEdge(from: V, to: V, weight: number): void;
  addEdge(from: V, to: V, weight = 0) {
    const fromKey = this.key(from);
    const toKey = this.key(to);

    this.addVertex(from);
    this.addVertex(to);

    this.#adjacencyList.get(fromKey)!.set(toKey, weight);
    this.#adjacencyList.get(toKey)!.set(fromKey, weight);
  }

  /**
   * Returns true if there is an edge between the two vertices. While wording is
   * "from" and "to", the edge is undirected.
   * @param from
   * @param to
   * @returns true if there is an edge between the two vertices
   */
  hasEdge(from: V, to: V) {
    const fromKey = this.key(from);
    const toKey = this.key(to);

    const fromNeighbors = this.#adjacencyList.get(fromKey);
    if (!fromNeighbors) {
      return false;
    }

    return fromNeighbors.has(toKey);
  }

  getEdgeWeight(from: V, to: V) {
    const fromKey = this.key(from);
    const toKey = this.key(to);

    const fromNeighbors = this.#adjacencyList.get(fromKey);
    if (!fromNeighbors) {
      return 0;
    }

    return fromNeighbors.get(toKey)!;
  }

  get edgeCount() {
    let count = 0;
    for (const neighbors of this.#adjacencyList.values()) {
      count += neighbors.size;
    }
    // Each edge is counted twice, so divide by 2
    return count / 2;
  }

  /**
   * Returns an iterator over the neighbors of the vertex, i.e. the vertices
   * that are connected to the vertex by an edge.
   * @param vertex
   * @returns Iterator over the neighbors of the vertex
   */
  *neighbors(vertex: V) {
    const key = this.key(vertex);
    const neighbors = this.#adjacencyList.get(key);
    if (!neighbors) {
      return;
    }

    yield* neighbors.keys().map((k) => this.#vertexMap.get(k)!);
  }

  depthFirstSearch(start: V, visit: (vertex: V) => void) {
    const stack: V[] = [start];
    const visited = new Set<V | string>();

    while (stack.length > 0) {
      const vertex = stack.pop()!;
      const key = this.key(vertex);
      if (visited.has(key)) {
        continue;
      }

      visit(vertex);
      visited.add(key);

      for (const neighbor of this.neighbors(vertex)) {
        stack.push(neighbor as V);
      }
    }
  }

  breadthFirstSearch(start: V, visit: (vertex: V) => void) {
    const queue: V[] = [start];
    const visited = new Set<V | string>();

    while (queue.length > 0) {
      const vertex = queue.shift()!;
      const key = this.key(vertex);
      if (visited.has(key)) {
        continue;
      }

      visit(vertex);
      visited.add(key);

      for (const neighbor of this.neighbors(vertex)) {
        queue.push(neighbor as V);
      }
    }
  }

  *isolatedVertices() {
    for (const vertex of this.vertices()) {
      if (this.neighbors(vertex).next().done) {
        yield vertex;
      }
    }
  }

  hasIsolatedVertices() {
    if (this.isolatedVertices().next().done) {
      return false;
    }
    return true;
  }

  *connectedComponents() {
    const visited = new Set<V | string>();

    for (const vertex of this.vertices()) {
      const vertexKey = this.key(vertex);
      if (visited.has(vertexKey)) {
        continue; // Already part of a component
      }

      const component = new Set<V>();

      this.depthFirstSearch(vertex, (v) => {
        const key = this.key(v);
        if (!visited.has(key)) {
          visited.add(key);
          component.add(v);
        }
      });

      yield component;
    }
  }
}
