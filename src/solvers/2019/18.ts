import { Queue } from "../../lib/collections/queue";
import { StructuralMap } from "../../lib/collections/structural-map";
import { StructuralSet } from "../../lib/collections/structural-set";
import {
  add,
  cardinalDirections,
  key,
  makeVec2,
  ordinalDirections,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function isDoor(c: string) {
  return c >= "A" && c <= "Z";
}

function isKey(c: string) {
  return c >= "a" && c <= "z";
}

type VaultMap = {
  openSpaces: StructuralSet<Vec2>;
  keys: StructuralMap<Vec2, string>;
  doors: StructuralMap<Vec2, string>;
};

/**
 * Used for equality checks in the cache. It contains the current positions and
 * the currently collected keys. It is used to memoize the minimum steps to
 * collect all keys from the given positions with the currently collected keys.
 */
type State = {
  from: StructuralSet<Vec2>;
  currentKeys: Set<string>;
};

/**
 * Serializes the state to a string. It is used to memoize the minimum steps to
 * collect all keys from the given positions with the currently collected keys.
 */
function keyState(state: State) {
  const froms = [...state.from]
    .map((v) => key(v))
    .sort()
    .join(",");
  const keys = [...state.currentKeys].sort().join(",");
  return `${froms}:${keys}`;
}

const cache = new StructuralMap<State, number>(keyState);
/**
 * Returns the minimum steps it would take to collect all keys from the given
 * positions with the currently collected keys.
 */
function minimumSteps(
  from: StructuralSet<Vec2>,
  currentKeys: Set<string>,
  vaultMap: VaultMap
): number {
  const state = { from, currentKeys };
  if (cache.has(state)) {
    return cache.get(state)!;
  }

  let minDistance = Infinity;

  const reachables = findReachableKeysFromPoints(from, currentKeys, vaultMap);
  for (const [key, [position, distance, cause]] of reachables) {
    const newFrom = from.clone();
    newFrom.delete(cause);
    newFrom.add(position);
    const newKeys = new Set([...currentKeys, key]);
    const total = distance + minimumSteps(newFrom, newKeys, vaultMap);

    if (total < minDistance) {
      minDistance = total;
    }
  }

  const result = minDistance === Infinity ? 0 : minDistance;
  cache.set(state, result);
  return result;
}

/**
 * Returns all reachable keys from the given positions with the currently
 * collected keys. It returns a mapping of all reachable keys to their position,
 * the distance from the starting position and the position that caused the
 * key to be reachable.
 */
function findReachableKeysFromPoints(
  from: StructuralSet<Vec2>,
  currentKeys: Set<string>,
  vaultMap: VaultMap
) {
  const map = new Map<string, [Vec2, number, Vec2]>();

  for (const point of from) {
    const reachable = findReachableKeys(point, currentKeys, vaultMap);
    for (const [key, [position, distance]] of reachable) {
      map.set(key, [position, distance, point]);
    }
  }

  return map;
}

/**
 * Returns all reachable keys from the given position with the currently
 * collected keys. It returns a mapping of all reachable keys to their position
 * and the distance from the starting position.
 */
function findReachableKeys(
  from: Vec2,
  currentKeys: Set<string>,
  vaultMap: VaultMap
) {
  const { openSpaces, keys, doors } = vaultMap;

  const queue = new Queue<Vec2>();
  queue.enqueue(from);
  const distances = new StructuralMap<Vec2, number>(key);
  distances.set(from, 0);
  const keyDistance = new Map<string, [Vec2, number]>();

  while (!queue.isEmpty()) {
    const position = queue.dequeue();

    for (const dir of cardinalDirections) {
      const next = add(position, dir);
      if (!openSpaces.has(next)) {
        continue;
      }

      if (distances.has(next)) {
        continue;
      }

      const door = doors.get(next);
      const key = keys.get(next);

      distances.set(next, (distances.get(position) ?? 0) + 1);

      if (!door || currentKeys.has(door.toLowerCase())) {
        if (key && !currentKeys.has(key)) {
          keyDistance.set(key, [next, (distances.get(position) ?? 0) + 1]);
        } else {
          queue.enqueue(next);
        }
      }
    }
  }

  return keyDistance;
}

/**
 * Solves the first by finding the minimum steps from the start until all keys
 * are collected.
 */
function solveFirst(start: Vec2, vaultMap: VaultMap) {
  const from = new StructuralSet(key);
  from.add(start);

  return minimumSteps(from, new Set(), vaultMap);
}

/**
 * Solves the second by first creating four starting positions from the initial
 * one and removing the open spaces around it. Then it finds the minimum steps
 * for all keys to be collected.
 */
function solveSecond(start: Vec2, vaultMap: VaultMap) {
  // Create four starting position in each diagonal square from the start.
  const from = new StructuralSet(key);
  for (const dir of ordinalDirections) {
    from.add(add(start, dir));
  }

  // Remove the open spaces around the starting positions.
  const openSpaces = vaultMap.openSpaces.clone();
  openSpaces.delete(start);
  for (const dir of cardinalDirections) {
    openSpaces.delete(add(start, dir));
  }

  return minimumSteps(from, new Set(), { ...vaultMap, openSpaces });
}

/**
 * Parses the input returning the starting position and a vault map consisting
 * of open spaces, keys and doors.
 */
function parseVaultMap(input: Array<string>): [Vec2, VaultMap] {
  let start = zero;
  const keys = new StructuralMap<Vec2, string>(key);
  const doors = new StructuralMap<Vec2, string>(key);
  const openSpaces = new StructuralSet(key);

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const c = input[y][x];
      if (c === "#") {
        continue;
      }

      const position = makeVec2(x, y);
      openSpaces.add(position);

      if (c === "@") {
        start = position;
      } else if (isDoor(c)) {
        doors.set(position, c);
      } else if (isKey(c)) {
        keys.set(position, c);
      }
    }
  }

  return [start, { openSpaces, keys, doors }];
}

export default createSolverWithLineArray(async (input) => {
  const [start, vaultMap] = parseVaultMap(input);

  return {
    first: solveFirst(start, vaultMap),
    second: solveSecond(start, vaultMap),
  };
});
