import { cartesianRange, range } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

function solveFirst(n: number) {
  const oddSquare = Math.ceil(Math.sqrt(n));

  for (const k of range(4)) {
    const p = oddSquare ** 2 - k * (oddSquare - 1);
    const dist = Math.abs(p - n);
    if (dist <= Math.floor((oddSquare - 1) / 2)) {
      return oddSquare - 1 - dist;
    }
  }

  throw new Error("unreachable");
}

const directions = [
  [0, 1, 0],
  [0, 0, -1],
  [1, -1, 0],
  [1, 0, 1],
];

function* spiral() {
  const sums = new Map<string, number>();
  sums.set("0,0", 1);

  let i = 0;
  let j = 0;
  let n = 1;
  while (true) {
    for (const [ds, di, dj] of directions) {
      for (const _ of range(n + ds)) {
        i += di;
        j += dj;
        let sum = 0;
        for (const [k, l] of cartesianRange(i - 1, i + 2, j - 1, j + 2)) {
          sum += sums.get(`${k},${l}`) ?? 0;
        }

        sums.set(`${i},${j}`, sum);
        yield sum;
      }
    }
    n += 2;
  }
}

function solveSecond(n: number) {
  for (const x of spiral()) {
    if (x > n) {
      return x;
    }
  }

  throw new Error("unreachable");
}

export default createSolverWithString(async (input) => {
  const n = Number.parseInt(input, 10);

  return {
    first: solveFirst(n),
    second: solveSecond(n),
  };
});
