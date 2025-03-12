import { makeVec3, type Vec3 } from "../../lib/linalg/vec3";
import { createSolverWithLineArray } from "../../solution";

type Brick = {
  start: Vec3;
  end: Vec3;
};

/**
 * ZMap is a helper class that keeps track of the highest z value at each
 * x/y range (defaulting to 0).
 */
class ZMap {
  #map = new Map<number, number>();

  // Much faster than using a string key, and looking at input we have pretty
  // small integer values of x and y.
  #key(x: number, y: number) {
    return (x << 16) | y;
  }

  /**
   * Returns the highest z value in the x/y range of the given brick
   */
  getZ(brick: Brick): number {
    let max = 0;

    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        max = Math.max(max, this.#map.get(this.#key(x, y)) ?? 0);
      }
    }

    return max;
  }

  /**
   * Sets the entire x/y range defined by the brick to the z value of the brick
   */
  setZ(brick: Brick) {
    for (let x = brick.start.x; x <= brick.end.x; x++) {
      for (let y = brick.start.y; y <= brick.end.y; y++) {
        this.#map.set(this.#key(x, y), brick.end.z);
      }
    }
  }
}

/**
 * Returns an array of bricks, sorted by z value ascending
 */
function parse(input: Array<string>): Array<Brick> {
  return input
    .map((line) => {
      const [startRaw, endRaw] = line.split("~");
      const [sx, sy, sz] = startRaw.split(",").map(Number);
      const [ex, ey, ez] = endRaw.split(",").map(Number);

      return {
        start: makeVec3(sx, sy, sz),
        end: makeVec3(ex, ey, ez),
      };
    })
    .sort((a, b) => a.start.z - b.start.z);
}

/**
 * Drops all the bricks such that they are either on the ground or supported by
 * another brick. Returns a new array of bricks and the number of bricks that
 * were dropped.
 *
 * This algorithm assumes that the bricks are sorted by z value ascending.
 */
function drop(
  bricks: Array<Brick>
): [droppedBricks: Array<Brick>, drops: number] {
  // lets create a zmap to keep track of max z values at given ranges
  const zmap = new ZMap();
  // also keep track of how many bricks we dropped
  let drops = 0;

  // Lets go!
  const newBricks = bricks.map((brick) => {
    // figure out highest current z value in the x/y range of the current brick
    const peakZ = zmap.getZ(brick);
    // deltaZ is the amount we need to drop the brick to make it rest
    const deltaZ = Math.max(brick.start.z - peakZ - 1, 0);
    // create a new brick with the new z value
    const newBrick = {
      start: makeVec3(brick.start.x, brick.start.y, brick.start.z - deltaZ),
      end: makeVec3(brick.end.x, brick.end.y, brick.end.z - deltaZ),
    };

    // if the brick has moved, we count it as a drop
    if (newBrick.start.z !== brick.start.z) {
      drops += 1;
    }

    // update zmap
    zmap.setZ(newBrick);
    return newBrick;
  });

  return [newBricks, drops];
}

export default createSolverWithLineArray(async (input) => {
  const bricks = parse(input);
  const [droppedBricks, _] = drop(bricks);

  let first = 0;
  let second = 0;

  // Alright, we have an array of dropped bricks, ordered by z value. Now we're
  // gonna go through each brick and see what happens if we remove it and drop
  // the rest.
  //
  // The solution to part 1 is the number of bricks that can be removed without
  // any other bricks falling.
  //
  // The solution to part 2 is the sum of the number of bricks that fall when
  // each brick is removed.

  for (let i = 0; i < droppedBricks.length; i++) {
    const removed = droppedBricks.toSpliced(i, 1);
    const [_, drops] = drop(removed);
    if (drops === 0) {
      first++;
    } else {
      second += drops;
    }
  }

  return {
    first,
    second,
  };
});
