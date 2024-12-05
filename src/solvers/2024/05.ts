import { createSolverWithLineArray } from "../../solution";

function isInCorrectOrder(
  production: Array<number>,
  dependencyGraph: Map<number, Set<number>>
): boolean {
  const produced = new Set<number>();

  for (const page of production) {
    const dependencies = dependencyGraph.get(page);
    if (dependencies) {
      for (const dependency of dependencies) {
        if (production.includes(dependency) && !produced.has(dependency)) {
          return false;
        }
      }
    }

    produced.add(page);
  }

  return true;
}

function order(
  production: Array<number>,
  dependencyGraph: Map<number, Set<number>>
) {
  const adjacencyList = new Map<number, Set<number>>();
  const inDegree = new Map<number, number>();

  for (const page of production) {
    adjacencyList.set(page, new Set());
    inDegree.set(page, 0);
  }

  for (const [dependant, dependencies] of dependencyGraph) {
    adjacencyList.set(dependant, adjacencyList.get(dependant) ?? new Set());

    for (const dependency of dependencies) {
      if (!production.includes(dependant) || !production.includes(dependency)) {
        continue;
      }
      adjacencyList.set(dependency, adjacencyList.get(dependency) ?? new Set());
      adjacencyList.get(dependency)!.add(dependant);
      inDegree.set(dependant, (inDegree.get(dependant) ?? 0) + 1);
    }
  }

  const queue: Array<number> = [];
  const result: Array<number> = [];

  for (const [dependant, degree] of inDegree) {
    if (degree === 0) {
      queue.push(dependant);
    }
  }

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    const dependants = adjacencyList.get(current)!;

    for (const dependant of dependants) {
      const degree = inDegree.get(dependant)! - 1;
      inDegree.set(dependant, degree);

      if (degree === 0) {
        queue.push(dependant);
      }
    }
  }

  return result;
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
  const dependencyGraph = new Map<number, Set<number>>();
  for (const rule of rules) {
    const [dependencyStr, dependantStr] = rule.split("|");
    const dependency = Number.parseInt(dependencyStr, 10);
    const dependant = Number.parseInt(dependantStr, 10);

    if (!dependencyGraph.has(dependant)) {
      dependencyGraph.set(dependant, new Set());
    }

    dependencyGraph.get(dependant)!.add(dependency);
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
    const middleNumber = production[Math.floor(production.length / 2)];
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
