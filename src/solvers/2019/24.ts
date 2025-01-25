import { StructuralSet } from "../../lib/collections/structural-set";
import { count, range } from "../../lib/iter";
import { add, key, makeVec3, type Vec3 } from "../../lib/linalg/vec3";
import { createSolverWithLineArray } from "../../solution";

/**
 * Used for neighbor counting.
 */
const cardinals = [
  makeVec3(0, -1, 0),
  makeVec3(1, 0, 0),
  makeVec3(0, 1, 0),
  makeVec3(-1, 0, 0),
];

//#region First Part

/**
 * Returns a unique key for the given bug set,
 * such that duplicate states can be detected.
 */
function keyBugs(bugs: StructuralSet<Vec3>) {
  return Array.from(bugs.values())
    .map((v) => key(v))
    .sort()
    .join(",");
}

/**
 * Returns the number of bugs adjacent to the given position.
 * This does not take into account the z-axis (recursion level).
 */
function simpleBugNeighborCount(bugs: StructuralSet<Vec3>, position: Vec3) {
  let count = 0;

  for (const dir of cardinals) {
    if (bugs.has(add(position, dir))) {
      count++;
    }
  }

  return count;
}

/**
 * Runs a single step of the simulation.
 * This does not take into account the z-axis (recursion level).
 */
function simpleStep(bugs: StructuralSet<Vec3>) {
  const newBugs = new StructuralSet(key);

  for (const x of range(5)) {
    for (const y of range(5)) {
      const bugCount = simpleBugNeighborCount(bugs, makeVec3(x, y, 0));

      if (bugs.has(makeVec3(x, y, 0))) {
        if (bugCount === 1) {
          newBugs.add(makeVec3(x, y, 0));
        }
      } else if (bugCount === 1 || bugCount === 2) {
        newBugs.add(makeVec3(x, y, 0));
      }
    }
  }

  return newBugs;
}

function calculateBioDiversity(bugs: StructuralSet<Vec3>) {
  let bioDiversity = 0;

  for (const bug of bugs) {
    bioDiversity += 2 ** (bug.y * 5 + bug.x);
  }

  return bioDiversity;
}

/**
 * Finds the first repeating state and calculates the biodiversity rating.
 */
function solveFirst(bugs: StructuralSet<Vec3>) {
  let seen = new Set<string>();
  seen.add(keyBugs(bugs));

  while (true) {
    bugs = simpleStep(bugs);
    const key = keyBugs(bugs);
    if (seen.has(key)) {
      break;
    }
    seen.add(key);
  }

  return calculateBioDiversity(bugs);
}

//#endregion

//#region Second Part

/**
 * Returns the number of bugs adjacent to the given position, taking into account
 * the z-axis (recursion level).
 */
function countBugNeighbors(bugs: StructuralSet<Vec3>, position: Vec3) {
  let bugCount = 0;

  // First check the outer level
  if (position.x === 0 && bugs.has(makeVec3(1, 2, position.z - 1))) {
    bugCount++;
  } else if (position.x === 4 && bugs.has(makeVec3(3, 2, position.z - 1))) {
    bugCount++;
  }

  if (position.y === 0 && bugs.has(makeVec3(2, 1, position.z - 1))) {
    bugCount++;
  } else if (position.y === 4 && bugs.has(makeVec3(2, 3, position.z - 1))) {
    bugCount++;
  }

  // Then check the inner level
  if (position.x === 1 && position.y === 2) {
    bugCount += count(
      range(5).filter((y) => bugs.has(makeVec3(0, y, position.z + 1)))
    );
  } else if (position.x === 3 && position.y === 2) {
    bugCount += count(
      range(5).filter((y) => bugs.has(makeVec3(4, y, position.z + 1)))
    );
  } else if (position.x === 2 && position.y === 1) {
    bugCount += count(
      range(5).filter((x) => bugs.has(makeVec3(x, 0, position.z + 1)))
    );
  } else if (position.x === 2 && position.y === 3) {
    bugCount += count(
      range(5).filter((x) => bugs.has(makeVec3(x, 4, position.z + 1)))
    );
  }

  for (const dir of cardinals) {
    const offset = add(position, dir);

    if (bugs.has(offset)) {
      bugCount++;
    }
  }

  return bugCount;
}

/**
 * Runs a single step of the simulation, taking into account the z-axis (recursion level).
 */
function step(bugs: StructuralSet<Vec3>) {
  const newBugs = new StructuralSet(key);

  const zs = Array.from(bugs.values().map((v) => v.z));
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  for (const z of range(minZ - 1, maxZ + 2)) {
    for (const y of range(5)) {
      for (const x of range(5)) {
        if (x === 2 && y === 2) {
          continue;
        }

        const bugCount = countBugNeighbors(bugs, makeVec3(x, y, z));
        if (bugs.has(makeVec3(x, y, z))) {
          if (bugCount === 1) {
            newBugs.add(makeVec3(x, y, z));
          }
        } else if (bugCount === 1 || bugCount === 2) {
          newBugs.add(makeVec3(x, y, z));
        }
      }
    }
  }

  return newBugs;
}

/**
 * Runs 200 steps and returns the number of bugs.
 */
function solveSecond(bugs: StructuralSet<Vec3>) {
  range(200).forEach(() => {
    bugs = step(bugs);
  });

  return bugs.size;
}

//#endregion

//#region Solver

export default createSolverWithLineArray(async (input) => {
  // lets put all bugs in a set with their position
  // z is the recursion level, initially 0
  let bugs = new StructuralSet(key);
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "#") {
        bugs.add(makeVec3(x, y, 0));
      }
    }
  }

  return {
    first: solveFirst(bugs),
    second: solveSecond(bugs),
  };
});

//#endregion
