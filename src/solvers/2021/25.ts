import { StructuralSet } from "../../lib/collections/structural-set";
import {
  add,
  directions,
  key,
  makeVec2,
  mod,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

type Seafloor = {
  dimensions: Vec2;
  eastHerd: StructuralSet<Vec2>;
  southHerd: StructuralSet<Vec2>;
};

function parse(input: Array<string>): Seafloor {
  const height = input.length;
  const width = input[0].length;

  const dimensions = makeVec2(width, height);

  const eastHerd = new StructuralSet(key);
  const southHerd = new StructuralSet(key);

  for (const [y, line] of input.entries()) {
    for (const [x, c] of line.split("").entries()) {
      if (c === ">") {
        eastHerd.add(makeVec2(x, y));
      } else if (c === "v") {
        southHerd.add(makeVec2(x, y));
      }
    }
  }

  return { dimensions, eastHerd, southHerd };
}

/**
 * Returns true if the given position is blocked by any of the given herds.
 */
function isBlocked(pos: Vec2, ...herds: Array<StructuralSet<Vec2>>): boolean {
  return herds.some((herd) => herd.has(pos));
}

/**
 * Steps the seafloor once by first attempting to move all eastbound cucumbers,
 * then all southbound cucumbers. Returns the new seafloor and whether the
 * seafloor has stopped moving.
 */
function step(
  seafloor: Seafloor
): [newSeafloor: Seafloor, stoppedMoving: boolean] {
  const newEastHerd = new StructuralSet(key);
  const newSouthHerd = new StructuralSet(key);
  let totalMoves = 0;

  for (const pos of seafloor.eastHerd) {
    const newPos = mod(add(pos, directions.east), seafloor.dimensions);
    if (isBlocked(newPos, seafloor.eastHerd, seafloor.southHerd)) {
      newEastHerd.add(pos);
    } else {
      totalMoves++;
      newEastHerd.add(newPos);
    }
  }

  for (const pos of seafloor.southHerd) {
    const newPos = mod(add(pos, directions.south), seafloor.dimensions);

    if (isBlocked(newPos, newEastHerd, seafloor.southHerd)) {
      newSouthHerd.add(pos);
    } else {
      totalMoves++;
      newSouthHerd.add(newPos);
    }
  }

  return [
    {
      dimensions: seafloor.dimensions,
      eastHerd: newEastHerd,
      southHerd: newSouthHerd,
    },
    totalMoves === 0,
  ];
}

export default createSolverWithLineArray(async (input) => {
  let seafloor = parse(input);

  // step the seafloor until it stops moving, keeping track of the number of
  // steps taken (our answer)
  let steps = 0;
  while (true) {
    steps++;
    const [newSeafloor, stoppedMoving] = step(seafloor);
    if (stoppedMoving) {
      break;
    }
    seafloor = newSeafloor;
  }

  return {
    first: steps,
    second: "Merry Christmas!",
  };
});
