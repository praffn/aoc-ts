import { StructuralSet } from "../../lib/collections/structural-set";
import { sum } from "../../lib/iter";
import {
  add,
  directions,
  key,
  makeVec2,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

const ROBOT_SYMBOL: Record<string, Vec2> = {
  "^": directions.north,
  v: directions.south,
  "<": directions.west,
  ">": directions.east,
};

/**
 * Parse takes the output of the intcode program and returns:
 * - The scaffold as a set of positions
 * - The robot's starting position
 * - The robot's starting direction
 */
function parse(
  output: Iterable<number>
): [scaffold: StructuralSet<Vec2>, robotPosition: Vec2, robotDirection: Vec2] {
  const grid = Array.from(output)
    .map((charCode) => String.fromCharCode(charCode))
    .join("")
    .split("\n");

  const scaffold = new StructuralSet(key);
  let robotPosition = zero;
  let robotDirection = zero;

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      const c = grid[y][x];

      if (c === "#") {
        scaffold.add(makeVec2(x, y));
        continue;
      }
      if (c in ROBOT_SYMBOL) {
        scaffold.add(makeVec2(x, y));
        robotPosition = makeVec2(x, y);
        robotDirection = ROBOT_SYMBOL[c];
      }
    }
  }

  return [scaffold, robotPosition, robotDirection];
}

const DIRECTIONS = [
  directions.north,
  directions.south,
  directions.west,
  directions.east,
];

/**
 * Finds all intersections in the scaffold
 * Returns an array of intersection positions
 */
function findIntersections(scaffold: StructuralSet<Vec2>) {
  const intersections: Array<Vec2> = [];
  for (const position of scaffold) {
    if (DIRECTIONS.every((dir) => scaffold.has(add(position, dir)))) {
      intersections.push(position);
    }
  }

  return intersections;
}

/**
 * Returns the total alignment parameter of every intersection in the scaffold
 */
function getTotalAlignmentParameter(scaffold: StructuralSet<Vec2>) {
  const intersections = findIntersections(scaffold);
  return sum(intersections.map(({ x, y }) => x * y));
}

function turnLeft(direction: Vec2) {
  return makeVec2(direction.y, -direction.x);
}

function turnRight(direction: Vec2) {
  return makeVec2(-direction.y, direction.x);
}

/**
 * Returns the entire path from a start position and direction to the end of
 * the scaffold. The returned path will be an array of strings where each
 * string is either "L", "R" or a number of steps to move forward.
 */
function tracePath(
  scaffold: StructuralSet<Vec2>,
  startPosition: Vec2,
  startDirection: Vec2
) {
  let position = startPosition;
  let direction = startDirection;

  const path: Array<string> = [];

  while (true) {
    const leftDir = turnLeft(direction);
    const rightDir = turnRight(direction);

    if (scaffold.has(add(position, leftDir))) {
      direction = leftDir;
      path.push("L");
    } else if (scaffold.has(add(position, rightDir))) {
      direction = rightDir;
      path.push("R");
    } else {
      break;
    }

    let steps = 0;
    while (scaffold.has(add(position, direction))) {
      steps++;
      position = add(position, direction);
    }

    path.push(steps.toString());
  }

  return path;
}

const re = /^[ABC,]+$/;
/**
 * Given a path, tries to find a shorter representation of the path by splitting
 * it into 3 functions A, B and C. The main function will consist of only A, B
 * or C. The functions A, B and C will be at most 20 characters long.
 */
function shorten(path: Array<string>): {
  main: string;
  A: string;
  B: string;
  C: string;
} {
  const maxFunctionLength = 20;
  const flattened = path.join(",");

  for (let aLength = 2; aLength <= maxFunctionLength; aLength += 2) {
    const A = path.slice(0, aLength).join(",");

    for (let bStart = aLength; bStart < path.length; bStart += 2) {
      for (let bLength = 0; bLength <= maxFunctionLength; bLength += 2) {
        const B = path.slice(bStart, bStart + bLength).join(",");

        for (let cStart = bStart + bLength; cStart < path.length; cStart += 2) {
          for (let cLength = 2; cLength <= maxFunctionLength; cLength += 2) {
            const C = path.slice(cStart, cStart + cLength).join(",");

            const main = flattened
              .replaceAll(A, "A")
              .replaceAll(B, "B")
              .replaceAll(C, "C");

            if (re.test(main)) {
              return { main, A, B, C };
            }
          }
        }
      }
    }
  }

  throw new Error("No solution found");
}

/**
 * Helper function to convert a string to an array of ASCII codes
 */
function stringToASCII(s: string) {
  return s.split("").map((c) => c.charCodeAt(0));
}

export default createSolverWithString(async (input) => {
  const cpu = new IntcodeCPU(input);
  cpu.run();

  const [scaffold, robotPosition, robotDirection] = parse(cpu.output);
  const path = tracePath(scaffold, robotPosition, robotDirection);
  const { main, A, B, C } = shorten(path);

  cpu.reset();
  const inputString = `${main}\n${A}\n${B}\n${C}\nn\n`;
  cpu.writeInput(stringToASCII(inputString));
  cpu.setMemory(0, 2);
  cpu.run();

  return {
    first: getTotalAlignmentParameter(scaffold),
    second: cpu.output.peekLast(),
  };
});
