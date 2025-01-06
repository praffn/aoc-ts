import { getOrSet } from "../../lib/dicts";
import { count, range } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Claim = {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
};

function parseClaim(line: string): Claim {
  const [id, rest] = line.split(" @ ");
  const [coords, size] = rest.split(": ");
  const [x, y] = coords.split(",").map((n) => Number.parseInt(n));
  const [w, h] = size.split("x").map((n) => Number.parseInt(n));

  return {
    id: Number.parseInt(id.substring(1)),
    x,
    y,
    w,
    h,
  };
}

export default createSolverWithLineArray(async (input) => {
  const claims = input.map(parseClaim);
  const fabric = new Map<string, Set<number>>();
  const overlaps = new Map<number, Set<number>>();

  for (const claim of claims) {
    overlaps.set(claim.id, new Set());
    for (const x of range(claim.x, claim.x + claim.w)) {
      for (const y of range(claim.y, claim.y + claim.h)) {
        const key = `${x},${y}`;
        const otherClaims = fabric.get(key) ?? new Set();

        for (const otherClaim of otherClaims) {
          getOrSet(overlaps, claim.id, () => new Set()).add(otherClaim);
          getOrSet(overlaps, otherClaim, () => new Set()).add(claim.id);
        }

        fabric.set(key, otherClaims.add(claim.id));
      }
    }
  }

  let nonOverlappingId = 0;
  for (const [id, otherClaims] of overlaps) {
    if (otherClaims.size === 0) {
      nonOverlappingId = id;
      break;
    }
  }

  return {
    first: count(fabric.values().filter((claims) => claims.size > 1)),
    second: nonOverlappingId,
  };
});
