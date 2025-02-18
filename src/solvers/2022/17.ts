import { StructuralMap } from "../../lib/collections/structural-map";
import { StructuralSet } from "../../lib/collections/structural-set";
import { range } from "../../lib/iter";
import {
  add,
  directions,
  key,
  makeVec2,
  type Vec2,
} from "../../lib/linalg/vec2";
import { divmod } from "../../lib/math/math";
import { createSolverWithString } from "../../solution";

// Thanks to 4HbQ for the inspiration
// https://www.reddit.com/r/adventofcode/comments/znykq2/comment/j0kdnnj

//#region Types & Blocks

type Grid = StructuralSet<Vec2>;

/**
 * A block is represented as a list of points (relative to the bottom left)
 * that make up the block.
 */
type Block = { points: Array<Vec2>; height: number };

function toBlock([s]: TemplateStringsArray): Block {
  const points: Array<Vec2> = [];
  const blueprint = s
    .trim()
    .split("\n")
    .map((l) => l.trim().split(""));
  const height = blueprint.length;

  for (const [y, row] of blueprint.entries()) {
    for (const [x, cell] of row.entries()) {
      if (cell === "#") {
        points.push({ x, y: height - y - 1 });
      }
    }
  }

  return { points, height };
}

const blocks = [
  toBlock`
    ####
  `,
  toBlock`
    .#.
    #.#
    .#.
  `,
  toBlock`
    ..#
    ..#
    ###
  `,
  toBlock`
    #
    #
    #
    #
  `,
  toBlock`
    ##
    ##
  `,
];

//#endregion

/**
 * Returns true if the position is valid;
 * - within the grid
 * - not occupied
 */
function isEmpty(grid: Grid, position: Vec2): boolean {
  return (
    position.x >= 0 && position.x < 7 && position.y > 0 && !grid.has(position)
  );
}

/**
 * Checks if all points composing the block (moved by direction) are in a valid
 * position on the grid.
 */
function check(grid: Grid, block: Block, position: Vec2, direction: Vec2) {
  return block.points.every((point) =>
    isEmpty(grid, add(add(position, direction), point))
  );
}

export default createSolverWithString(async (input) => {
  const jetstream = input
    .split("")
    .map((c) => (c === "<" ? directions.west : directions.east));

  let b = 0; // <- current block index
  let j = 0; // <- current jetstream index

  // the grid we're playing on
  const grid = new StructuralSet(key);
  // cache for detecting cycles
  const cache = new StructuralMap<Vec2, [number, number]>(key);
  // current top of the grid
  let top = 0;

  let first = -1;
  let second = -1;

  // lets start playing
  for (const step of range(1e12)) {
    // a new block appears 2 units to the left, and 3 units from the top
    let position = makeVec2(2, top + 4);

    if (step === 2022) {
      // solution for part 1
      first = top;
    }

    // lets check the last step and top where both block index and jetstream
    // index had the same values
    const key = makeVec2(b, j);
    if (step > 2022 && cache.has(key)) {
      const [oldStep, oldTop] = cache.get(key)!;

      // now lets check if there is a cycle.
      // if there is one, we can end the simulation early, as we now can
      // predict the final top of the grid
      const [q, r] = divmod(1e12 - step, step - oldStep);
      if (r === 0) {
        second = top + (top - oldTop) * q;
        break;
      }
    } else {
      cache.set(key, [step, top]);
    }

    // get the next block to place
    const block = blocks[b];
    b = (b + 1) % blocks.length;

    // simulate moving/falling the block
    while (true) {
      const jet = jetstream[j];
      j = (j + 1) % jetstream.length;

      // move left/right if possible
      if (check(grid, block, position, jet)) {
        position = add(position, jet);
      }

      // move down
      if (check(grid, block, position, makeVec2(0, -1))) {
        position = add(position, makeVec2(0, -1));
      } else {
        // if we cannot move down, end
        break;
      }
    }

    // now add the points of the block plus the position to the grid
    for (const point of block.points) {
      grid.add(add(position, point));
    }

    // And update the top
    top = Math.max(top, position.y + block.height - 1);
  }

  return {
    first,
    second,
  };
});
