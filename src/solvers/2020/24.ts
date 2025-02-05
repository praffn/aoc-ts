import { StructuralSet } from "../../lib/collections/structural-set";
import { range } from "../../lib/iter";
import { add, key, makeVec3, zero, type Vec3 } from "../../lib/linalg/vec3";
import { createSolver } from "../../solution";

/*
 * Again, a huge thanks to Red Blob Games for the excellent reference manual
 * for anything hexagonal grid related.
 *
 * https://www.redblobgames.com/grids/hexagons/
 */

/**
 * All directions for a "pointy" hexagon
 *
 *            NW /\ NE
 *              /  \
 *           W |    | E
 *             |    |
 *              \  /
 *            SW \/ SE
 */
const DIRECTIONS = {
  w: makeVec3(-1, 1, 0),
  nw: makeVec3(0, 1, -1),
  ne: makeVec3(1, 0, -1),
  e: makeVec3(1, -1, 0),
  se: makeVec3(0, -1, 1),
  sw: makeVec3(-1, 0, 1),
} as Record<string, Vec3>;

const ALL_DIRECTIONS = Object.values(DIRECTIONS);

/**
 * Given a line of instructions, parse them into a list of directions
 */
function parseInstructions(line: string): Array<Vec3> {
  const instructions: Array<Vec3> = [];
  for (let i = 0; i < line.length; i++) {
    const c = line[i];

    if (c === "e" || c === "w") {
      instructions.push(DIRECTIONS[c]);
      continue;
    } else {
      const c2 = line[i + 1];
      instructions.push(DIRECTIONS[c + c2]);
      i++;
    }
  }
  return instructions;
}

/**
 * Returns the final position after following a list of instructions
 */
function follow(instructions: Array<Vec3>): Vec3 {
  return instructions.reduce(add, zero);
}

/**
 * If the tile at the given position is black, flip it to white and vice versa
 */
function flip(blackTiles: StructuralSet<Vec3>, position: Vec3) {
  if (blackTiles.has(position)) {
    blackTiles.delete(position);
  } else {
    blackTiles.add(position);
  }
}

/**
 * Runs a single step (day) of the game of life on the black tiles.
 * Returns the new set of black tiles after the step.
 */
function step(blackTiles: StructuralSet<Vec3>) {
  const newBlackTiles = new StructuralSet(key);

  // First lets get all the neighbors of the black tiles.
  // We do not have a collection of white tiles, but the only white tiles
  // that could possibly be flipped are the neighbors of black tiles.
  const neighbors = new StructuralSet(key);
  for (const blackTile of blackTiles) {
    for (const direction of ALL_DIRECTIONS) {
      const neighbor = add(blackTile, direction);
      neighbors.add(neighbor);
    }
  }

  // Now we can iterate over all the neighbors and count the number of black
  // neighbors. If a black tile has 1 or 2 black neighbors, it stays black.
  // If a white tile has 2 black neighbors, it becomes black.
  for (const neighbor of neighbors) {
    let blackNeighbors = 0;
    for (const direction of ALL_DIRECTIONS) {
      if (blackTiles.has(add(neighbor, direction))) {
        blackNeighbors++;
      }
    }

    if (blackTiles.has(neighbor)) {
      // tiles is black -- stays black if it has 1 or 2 black neighbors
      if (blackNeighbors === 1 || blackNeighbors === 2) {
        newBlackTiles.add(neighbor);
      }
    } else {
      // tile is white -- becomes black if it has 2 black neighbors
      if (blackNeighbors === 2) {
        newBlackTiles.add(neighbor);
      }
    }
  }

  return newBlackTiles;
}

export default createSolver(async (input) => {
  const blackTiles = new StructuralSet(key);

  // Parse the input and flip the tiles accordingly
  for await (const line of input) {
    const instruction = parseInstructions(line);
    const position = follow(instruction);
    flip(blackTiles, position);
  }

  // Step the game of life 100 times
  let newTiles = blackTiles;
  for (const _ of range(100)) {
    newTiles = step(newTiles);
  }

  return {
    first: blackTiles.size,
    second: newTiles.size,
  };
});
