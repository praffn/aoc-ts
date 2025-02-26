import { StructuralMap } from "../../lib/collections/structural-map";
import { StructuralSet } from "../../lib/collections/structural-set";
import { minMax, range } from "../../lib/iter";
import {
  add,
  allDirections,
  directions,
  key,
  makeVec2,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

/**
 * Returns a set of positions of the elves.
 */
function parse(input: Array<string>): StructuralSet<Vec2> {
  const elves = new StructuralSet(key);

  for (const [y, line] of input.entries()) {
    for (const [x, char] of line.split("").entries()) {
      if (char === "#") {
        elves.add(makeVec2(x, y));
      }
    }
  }

  return elves;
}

/**
 * Used for the proposal tests.
 * First element in the pair is the direction to move if there are no neighbors
 * in the squares given by the directions in the second element.
 */
const PROPOSAL_TESTS: Array<[Vec2, Array<Vec2>]> = [
  [
    directions.north,
    [directions.north, directions.northeast, directions.northwest],
  ],
  [
    directions.south,
    [directions.south, directions.southeast, directions.southwest],
  ],
  [
    directions.west,
    [directions.west, directions.northwest, directions.southwest],
  ],
  [
    directions.east,
    [directions.east, directions.northeast, directions.southeast],
  ],
];

/**
 * Returns a new set of the updated positions of the elves and whether any elf
 * moved in this round.
 */
function update(
  elves: StructuralSet<Vec2>,
  round: number
): [newMap: StructuralSet<Vec2>, didMove: boolean] {
  const newMap = new StructuralSet(key, elves);
  // proposals is a map of "target position" -> "elves that want to move there"
  const proposals: StructuralMap<Vec2, Array<Vec2>> = new StructuralMap(key);

  // First phase of the round: propose moves
  for (const elf of elves) {
    // If the elf has no neighbors it does not move
    const neighbors = allDirections.map((dir) => elves.has(add(elf, dir)));
    const hasNeighbors = neighbors.some((n) => n);
    if (!hasNeighbors) {
      continue;
    }

    // Otherwise, we will start proposing moves
    // We start with the proposal that is at index (round % 4).
    for (const i of range(4)) {
      const index = (i + round) % 4;
      const [direction, test] = PROPOSAL_TESTS[index];
      // lets test if there is any neighbors in the test directions
      const hasNeighbors = test.some((dir) => elves.has(add(elf, dir)));
      if (!hasNeighbors) {
        // no neighbors! lets propose that this elf moves in the direction, and
        // stop iterating over the remaining proposals
        const targetPosition = add(elf, direction);
        proposals.getOrDefault(targetPosition, []).push(elf);
        break;
      }
      // otherwise, lets try the remaining proposals
    }
  }

  let didMove = false;
  for (const [target, elves] of proposals) {
    if (elves.length === 1) {
      didMove = true;
      newMap.delete(elves[0]);
      newMap.add(target);
    }
  }

  return [newMap, didMove];
}

function countEmptyCoverage(map: StructuralSet<Vec2>): number {
  const [minX, maxX] = minMax(map.values().map((p) => p.x));
  const [minY, maxY] = minMax(map.values().map((p) => p.y));

  const w = maxX - minX + 1;
  const h = maxY - minY + 1;

  return w * h - map.size;
}

export default createSolverWithLineArray(async (input) => {
  let elves = parse(input);
  let didMove = true;
  let first = -1;
  let round = 0;

  while (didMove) {
    [elves, didMove] = update(elves, round++);
    if (round === 10) {
      first = countEmptyCoverage(elves);
    }
  }

  return {
    first,
    second: round,
  };
});
