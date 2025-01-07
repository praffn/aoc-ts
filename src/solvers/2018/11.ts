import { createSolverWithNumber } from "../../solution";

type AreaTable = Array<Array<number>>;

function getCoordinatesForBestSquare(
  areaTable: AreaTable,
  size: number
): [number, number, number] {
  let bestTotal = -Infinity;
  let bestX = 0;
  let bestY = 0;

  for (let y = size; y <= 300; y++) {
    for (let x = size; x <= 300; x++) {
      const total =
        areaTable[y][x] -
        areaTable[y - size][x] -
        areaTable[y][x - size] +
        areaTable[y - size][x - size];
      if (total > bestTotal) {
        bestTotal = total;
        bestX = x - size + 1;
        bestY = y - size + 1;
      }
    }
  }

  return [bestTotal, bestX, bestY];
}

function getBestSizeAndCoordinateForSquare(areaTable: AreaTable) {
  let bestTotal = -Infinity;
  let bestX = 0;
  let bestY = 0;
  let bestSize = 0;

  for (let size = 1; size < 300; size++) {
    const [total, x, y] = getCoordinatesForBestSquare(areaTable, size);
    if (total > bestTotal) {
      bestTotal = total;
      bestX = x;
      bestY = y;
      bestSize = size;
    }
  }

  return [bestX, bestY, bestSize];
}

export default createSolverWithNumber(async (serialNumber) => {
  // https://en.wikipedia.org/wiki/Summed-area_table
  const areaTable: AreaTable = Array.from({ length: 301 }, () => {
    return Array(301).fill(0);
  });

  for (let y = 1; y <= 300; y++) {
    for (let x = 1; x <= 300; x++) {
      const rackId = x + 10;
      let powerLevel = rackId * y;
      powerLevel += serialNumber;
      powerLevel *= rackId;
      powerLevel = Math.floor(powerLevel / 100) % 10;
      powerLevel -= 5;

      areaTable[y][x] =
        powerLevel +
        areaTable[y - 1][x] +
        areaTable[y][x - 1] -
        areaTable[y - 1][x - 1];
    }
  }

  // Part 1
  const [, x1, y1] = getCoordinatesForBestSquare(areaTable, 3);

  // Part 2
  const [x2, y2, size] = getBestSizeAndCoordinateForSquare(areaTable);

  return {
    first: `${x1},${y1}`,
    second: `${x2},${y2},${size}`,
  };
});
