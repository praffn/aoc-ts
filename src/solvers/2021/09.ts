import { Array2D } from "../../lib/collections/array2d";
import { Queue } from "../../lib/collections/queue";
import { min, numericProduct } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

/**
 * Returns the sum of the risk levels for all low points in the height map
 * A point is a low point if every neighbor has a higher height
 */
function computeRiskLevel(heightMap: Array2D<number>): number {
  let riskLevel = 0;

  for (const [height, x, y] of heightMap.entries()) {
    const minNeighborHeight =
      min(heightMap.neighbors(x, y).map((n) => n[0])) ?? 0;
    if (height < minNeighborHeight) {
      riskLevel += height + 1;
    }
  }

  return riskLevel;
}

/**
 * Iterates over all basins in the height map and yields their sizes.
 */
function* getBasinSizes(input: Array2D<number>): Generator<number> {
  // Lets keep track of already visited points
  const visited = new Set<string>();

  // Then we can loop through every point in the height map
  for (const [height, x, y] of input.entries()) {
    if (height === 9 || visited.has(`${x},${y}`)) {
      // we skip any point we've already filled, or any point that is a peak
      continue;
    }

    // Now lets start _literally_ and figuratively to flood fill the basin
    const queue = new Queue<[number, number]>();
    queue.enqueue([x, y]);
    // every point we can flood increases the size by 1
    let basinSize = 0;
    while (!queue.isEmpty()) {
      const [x, y] = queue.dequeue();
      const key = `${x},${y}`;
      if (visited.has(key)) {
        // already visited, skip
        continue;
      }

      // increase basin size and mark as visited
      basinSize++;
      visited.add(key);

      // Lets add all the neighbors that are not peaks to the queue
      for (const [nh, nx, ny] of input.neighbors(x, y)) {
        if (nh !== 9) {
          queue.enqueue([nx, ny]);
        }
      }
    }

    yield basinSize;
  }
}

export default createSolverWithLineArray(async (input) => {
  const heightMap = new Array2D(
    input.map((l) => l.split("").map((n) => Number.parseInt(n, 10)))
  );

  // Lets sort basin sizes in descending order. The solution to part two is the
  // product of the three largest basins
  const basinSizes = [...getBasinSizes(heightMap)].sort((a, b) => b - a);

  return {
    first: computeRiskLevel(heightMap),
    second: numericProduct(basinSizes.slice(0, 3)),
  };
});
