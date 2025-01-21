import { DirectedGraph } from "../../lib/graph/directed-graph";
import { createSolverWithLineArray } from "../../solution";

function isInCorrectOrder(
  production: Array<number>,
  dependencyGraph: DirectedGraph<number>
): boolean {
  const produced = new Set<number>();

  for (const page of production) {
    for (const dependency of dependencyGraph.neighbors(page)) {
      if (production.includes(dependency) && !produced.has(dependency)) {
        return false;
      }
    }

    produced.add(page);
  }

  return true;
}

function order(
  production: Array<number>,
  dependencyGraph: DirectedGraph<number>
) {
  // create a subgraph of the dependency graph that only includes the
  // vertices that are in the production
  const subGraph = new DirectedGraph<number>();
  for (const [from, to] of dependencyGraph.edges()) {
    if (!production.includes(from) || !production.includes(to)) {
      continue;
    }

    subGraph.addEdge(from, to);
  }

  // return the topological sort of the subgraph
  return Array.from(subGraph.topologicalSort());
}

export default createSolverWithLineArray(async (input) => {
  // first part of input is the rules and second part is the productions
  // we split them at the first empty line
  const splitIndex = input.indexOf("");
  const rules = input.slice(0, splitIndex);
  const productions = input
    .slice(splitIndex + 1)
    .map((line) => line.split(",").map((s) => Number.parseInt(s, 10)));

  // parse each ruleset and put into the dependency graph
  // const dependencyGraph = new Map<number, Set<number>>();
  const dependencyGraph = new DirectedGraph<number>();
  for (const rule of rules) {
    const [dependencyStr, dependantStr] = rule.split("|");
    const dependency = Number.parseInt(dependencyStr, 10);
    const dependant = Number.parseInt(dependantStr, 10);
    dependencyGraph.addEdge(dependant, dependency);
  }

  const validProductions: Array<Array<number>> = [];
  const invalidProductions: Array<Array<number>> = [];

  for (const production of productions) {
    if (isInCorrectOrder(production, dependencyGraph)) {
      validProductions.push(production);
    } else {
      invalidProductions.push(production);
    }
  }

  let first = 0;
  for (const production of validProductions) {
    const middleNumber = production[production.length >> 1];
    first += middleNumber;
  }

  let second = 0;
  for (const production of invalidProductions) {
    const ordered = order(production, dependencyGraph);
    const middleNumber = ordered[Math.floor(ordered.length / 2)];
    second += middleNumber;
  }

  return {
    first,
    second,
  };
});
