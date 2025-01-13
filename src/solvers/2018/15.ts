import {
  add,
  directions,
  equals,
  key,
  makeVec2,
  manhattan,
  unkey,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

const DEBUG = false;
function debug(...args: Array<unknown>) {
  if (DEBUG) {
    console.log(...args);
  }
}

type Unit = {
  id: number;
  type: "elf" | "goblin";
  position: Vec2;
  hp: number;
  power: number;
};

// This directions are in reading order
const DIRECTIONS = [
  directions.north,
  directions.west,
  directions.east,
  directions.south,
];

function readingOrder(a: Vec2, b: Vec2) {
  if (a.y !== b.y) {
    return a.y - b.y;
  }

  return a.x - b.x;
}

function sortUnitByReadingOrder(a: Unit, b: Unit) {
  return readingOrder(a.position, b.position);
}

function sortByHPAndReadingOrder(a: Unit, b: Unit) {
  if (a.hp !== b.hp) {
    return a.hp - b.hp;
  }

  return readingOrder(a.position, b.position);
}

function sortPath(a: Array<Vec2>, b: Array<Vec2>) {
  // first sort by shortest path
  if (a.length !== b.length) {
    return a.length - b.length;
  }

  // Then sort by target square
  const targetA = a[a.length - 1];
  const targetB = b[b.length - 1];
  const targetOrder = readingOrder(targetA, targetB);
  if (targetOrder !== 0) {
    return targetOrder;
  }

  // Finally sort by step square
  return readingOrder(a[0], b[0]);
}

/**
 * Returns all units that are in range of the given unit
 * i.e. all unit that are 1 step away
 */
function findUnitsInRange(unit: Unit, units: Array<Unit>) {
  return units.filter((u) => {
    return manhattan(unit.position, u.position) === 1;
  });
}

/**
 * Attempts to attack an enemy unit
 * It can only attack if there is an enemy in range
 * If there are multiple enemies in range, it will attack the one with the
 * lowest HP then in reading order.
 *
 * If an elf dies and throwOnElfDeath is true, it will throw an error
 */
function attemptAttack(
  unit: Unit,
  enemies: Array<Unit>,
  units: Set<Unit>,
  occupiedCells: Set<string>,
  throwOnElfDeath: boolean
) {
  const enemiesInRange = findUnitsInRange(unit, enemies);
  if (enemiesInRange.length === 0) {
    debug(`\t\tNo enemies in range`);
    return;
  }

  const target = enemiesInRange.sort(sortByHPAndReadingOrder)[0];
  target.hp -= unit.power;
  debug(`\t\tAttacked [${target.id}] ${target.type}`);
  debug(`\t\t${target.hp} HP left`);
  if (target.hp <= 0) {
    if (throwOnElfDeath && target.type === "elf") {
      throw new Error("Elf died");
    }

    debug(`\t\t[${target.id}] ${target.type} died`);
    units.delete(target);
    occupiedCells.delete(key(target.position));
  }
}

/**
 * Returns all squares that are in range of the given units and not occupied
 */
function findSquaresInRange(
  unit: Unit,
  enemies: Array<Unit>,
  occupiedCells: Set<string>
) {
  const availableSquares = new Set<string>();
  for (const enemy of enemies) {
    for (const dir of DIRECTIONS) {
      const position = add(enemy.position, dir);
      const k = key(position);
      if (!occupiedCells.has(k) || equals(position, unit.position)) {
        availableSquares.add(k);
      }
    }
  }

  return Array.from(availableSquares).map(unkey);
}

/**
 * First finds all paths from some start position to the goal positions.
 * It then returns the move that would lead the unit down the:
 * 1. Shortest path
 * 2. Target square in reading order
 * 3. Step square in reading order
 *
 * If no paths are found, undefined is returned
 */
function findNextMove(
  start: Vec2,
  goals: Array<Vec2>,
  occupied: Set<string>
): Vec2 | undefined {
  const seen = new Set(occupied);
  const queue: Array<[Vec2, Array<Vec2>]> = [[start, []]];
  const paths: Array<Array<Vec2>> = [];

  while (queue.length > 0) {
    const [current, path] = queue.shift()!;

    if (goals.some((g) => equals(g, current))) {
      paths.push(path);
      continue;
    }

    for (const dir of DIRECTIONS) {
      const next = add(current, dir);
      const nextKey = key(next);
      if (seen.has(nextKey)) {
        continue;
      }

      seen.add(nextKey);
      queue.push([next, [...path, next]]);
    }
  }

  if (paths.length === 0) {
    return;
  }

  paths.sort(sortPath);

  return paths[0][0];
}

/**
 * Attempts to move the unit to a square in range of the enemies
 */
function attemptMove(
  unit: Unit,
  enemies: Array<Unit>,
  occupiedCells: Set<string>
) {
  // first lets get all in range available squares
  const squaresInRange = findSquaresInRange(unit, enemies, occupiedCells);
  if (squaresInRange.length === 0) {
    debug(`\t\tNo squares in range`);
    return;
  }

  // check if we're already in range
  if (squaresInRange.some((s) => equals(unit.position, s))) {
    debug("\t\tAlready in range");
    return;
  }

  // not in range, so we should move
  const newPosition = findNextMove(
    unit.position,
    squaresInRange,
    occupiedCells
  );

  if (!newPosition) {
    // no paths, we can't move
    return;
  }

  debug(`\t\tMoving to ${newPosition.x}, ${newPosition.y}`);
  occupiedCells.delete(key(unit.position));
  occupiedCells.add(key(newPosition));
  unit.position = newPosition;
}

/**
 * Plays one round of the game. If a round completes it returns true.
 * If a unit at any points has 0 enemies left, the round is incomplete and
 * it returns false.
 */
function round(
  units: Set<Unit>,
  occupiedCells: Set<string>,
  throwOnElfDeath: boolean
) {
  const sortedUnits = Array.from(units).sort(sortUnitByReadingOrder);

  for (const unit of sortedUnits) {
    if (unit.hp <= 0) {
      continue;
    }

    debug(`[${unit.id}] ${unit.type}:`);

    const enemies = sortedUnits.filter(
      ({ type, hp }) => hp > 0 && type !== unit.type
    );

    if (enemies.length === 0) {
      // no enemies left, combat ends
      debug("\tNo enemies left, combat ends");
      return false;
    }

    attemptMove(unit, enemies, occupiedCells);
    attemptAttack(unit, enemies, units, occupiedCells, throwOnElfDeath);
  }

  return true;
}

// Plays a regular game (with elfPower 3) and returns the outcome
function play(units: Set<Unit>, occupiedCells: Set<string>, elfPower?: number) {
  // clone the units and occupiedCells
  units = new Set(
    units.values().map((u) => {
      if (elfPower && u.type === "elf") {
        return { ...u, power: elfPower };
      }
      return { ...u };
    })
  );
  occupiedCells = new Set(occupiedCells);

  let rounds = 0;
  while (true) {
    debug(`Round ${rounds}`);
    if (!round(units, occupiedCells, elfPower !== undefined)) {
      break;
    }
    rounds++;
  }

  return rounds * units.values().reduce((acc, { hp }) => acc + hp, 0);
}

// Plays the game until the elves win. Starts at elfPower 4 and increments.
// I tried with binary search to find the minimum elfPower, but it seems
// that `play` is not a monotonically increasing function, so I had to resort
// to this.
function playUntilElvesWin(units: Set<Unit>, occupiedCells: Set<string>) {
  let elfAttack = 4;
  let second = 0;
  while (true) {
    try {
      second = play(units, occupiedCells, elfAttack);
      break;
    } catch (e) {
      elfAttack++;
    }
  }

  return second;
}

export default createSolverWithLineArray(async (input) => {
  const occupiedCells = new Set<string>();
  const units = new Set<Unit>();

  let id = 1;
  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      const cell = input[y][x];
      if (cell === ".") {
        continue;
      }

      const position = makeVec2(x, y);

      if (cell === "E" || cell === "G") {
        units.add({
          id: id++,
          position,
          type: cell === "E" ? "elf" : "goblin",
          hp: 200,
          power: 3,
        });
      }

      occupiedCells.add(key(position));
    }
  }

  return {
    first: play(units, occupiedCells),
    second: playUntilElvesWin(units, occupiedCells),
  };
});
