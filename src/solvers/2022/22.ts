import { StructuralMap } from "../../lib/collections/structural-map";
import { minBy, range } from "../../lib/iter";
import {
  add,
  directions,
  key,
  makeVec2,
  mod as vecMod,
  type Vec2,
} from "../../lib/linalg/vec2";
import { mod } from "../../lib/math/math";
import { createSolverWithLineArray } from "../../solution";

// NOTE! This solver ONLY works for this specific cube net:
//
//      [1][2]
//      [3]
//   [4][5]
//   [6]
//
// All AOC inputs seem to be of that type, but at some point I will revisit and
// make a generic solution that should work for ANY cube net.

type Map = {
  // the actual cells of the cube, i.e. NOT empty space.
  // '.' is true, '#' is false
  cells: StructuralMap<Vec2, boolean>;
  // The dimensions of the whole map
  dimensions: Vec2;
  // The size of each face of the cube
  faceSize: number;
};

type Instruction =
  | {
      type: "move";
      steps: number;
    }
  | {
      type: "turn";
      amount: number;
    };

type Instructions = Array<Instruction>;

// A wrap function takes some position and facing direction (that was not a
// valid position in the map) and returns a new _wrapped_ position and facing
// direction.
type WrapFn = (map: Map, position: Vec2, facing: number) => [Vec2, number];

function parse(input: Array<string>): [Map, Instructions] {
  const rawInstructions = input.at(-1)!;
  const rawMap = input.slice(0, -2);

  const height = rawMap.length;
  const width = Math.max(...rawMap.map((l) => l.length));
  const dimensions = makeVec2(width, height);
  const faceSize = Math.min(...rawMap.map((l) => l.trim().length));

  const cells = new StructuralMap<Vec2, boolean>(key);
  for (const [y, line] of rawMap.entries()) {
    for (const [x, cell] of line.split("").entries()) {
      if (cell === "." || cell === "#") {
        cells.set(makeVec2(x, y), cell === ".");
      }
    }
  }

  const grid = {
    cells,
    dimensions,
    faceSize,
  };

  const instructions = rawInstructions.match(/(\d+|L|R)/g)!.map((x) => {
    if (x === "L" || x === "R") {
      return { type: "turn", amount: x === "L" ? -1 : 1 } satisfies Instruction;
    }
    return { type: "move", steps: parseInt(x) } satisfies Instruction;
  });

  return [grid, instructions];
}

/**
 * Returns the coordinates for the first valid empty cell in the map.
 */
function findStartingPosition(map: Map) {
  const freeSquares = map.cells
    .entries()
    .filter(([, c]) => c)
    .map(([p]) => p);
  return minBy(freeSquares, (p) => p.y)!;
}

const facingDirections = [
  directions.east, // 0
  directions.south, // 1
  directions.west, // 2
  directions.north, // 3
];

/**
 * Wrapping function for part 1. This function just wraps around to the other
 * side of the map, skipping any totally empty positions. Facing direction
 * never changes.
 */
function warpWrap(map: Map, position: Vec2, facing: number): [Vec2, number] {
  const direction = facingDirections[facing];
  while (!map.cells.has(position)) {
    position = vecMod(add(position, direction), map.dimensions);
  }

  return [position, facing];
}

/**
 * Wrapping function for part 2. This "wraps" each face into a cube. Whenever
 * a position+facing direction goes "outside" of a face, we figure out which
 * face was landed at, and what the new facing should be in regards to that
 * face's "up" direction.
 */
function cubeWrap(map: Map, position: Vec2, facing: number): [Vec2, number] {
  const { x, y } = position;
  const S = map.faceSize;
  const newFacing = (offset: number) => mod(facing + offset, 4);
  const faceX = Math.floor(x / S);
  const faceY = Math.floor(y / S);

  // Moving West/East (facing 0 or 2)
  if (facing % 2 === 0) {
    const mirroredY = 3 * S - 1 - y;

    switch (faceY) {
      case 0:
        if (x >= 3 * S) return [makeVec2(2 * S - 1, mirroredY), newFacing(2)];
        if (x < S) return [makeVec2(0, mirroredY), newFacing(2)];
      case 1:
        if (x >= 2 * S) return [makeVec2(y + S, S - 1), newFacing(3)];
        if (x < S) return [makeVec2(y - S, 2 * S), newFacing(3)];
      case 2:
        if (x >= 2 * S) return [makeVec2(3 * S - 1, mirroredY), newFacing(2)];
        if (x < 0) return [makeVec2(S, mirroredY), newFacing(2)];
      case 3:
        if (x < 0) return [makeVec2(y - 2 * S, 0), newFacing(3)];
        if (x >= S) return [makeVec2(y - 2 * S, 3 * S - 1), newFacing(3)];
    }
  }

  // Moving North/South (facing 1 or 3)
  if (facing % 2 === 1) {
    switch (faceX) {
      case 0:
        if (y < 2 * S) return [makeVec2(S, x + S), newFacing(1)];
        if (y >= 4 * S) return [makeVec2(x + 2 * S, 0), facing];
      case 1:
        if (y < 0) return [makeVec2(0, x + 2 * S), newFacing(1)];
        if (y >= 3 * S) return [makeVec2(S - 1, x + 2 * S), newFacing(1)];
      case 2:
        if (y < 0) return [makeVec2(x - 2 * S, 4 * S - 1), facing];
        if (y >= S) return [makeVec2(2 * S - 1, x - S), newFacing(1)];
    }
  }

  throw new Error(`Invalid warp facing ${facing} from (${x}, ${y})`);
}

/**
 * Solves the grid with the given instructions and wrap function.
 */
function solve(map: Map, instructions: Instructions, wrapFn: WrapFn) {
  let position = findStartingPosition(map);
  let facing = 0;

  for (const instruction of instructions) {
    if (instruction.type === "turn") {
      facing = mod(facing + instruction.amount, 4);
      continue;
    }

    for (const _ of range(instruction.steps)) {
      let newPosition = add(position, facingDirections[facing]);
      let newFacing = facing;

      if (!map.cells.has(newPosition)) {
        [newPosition, newFacing] = wrapFn(map, newPosition, facing);
      }

      if (map.cells.get(newPosition)) {
        position = newPosition;
        facing = newFacing;
      }
    }
  }

  return 1000 * (position.y + 1) + 4 * (position.x + 1) + facing;
}

export default createSolverWithLineArray(async (input) => {
  const [grid, instructions] = parse(input);

  return {
    first: solve(grid, instructions, warpWrap),
    second: solve(grid, instructions, cubeWrap),
  };
});
