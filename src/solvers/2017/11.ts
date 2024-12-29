import { add, makeVec3, type Vec3 } from "../../lib/linalg/vec3";
import { createSolverWithString } from "../../solution";

// Huge thanks to Red Blob Games: https://www.redblobgames.com/grids/hexagons/

const DIRECTIONS = {
  n: makeVec3(0, 1, -1),
  ne: makeVec3(1, 0, -1),
  se: makeVec3(1, -1, 0),
  s: makeVec3(0, -1, 1),
  sw: makeVec3(-1, 0, 1),
  nw: makeVec3(-1, 1, 0),
} as Record<string, Vec3>;

function absmax(v: Vec3) {
  return Math.max(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z));
}

function follow(directions: string) {
  let current = makeVec3(0);
  let maxDistance = 0;

  for (const dir of directions.split(",")) {
    current = add(current, DIRECTIONS[dir]);
    const distance = absmax(current);
    maxDistance = Math.max(maxDistance, distance);
  }

  return [absmax(current), maxDistance];
}

export default createSolverWithString(async (input) => {
  const [distance, maxDistance] = follow(input);

  return {
    first: distance,
    second: maxDistance,
  };
});
