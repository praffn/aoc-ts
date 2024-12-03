import { createSolver } from "../../solution";

function lowestPair(a: number, b: number, c: number): [number, number] {
  let min1 = Infinity;
  let min2 = Infinity;

  if (a < b) {
    min1 = a;
    min2 = b;
  } else {
    min1 = b;
    min2 = a;
  }

  if (c < min1) {
    min2 = min1;
    min1 = c;
  } else if (c < min2) {
    min2 = c;
  }

  return [min1, min2];
}

function area(a: number, b: number, c: number): number {
  return 2 * a * b + 2 * b * c + 2 * c * a;
}

export function computeRequiredWrappingMaterials(
  w: number,
  l: number,
  h: number
): [paper: number, ribbon: number] {
  const [smallA, smallB] = lowestPair(w, l, h);
  const paper = area(w, l, h) + smallA * smallB;

  const ribbon = smallA * 2 + smallB * 2 + w * l * h;

  return [paper, ribbon];
}

export default createSolver(async (input) => {
  let totalPaper = 0;
  let totalRibbon = 0;

  for await (const line of input) {
    const [w, l, h] = line.split("x").map((n) => Number.parseInt(n, 10));
    const [paper, ribbon] = computeRequiredWrappingMaterials(w, l, h);

    totalPaper += paper;
    totalRibbon += ribbon;
  }

  return {
    first: totalPaper,
    second: totalRibbon,
  };
});
