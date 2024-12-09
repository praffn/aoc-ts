import { createSolverWithLineArray } from "../../solution";

type Vec2 = { x: number; y: number };
type Keypad = Array<Array<string>>;

const DELTAS: Record<string, { x: number; y: number }> = {
  U: { x: 0, y: -1 },
  D: { x: 0, y: 1 },
  L: { x: -1, y: 0 },
  R: { x: 1, y: 0 },
};

function computeKeycode(
  keypad: Keypad,
  startPosition: Vec2,
  instructions: Array<string>
): string {
  let position = { ...startPosition };

  let keycode = "";

  for (const instruction of instructions) {
    for (const d of instruction) {
      const delta = DELTAS[d];
      const x = position.x + delta.x;
      const y = position.y + delta.y;
      if (
        y >= 0 &&
        y < keypad.length &&
        x >= 0 &&
        x < keypad[y].length &&
        keypad[y][x] !== " "
      ) {
        position = { x, y };
      }
    }

    keycode += keypad[position.y][position.x];
  }

  return keycode;
}

const keypadPart1: Keypad = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

const keypadPart2: Keypad = [
  [" ", " ", "1", " ", " "],
  [" ", "2", "3", "4", " "],
  ["5", "6", "7", "8", "9"],
  [" ", "A", "B", "C", " "],
  [" ", " ", "D", " ", " "],
];
export default createSolverWithLineArray(async (input) => {
  return {
    first: computeKeycode(keypadPart1, { x: 1, y: 1 }, input),
    second: computeKeycode(keypadPart2, { x: 0, y: 2 }, input),
  };
});
