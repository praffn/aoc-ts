import { createSolver } from "../../solution";

function isValidTriangle(a: number, b: number, c: number): boolean {
  return a + b > c && a + c > b && b + c > a;
}

export default createSolver(async (input) => {
  const sideLengths: Array<number> = [];

  for await (const line of input) {
    const sides = line
      .trim()
      .split(/\s+/)
      .map((n) => Number.parseInt(n, 10));
    sideLengths.push(...sides);
  }

  let first = 0;

  for (let i = 0; i < sideLengths.length; i += 3) {
    if (
      isValidTriangle(sideLengths[i], sideLengths[i + 1], sideLengths[i + 2])
    ) {
      first++;
    }
  }

  let second = 0;
  for (let i = 0; i < sideLengths.length; i += 9) {
    for (let j = 0; j < 3; j++) {
      if (
        isValidTriangle(
          sideLengths[i + j],
          sideLengths[i + j + 3],
          sideLengths[i + j + 6]
        )
      ) {
        second++;
      }
    }
  }

  return {
    first,
    second,
  };
});
