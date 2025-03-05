import { Array2D } from "../../lib/collections/array2d";
import { range } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Cell = "O" | "X" | ".";
type Platform = Array2D<Cell>;

function parse(input: Array<string>): Platform {
  return new Array2D(input.map((line) => line.split("")) as Array<Array<Cell>>);
}

/**
 * Tilts the platform north, such that all round stones fall down to the
 * northen side.
 */
function tiltNorth(platform: Array2D<string>) {
  // Lets go through each column from left to right
  for (const x of range(platform.width)) {
    // we're gonna start our write position at y = 0
    let writePosition = 0;
    // and now we will go through each cell in the column from top to bottom
    for (const y of range(platform.height)) {
      const c = platform.get(x, y);
      // if the current cell is a block stone (#) we will update our write
      // position to the next cell
      if (c === "#") {
        writePosition = y + 1;
      } else if (c === "O") {
        // Otherwise, if we have a round stone we will move it to the write
        // position if it is a valid position.
        if (
          writePosition !== y &&
          writePosition >= 0 &&
          writePosition < platform.height
        ) {
          platform.set(x, writePosition, "O");
          platform.set(x, y, ".");
        }
        writePosition++;
      }
    }
  }
}

/**
 * Tilts the platform north, then east, then south, then west.
 *
 * This is actually implemented by tilting north and the rotating clockwise 4
 * times. Could probably be more efficient, but this was fast enough
 */
function spin(platform: Platform) {
  for (const _ of range(4)) {
    tiltNorth(platform);
    platform.rotateCW();
  }
}

/**
 * Performs the spin cycle `times` times
 */
function spinTimes(platform: Platform, times: number) {
  // lets keep track of seen platforms to detect cycles
  const seen = new Map<string, number>();

  // Now we just perform the spins
  let i = 0;
  while (i < times) {
    i++;
    spin(platform);
    const key = platform.toString();
    if (seen.has(key)) {
      // If we have seen this platform before, we have a cycle starting at the
      // first seen `i` and ending at current `i`. We can now skip a huge chunk
      // of spins, and just spin the last few times to reach our target.
      const cycleLength = i - seen.get(key)!;
      const remaining = Math.floor((times - i) / cycleLength);
      i += remaining * cycleLength;
    }
    seen.set(key, i);
  }
}

/**
 * Returns the northen load (solution to both problems)
 */
function calculateNorthLoad(platform: Platform) {
  let load = 0;
  for (const [, y] of platform.findAllCoordinates((c) => c === "O")) {
    load += platform.height - y;
  }

  return load;
}

/**
 * Tilts the platform north once and returns the northen load.
 */
function solveFirst(platform: Platform) {
  platform = platform.clone();
  tiltNorth(platform);
  return calculateNorthLoad(platform);
}

/**
 * Spins the platform 1e9 times and return the northen load.
 */
function solveSecond(platform: Platform) {
  platform = platform.clone();
  spinTimes(platform, 1e9);
  return calculateNorthLoad(platform);
}

export default createSolverWithLineArray(async (input) => {
  const platform = parse(input);

  return {
    first: solveFirst(platform),
    second: solveSecond(platform),
  };
});
