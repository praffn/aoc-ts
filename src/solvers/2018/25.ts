import { UndirectedGraph } from "../../lib/graph/undirected-graph";
import { count } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Point = [number, number, number, number];

function parsePoint(line: string): Point {
  return line.split(",").map((v) => parseInt(v)) as Point;
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
    first: count(graph.connectedComponents()),
    second: "Merry Christmas! 🦌",
  };
});
