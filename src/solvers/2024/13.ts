import { add, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function solveDiophantineEquation(
  a: Vec2,
  b: Vec2,
  c: Vec2
): [number, number] | undefined {
  const det = a.x * b.y - a.y * b.x;
  if (det === 0) {
    return;
  }

  const detM = c.x * b.y - c.y * b.x;
  const detN = a.x * c.y - a.y * c.x;

  const m = detM / det;
  const n = detN / det;

  if (Number.isInteger(m) && Number.isInteger(n)) {
    return [m, n];
  }
}

const re = /([+-]?\d+)/g;

export default createSolverWithLineArray(async (input) => {
  const machines: Array<[Vec2, Vec2, Vec2]> = [];

  for (let i = 0; i < input.length; i += 4) {
    const [ax, ay] = input[i + 0].matchAll(re);
    const [bx, by] = input[i + 1].matchAll(re);
    const [cx, cy] = input[i + 2].matchAll(re);

    machines.push([
      makeVec2(Number.parseInt(ax[0]), Number.parseInt(ay[0])),
      makeVec2(Number.parseInt(bx[0]), Number.parseInt(by[0])),
      makeVec2(Number.parseInt(cx[0]), Number.parseInt(cy[0])),
    ]);
  }

  const addVec = makeVec2(10_000_000_000_000);

  let minTokensFirst = 0;
  let minTokensSecond = 0;
  for (const [a, b, c] of machines) {
    const solution1 = solveDiophantineEquation(a, b, c);
    if (solution1) {
      minTokensFirst += solution1[0] * 3 + solution1[1];
    }
    const solution2 = solveDiophantineEquation(a, b, add(c, addVec));
    if (solution2) {
      minTokensSecond += solution2[0] * 3 + solution2[1];
    }
  }

  return {
    first: minTokensFirst,
    second: minTokensSecond,
  };
});
