import { UndirectedGraph } from "../../lib/graph/undirected-graph";
import { permute, slidingWindow } from "../../lib/iter";
import { createSolver } from "../../solution";

function parseLine(line: string): {
  from: string;
  to: string;
  distance: number;
} {
  const [from, , to, , distance] = line.split(" ");

  return {
    from,
    to,
    distance: Number.parseInt(distance, 10),
  };
}

export default createSolver(async (input) => {
  const graph = new UndirectedGraph();

  for await (const line of input) {
    const { from, to, distance } = parseLine(line);
    graph.addEdge(from, to, distance);
  }

  const nodePermutations = permute(graph.vertices());

  let shortestDistance = Infinity;
  let longestDistance = -Infinity;

  for (const permutation of nodePermutations) {
    let totalDistance = 0;
    for (const [from, to] of slidingWindow(permutation, 2)) {
      const edge = graph.getEdgeWeight(from, to);
      totalDistance += edge;
    }

    shortestDistance = Math.min(shortestDistance, totalDistance);
    longestDistance = Math.max(longestDistance, totalDistance);
  }

  return {
    first: shortestDistance,
    second: longestDistance,
  };
});
