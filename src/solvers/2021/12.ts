import { UndirectedGraph } from "../../lib/graph/undirected-graph";
import { createSolver } from "../../solution";

/**
 * Returns the number of paths from "start" to "end" in the graph.
 * If allowsTwoSmallCaves is true, the path can pass through a small cave twice.
 * Afterwards, no more small caves can be visited twice.
 *
 * It is assumed to now to big caves can ever be connected to each other.
 */
function countPaths(
  graph: UndirectedGraph<string>,
  allowTwoSmallCaves: boolean,
  current = "start",
  visited = new Set<string>()
): number {
  // If we reached the end, we found a path
  if (current === "end") {
    return 1;
  }
  // Lets check if we've been here before
  if (visited.has(current)) {
    // We are never allowed to visit start twice
    if (current === "start") {
      return 0;
    }
    if (current.toLowerCase() === current) {
      // Ok so it is a small cave that we've already been to before.
      // If allowsTwoSmallCaves is true, we can visit it again, and then we
      // can't visit any small caves twice again.
      //
      // If allowsTwoSmallCaves is false, we have an invalid path
      if (allowTwoSmallCaves) {
        allowTwoSmallCaves = false;
      } else {
        return 0;
      }
    }
  }

  // Recursively count the paths from all neighbors
  let count = 0;
  for (const neighbor of graph.neighbors(current)) {
    count += countPaths(
      graph,
      allowTwoSmallCaves,
      neighbor,
      new Set([...visited, current])
    );
  }

  return count;
}

export default createSolver(async (input) => {
  const graph = new UndirectedGraph<string>();

  for await (const line of input) {
    const [a, b] = line.split("-");
    graph.addEdge(a, b);
  }

  return {
    first: countPaths(graph, false),
    second: countPaths(graph, true),
  };
});
