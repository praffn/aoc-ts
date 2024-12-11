import { sum } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

const blinkCache = new Map<string, number>();
function blink(stone: number, blinks: number): number {
  const key = `${stone}:${blinks}`;
  if (blinkCache.has(key)) {
    return blinkCache.get(key)!;
  }

  if (blinks === 0) {
    return 1;
  }

  if (stone === 0) {
    const result = blink(1, blinks - 1);
    blinkCache.set(key, result);
    return result;
  }

  const stoneString = stone.toString();
  if (stoneString.length % 2 === 0) {
    const mid = stoneString.length / 2;
    const left = stoneString.slice(0, mid);
    const right = stoneString.slice(mid);
    const result =
      blink(Number.parseInt(left, 10), blinks - 1) +
      blink(Number.parseInt(right, 10), blinks - 1);
    blinkCache.set(key, result);
    return result;
  }

  const result = blink(stone * 2024, blinks - 1);
  blinkCache.set(key, result);
  return result;
}

export default createSolverWithString(async (input) => {
  let stones: Array<number> = [];
  stones.push(...input.split(" ").map((n) => Number.parseInt(n, 10)));

  const first = sum(stones.map((stone) => blink(stone, 25)));
  const second = sum(stones.map((stone) => blink(stone, 75)));

  return {
    first,
    second,
  };
});
