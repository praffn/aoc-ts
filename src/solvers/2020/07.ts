import { DirectedGraph } from "../../lib/graph/directed-graph";
import { createSolver } from "../../solution";

/**
 * Returns the total number of bags that the given bag color contains.
 */
function totalBagCount(color: string, bagGraph: DirectedGraph<string>) {
  let total = 0;

  for (const [to, count] of bagGraph.neighborsWithWeights(color)) {
    total += count;
    total += count * totalBagCount(to, bagGraph);
  }

  return total;
}

function bagsThatCanContain(color: string, bagGraph: DirectedGraph<string>) {
  const bags = new Set<string>();
  const stack = [color];

  while (stack.length > 0) {
    const currentColor = stack.pop()!;
    for (const [from] of bagGraph.incomingEdges(currentColor)) {
      if (bags.has(from)) {
        continue;
      }

      bags.add(from);
      stack.push(from);
    }
  }

  return bags;
}

const colorRe = /(.+) bags contain/;
const bagsRe = /(\d+) (.+?) bags?/g;
export default createSolver(async (input) => {
  const bagGraph = new DirectedGraph<string>();
  for await (const line of input) {
    const [, color] = line.match(colorRe)!;
    for (const [, count, innerColor] of line.matchAll(bagsRe)) {
      bagGraph.addEdge(color, innerColor, +count);
    }
  }

  return {
    first: bagsThatCanContain("shiny gold", bagGraph).size,
    second: totalBagCount("shiny gold", bagGraph),
  };
});
