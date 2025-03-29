import { UndirectedGraph } from "../../lib/graph/undirected-graph";
import { maxBy, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

function parse(input: Array<string>): UndirectedGraph<string> {
  const graph = new UndirectedGraph<string>();

  for (const line of input) {
    const [from, tos] = line.split(": ");
    for (const to of tos.split(" ")) {
      graph.addEdge(from, to);
    }
  }

  return graph;
}

export default createSolverWithLineArray(async (input) => {
  const graph = parse(input);
  const vs = new Set(graph.vertices());

  const count = (v: string) => {
    const neighbors = new Set(graph.neighbors(v));
    return neighbors.difference(vs).size;
  };

  while (sum(vs.values().map(count)) !== 3) {
    const max = maxBy(vs.values(), count)!;
    vs.delete(max);
  }

  const a = vs.size;
  const b = new Set(graph.vertices()).difference(vs).size;

  return {
    first: a * b,
    second: "Merry Christmas 🎅",
  };
});
