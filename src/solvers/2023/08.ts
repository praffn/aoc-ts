import { lcm } from "../../lib/math/math";
import { createSolverWithLineArray } from "../../solution";

type LeftRightMap = Map<string, { left: string; right: string }>;
type Instructions = Array<"L" | "R">;

const re = /(\w+) = \((\w+), (\w+)\)/;

function parse(input: Array<string>): [LeftRightMap, Instructions] {
  const instructions = input[0].split("") as Instructions;
  const leftRightMap: LeftRightMap = new Map();

  for (const line of input.slice(2)) {
    const [, source, left, right] = line.match(re)!;
    leftRightMap.set(source, { left, right });
  }

  return [leftRightMap, instructions];
}

/**
 * Returns the number of steps required to go from the `from` node to the node
 * that satisfies the `isDestination` predicate.
 */
function findSteps(
  map: LeftRightMap,
  instructions: Instructions,
  from: string,
  isDestination: (s: string) => boolean
) {
  let steps = 0;
  let current = from;

  while (!isDestination(current)) {
    const instruction = instructions[steps % instructions.length];
    const { left, right } = map.get(current)!;

    if (instruction === "L") {
      current = left;
    } else {
      current = right;
    }

    steps++;
  }

  return steps;
}

/**
 * Returns the number of steps required for all ghosts starting at a **A node to
 * reach a **Z node at the same time.
 */
function findStepsWithGhosts(map: LeftRightMap, instructions: Instructions) {
  // Lets get all nodes ending in 'A'
  const startingNodes = Array.from(
    map.keys().filter((source) => source.endsWith("A"))
  );

  // And lets figure out how many steps it takes each ghost to reach the first
  // node that ends in 'Z'
  const stepsToFirstZ = startingNodes.map((g) => {
    return findSteps(map, instructions, g, (s) => s.endsWith("Z"));
  });

  // They will all reach a node ending in 'Z' at the same time if the number is
  // a multiple of all the steps. We are interested in the lowest multiple.
  return stepsToFirstZ.reduce(lcm);
}

export default createSolverWithLineArray(async (input) => {
  const [map, instructions] = parse(input);

  return {
    first: findSteps(map, instructions, "AAA", (s) => s === "ZZZ"),
    second: findStepsWithGhosts(map, instructions),
  };
});
