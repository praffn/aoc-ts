import { max } from "../../lib/iter";
import { key, makeVec2, manhattan, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function parseCoord(line: string): Vec2 {
  const [x, y] = line.split(", ").map((n) => Number.parseInt(n));
  return { x, y };
}

export default createSolverWithLineArray(async (input) => {
  const points = input.map(parseCoord);

  const maxX = Math.max(...points.map((c) => c.x));
  const minX = Math.min(...points.map((c) => c.x));
  const maxY = Math.max(...points.map((c) => c.y));
  const minY = Math.min(...points.map((c) => c.y));

  // pointAreas map an input point to the total area of the points closest to it
  const pointAreas = new Map<string, number>();
  // infinitySet contains the keys of the points that have infinite areas
  const infinitySet = new Set<string>();
  // goodRegionSize is the size of the region where the sum of the distances to
  // all points is less than 10_000
  let goodRegionSize = 0;

  for (let x = minX - 1; x <= maxX + 1; x++) {
    for (let y = minY - 1; y <= maxY + 1; y++) {
      const point = makeVec2(x, y);

      // Closest point is the point-key that is closest to the current point
      let closestPoint: string;
      // closestDistance and nextClosestDistance are the two distances
      // closest to the current point
      let closestDistance = Infinity;
      let nextClosestDistance = Infinity;
      // totalDistance is the sum of the distances to all points
      let totalDistance = 0;

      for (const p of points) {
        const distance = manhattan(point, p);
        totalDistance += distance;

        if (distance < closestDistance) {
          nextClosestDistance = closestDistance;
          closestDistance = distance;
          closestPoint = key(p);
        } else if (distance < nextClosestDistance) {
          nextClosestDistance = distance;
        }
      }

      // If the total distance is less than 10_000,
      // the point is in the good region
      if (totalDistance < 10_000) {
        goodRegionSize++;
      }

      // If the two closest points are equidistant, skip
      if (closestDistance === nextClosestDistance) {
        continue;
      }

      // Add the point to the infinity set if it is on the border
      if (x === minX || x === maxX || y === minY || y === maxY) {
        infinitySet.add(closestPoint!);
      }

      // Increment the area of the closest point
      pointAreas.set(closestPoint!, (pointAreas.get(closestPoint!) ?? 0) + 1);
    }
  }

  // Finite areas are the areas of the points that are not in infinitySet
  const finiteAreas = pointAreas
    .entries()
    .filter(([k]) => !infinitySet.has(k))
    .map(([_, v]) => v);

  return {
    first: max(finiteAreas)!,
    second: goodRegionSize,
  };
});
