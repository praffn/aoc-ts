import type { DirectedGraph } from "./DirectedGraph";

export function* allPaths<V>(
  graph: DirectedGraph<V>,
  from: V,
  ...to: Array<V>
): Generator<Array<V>> {
  const targets = new Set(to);
  const visited = new Set<V>();
  const queue = [[from]];

  while (queue.length > 0) {
    const path = queue.shift()!;
    const node = path[path.length - 1];
    visited.add(node);

    if (targets.has(node)) {
      yield path;
    }

    for (const neighbor of graph.neighbors(node)) {
      if (!visited.has(neighbor)) {
        queue.push([...path, neighbor]);
      }
    }
  }
}
