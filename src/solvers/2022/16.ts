import { enumerate } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Network = {
  // adjacency list maps a valve to a set of valves it can reach
  adjacency: Map<string, Set<string>>;
  // flowRates maps any non-zero flow rate valve to its flow rate
  flowRates: Map<string, number>;
  // bitmasks gives each valve a unique bitmask, such that we can represent
  // turned on valves as a single number
  bitmasks: Map<string, number>;
  // Floyd-Warshall distance table
  distanceTable: Map<string, Map<string, number>>;
};

const re = /Valve (\w+) has flow rate=(\d+); tunnels? leads? to valves? (.+)/;
/**
 * Parses the input into a network structure
 */
function parse(input: Array<string>): Network {
  const adjacency = new Map<string, Set<string>>();
  const flowRates = new Map<string, number>();

  // populate the adjacency list and flowRates map
  for (const line of input) {
    const [, valve, flowRate, targets] = line.match(re)!;
    if (+flowRate !== 0) {
      flowRates.set(valve, +flowRate);
    }
    adjacency.set(valve, new Set(targets.split(", ")));
  }

  const bitmasks = new Map(
    enumerate(flowRates.keys()).map(([i, v]) => [v, 1 << i])
  );

  // Initialize all distances to infinity, or, if a direct edge exists to 1
  const distanceTable = new Map<string, Map<string, number>>();
  for (const [valve1, adjacents] of adjacency) {
    const inner = new Map<string, number>();

    for (const valve2 of adjacency.keys()) {
      inner.set(valve2, adjacents.has(valve2) ? 1 : Infinity);
    }

    distanceTable.set(valve1, inner);
  }

  // Floyd-Warshall algorithm
  // Compute the distance table
  for (const k of adjacency.keys()) {
    for (const i of adjacency.keys()) {
      for (const j of adjacency.keys()) {
        const current = distanceTable.get(i)!.get(j)!;
        const throughK =
          distanceTable.get(i)!.get(k)! + distanceTable.get(k)!.get(j)!;
        if (throughK < current) {
          distanceTable.get(i)!.set(j, throughK);
        }
      }
    }
  }

  return { adjacency, flowRates, bitmasks, distanceTable };
}

/**
 * Returns a mapping of each type of state reached (i.e. which valves are on)
 * to the maximum pressure that can be achieved with that state, given a
 * starting valve and a budget of time.
 */
function findMaxPressures(
  network: Network,
  start: string,
  budget: number
): Map<number, number> {
  const { flowRates, distanceTable, bitmasks } = network;
  const maxPressures = new Map<number, number>();

  const stack: Array<
    [target: string, budget: number, state: number, flow: number]
  > = [[start, budget, 0, 0]];

  while (stack.length > 0) {
    const [target, budget, state, flow] = stack.pop()!;
    // lets update the maxPressures map with the maximum pressure we can achieve
    maxPressures.set(state, Math.max(maxPressures.get(state) ?? 0, flow));

    // now we go through each reachable valve
    for (const [valve, flowRate] of flowRates) {
      // update the budget with the cost of moving to the next valve and turning
      // it on
      const newBudget = budget - distanceTable.get(target)!.get(valve)! - 1;
      const valveMask = bitmasks.get(valve)!;
      // if the valve is already on in our current state OR we overspent our
      // budget, we skip this valve
      if (valveMask & state || newBudget < 0) {
        continue;
      }

      // otherwise, we push the new state to the stack
      stack.push([
        valve,
        newBudget,
        state | valveMask,
        // ahead-of-time accounting: we add the full pressure the valve can
        // provide with the flowRate and the remaining time
        flow + newBudget * flowRate,
      ]);
    }
  }

  return maxPressures;
}

/**
 * Solves the first part of the problem by finding the maximum possible
 * pressure given 30 minutes of time.
 */
function solveFirst(network: Network) {
  const maxPressures = findMaxPressures(network, "AA", 30);
  return Math.max(...maxPressures.values());
}

/**
 * Solves the second part of the problem by finding the maximum possible
 * pressure for two states that do not overlap.
 *
 * I.e. you and and elephant have 26 minutes to turn on some valves
 * independently of each other. Which two sets of unique valves will result in
 * the maximum pressure?
 */
function solveSecond(network: Network) {
  const maxPressures = findMaxPressures(network, "AA", 26);

  let maxPressure = -Infinity;
  for (const [myState, myPressure] of maxPressures) {
    for (const [elephantState, elephantPressure] of maxPressures) {
      if ((myState & elephantState) === 0) {
        maxPressure = Math.max(maxPressure, myPressure + elephantPressure);
      }
    }
  }

  return maxPressure;
}

export default createSolverWithLineArray(async (input) => {
  const network = parse(input);

  return {
    first: solveFirst(network),
    second: solveSecond(network),
  };
});
