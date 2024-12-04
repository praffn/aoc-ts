import { permute, slidingWindow } from "../../lib/iter";
import { createSolver } from "../../solution";

class Graph {
  adjacencyList: Map<string, Map<string, number>> = new Map();

  addEdge(from: string, to: string, distance: number) {
    if (!this.adjacencyList.has(from)) {
      this.adjacencyList.set(from, new Map());
    }
    if (!this.adjacencyList.has(to)) {
      this.adjacencyList.set(to, new Map());
    }

    this.adjacencyList.get(from)!.set(to, distance);
    this.adjacencyList.get(to)!.set(from, distance);
  }

  getEdge(from: string, to: string): number {
    return this.adjacencyList.get(from)!.get(to)!;
  }

  nodes() {
    return this.adjacencyList.keys();
  }
}

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
  const graph = new Graph();

  for await (const line of input) {
    const { from, to, distance } = parseLine(line);
    graph.addEdge(from, to, distance);
  }

  const nodePermutations = permute(graph.nodes());

  let shortestDistance = Infinity;
  let longestDistance = -Infinity;

  for (const permutation of nodePermutations) {
    let totalDistance = 0;
    for (const [from, to] of slidingWindow(permutation, 2)) {
      const edge = graph.getEdge(from, to);
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
