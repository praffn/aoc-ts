import { createSolverWithLineArray } from "../../solution";

type Point = [number, number, number, number];

function parsePoint(line: string): Point {
  return line.split(",").map((v) => parseInt(v)) as Point;
}

class UndirectedGraph {
  #adjacency = new Map<string, Set<string>>();

  addVertex(id: string) {
    if (!this.#adjacency.has(id)) {
      this.#adjacency.set(id, new Set());
    }
  }

  addEdge(from: string, to: string) {
    this.addVertex(from);
    this.addVertex(to);

    this.#adjacency.get(from)!.add(to);
    this.#adjacency.get(to)!.add(from);
  }

  connectedComponents() {
    const visited = new Set<string>();
    const components: Array<Set<string>> = [];

    const dfs = (id: string, component: Set<string>) => {
      visited.add(id);
      component.add(id);
      for (const neighbor of this.#adjacency.get(id)!) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, component);
        }
      }
    };

    for (const vertex of this.#adjacency.keys()) {
      if (!visited.has(vertex)) {
        const component = new Set<string>();
        dfs(vertex, component);
        components.push(component);
      }
    }

    return components;
  }
}

function manhattan(a: Point, b: Point) {
  return a.reduce((acc, v, i) => acc + Math.abs(v - b[i]), 0);
}

function key(p: Point) {
  return p.join(",");
}

export default createSolverWithLineArray(async (input) => {
  const points = input.map(parsePoint);

  const graph = new UndirectedGraph();
  for (const p of points) {
    for (const q of points) {
      if (manhattan(p, q) <= 3) {
        graph.addEdge(key(p), key(q));
      }
    }
  }

  return {
    first: graph.connectedComponents().length,
    second: "Merry Christmas! 🦌",
  };
});
