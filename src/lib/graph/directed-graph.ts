type KeyFn<T> = (v: T) => string;

export class DirectedGraph<V> {
  #vertexMap = new Map<V | string, V>();
  #adjacencyList = new Map<V | string, Map<V | string, number>>();
  #keyFn?: KeyFn<V>;

  constructor();
  constructor(keyFn: KeyFn<V>);
  constructor(keyFn?: KeyFn<V>) {
    this.#keyFn = keyFn;
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

  clear() {
    this.#adjacencyList.clear();
    this.#vertexMap.clear();
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
    if (!this.#vertexMap.has(key)) {
      return false;
    }
    this.#vertexMap.delete(key);
    this.#adjacencyList.delete(key);
    for (const [, neighbors] of this.#adjacencyList) {
      neighbors.delete(key);
    }

    return true;
  }

  /**
   * Checks if the vertex is in the graph.
   * @param vertex Vertex to check
   * @returns true if the vertex is in the graph, otherwise false
   */
  hasVertex(vertex: V) {
    return this.#vertexMap.has(this.key(vertex));
  }

  /**
   * Returns the number of vertices in the graph.
   */
  get vertexCount() {
    return this.#vertexMap.size;
  }

  /**
   * Adds an edge from `from` to `to`. If either vertex is not in the graph,
   * they are added to the graph first. If weight is not provided, it is assumed
   * to be 0.
   * @param from
   * @param to
   * @param weight
   */
  addEdge(from: V, to: V): void;
  addEdge(from: V, to: V, weight: number): void;
  addEdge(from: V, to: V, weight = 0) {
    const fromKey = this.key(from);
    const toKey = this.key(to);

    this.addVertex(from);
    this.addVertex(to);
    this.#adjacencyList.get(fromKey)!.set(toKey, weight);
  }

  /**
   * Returns the weight of the edge from `from` to `to`. If the edge does not
   * exist, this method returns undefined.
   * @param from
   * @param to
   * @returns the weight of the edge or undefined
   */
  getEdgeWeight(from: V, to: V): number | undefined {
    const fromKey = this.key(from);
    const toKey = this.key(to);

    const neighbors = this.#adjacencyList.get(fromKey);
    if (!neighbors) {
      return undefined;
    }

    return neighbors.get(toKey);
  }

  /**
   * Removes the edge from `from` to `to`. If the edge does not exist, this
   * method does nothing and returns false.
   * @param from
   * @param to
   * @returns whether the edge existed before removal or not
   */
  removeEdge(from: V, to: V): boolean {
    const fromKey = this.key(from);
    const toKey = this.key(to);
    const neighbors = this.#adjacencyList.get(fromKey);
    if (!neighbors) {
      return false;
    }

    const didRemove = neighbors.delete(toKey);
    return didRemove;
  }

  /**
   * Returns true if there is an edge from `from` to `to` in the graph.
   * If weight is provided the edge must have that weight to return true.
   * @param from
   * @param to
   * @param weight
   */
  hasEdge(from: V, to: V): boolean;
  hasEdge(from: V, to: V, weight: number): boolean;
  hasEdge(from: V, to: V, weight?: number) {
    const fromKey = this.key(from);
    const toKey = this.key(to);
    const neighbors = this.#adjacencyList.get(fromKey);

    if (!neighbors) {
      return false;
    }

    if (weight === undefined) {
      return neighbors.has(toKey);
    }

    return neighbors.get(toKey) === weight;
  }

  get edgeCount() {
    let count = 0;
    for (const neighbors of this.#adjacencyList.values()) {
      count += neighbors.size;
    }
    return count;
  }

  /**
   * Returns an iterator over the neighbors of the vertex.
   * @param vertex
   * @returns
   */
  *neighbors(vertex: V) {
    const key = this.key(vertex);
    const neighbors = this.#adjacencyList.get(key);
    if (!neighbors) {
      return;
    }

    yield* neighbors.keys().map((k) => this.#vertexMap.get(k)!);
  }

  /**
   * Returns an iterator over the neighbors of the vertex.
   * Each neighbor is returned as a tuple with the vertex and its weight.
   * @param vertex
   * @returns
   */
  *neighborsWithWeights(vertex: V) {
    const key = this.key(vertex);
    const neighbors = this.#adjacencyList.get(key);
    if (!neighbors) {
      return;
    }

    yield* neighbors.entries().map(([key, weight]) => {
      return [this.#vertexMap.get(key)!, weight] as const;
    });
  }
}
