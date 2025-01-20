import { StructuralSet } from "../../lib/collections/structural-set";
import { add, key, makeVec2, zero, type Vec2 } from "../../lib/linalg/vec2";
import { gcd } from "../../lib/math";
import { createSolverWithLineArray } from "../../solution";

// Thanks to https://www.reddit.com/r/adventofcode/comments/e8m1z3/comment/fad63tw

/**
 * Returns the set of (shifted and reduced) asteroids that are in line of sight of the given asteroid.
 */
function getLineOfSight(station: Vec2, asteroids: StructuralSet<Vec2>) {
  const seen = new StructuralSet(key);
  for (const asteroid of asteroids) {
    if (station === asteroid) {
      continue;
    }
    const dx = asteroid.x - station.x;
    const dy = asteroid.y - station.y;
    const g = Math.abs(gcd(dx, dy));
    const newVec = makeVec2(dx / g, dy / g);
    seen.add(newVec);
  }

  return seen;
}

/**
 * Returns a tuple containing the asteroid with the best line of sight and the
 * asteroids it can see.
 */
function findStation(
  asteroids: StructuralSet<Vec2>
): [station: Vec2, inLineOfSight: StructuralSet<Vec2>] {
  let bestSeen = new StructuralSet(key);
  let bestAsteroid = zero;

  for (const asteroid of asteroids) {
    const seen = getLineOfSight(asteroid, asteroids);
    if (seen.size > bestSeen.size) {
      bestSeen = seen;
      bestAsteroid = asteroid;
    }
  }

  return [bestAsteroid, bestSeen];
}

export default createSolverWithLineArray(async (input) => {
  const asteroids = new StructuralSet(key);
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "#") {
        asteroids.add(makeVec2(x, y));
      }
    }
  }

  const [station, inLineOfSight] = findStation(asteroids);

  // Sort asteroids by angle to the station, shifted so that 0 is up.
  const destroyedAsteroids = Array.from(inLineOfSight).map(
    (v) => [Math.atan2(v.x, v.y), v] as const
  );
  destroyedAsteroids.sort((a, b) => b[0] - a[0]);
  // Pick the 200th destroyed asteroid
  const winner = destroyedAsteroids[200 - 1][1];

  let p = add(station, winner);
  while (!asteroids.has(p)) {
    p = add(p, winner);
  }

  return {
    first: inLineOfSight.size,
    second: p.x * 100 + p.y,
  };
});
