import { Grid2D } from "../../lib/grid/grid2d";
import { equals, key, makeVec2, sub, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

const directionToButton: Record<string, string> = {
  "0,-1": "^",
  "0,1": "v",
  "-1,0": "<",
  "1,0": ">",
};
const EMPTY = "_";
const numericKeypad = Grid2D.fromLines(["789", "456", "123", "_0A"]);
const directionalKeypad = Grid2D.fromLines(["_^A", "<v>"]);

function getSequences(keypad: Grid2D<string>, start: string, end: string) {
  if (start === end) {
    return ["A"];
  }

  const startPosition = makeVec2(...keypad.findPosition((v) => v === start)!);
  const endPosition = makeVec2(...keypad.findPosition((v) => v === end)!);

  const queue: Array<[Vec2, string]> = [[startPosition, ""]];
  const distances = new Map<string, number>();
  let allPaths: Array<string> = [];

  while (queue.length > 0) {
    const [currentPosition, path] = queue.shift()!;

    if (equals(currentPosition, endPosition)) {
      allPaths.push(path + "A");
    }

    const currentPositionKey = key(currentPosition);
    const distance = distances.get(currentPositionKey);
    if (distance !== undefined && distance < path.length) {
      continue;
    }

    for (const { x, y } of keypad.neighbors(
      currentPosition.x,
      currentPosition.y,
      (v) => v !== EMPTY
    )) {
      const newPosition = makeVec2(x, y);
      const directionVector = sub(newPosition, currentPosition);
      const direction = directionToButton[key(directionVector)];

      const newPath = path + direction;
      const newPositionKey = key(newPosition);
      const distance = distances.get(newPositionKey);
      if (distance === undefined || distance >= newPath.length) {
        distances.set(newPositionKey, newPath.length);
        queue.push([newPosition, newPath]);
      }
    }
  }

  return allPaths.sort((a, b) => a.length - b.length);
}

const cache = new Map<string, number>();

function getMinimumKeypresses(keypad: Grid2D<string>, code: string, n: number) {
  const key = `${code}:${n}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  let start = "A";
  let len = 0;
  for (const end of code) {
    const sequences = getSequences(keypad, start, end);
    len +=
      n === 0
        ? sequences[0].length
        : Math.min(
            ...sequences.map((sequence) =>
              getMinimumKeypresses(directionalKeypad, sequence, n - 1)
            )
          );
    start = end;
  }

  cache.set(key, len);
  return len;
}

function isDigit(c: string) {
  return c >= "0" && c <= "9";
}

function extractNumericValue(code: string) {
  return Number.parseInt(code.split("").filter(isDigit).join(""));
}

export default createSolverWithLineArray(async (input) => {
  let first = 0;
  let second = 0;
  for (const code of input) {
    const numericValue = extractNumericValue(code);
    first += getMinimumKeypresses(numericKeypad, code, 2) * numericValue;
    second += getMinimumKeypresses(numericKeypad, code, 25) * numericValue;
  }

  return {
    first,
    second,
  };
});
