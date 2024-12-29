import { createSolver } from "../../solution";

function scanner(height: number, t: number) {
  const offset = t % ((height - 1) * 2);

  if (offset > height - 1) {
    return 2 * (height - 1) - offset;
  }

  return offset;
}

function computeSeverity(heightMap: Map<number, number>, t: number) {
  let severity = 0;
  for (const [position, height] of heightMap) {
    if (scanner(height, position + t) === 0) {
      severity += position * height;
    }
  }

  return severity;
}

function findWaitTime(heightMap: Map<number, number>) {
  let waitTime = 0;
  while (true) {
    const isAllZero = heightMap.entries().every(([position, height]) => {
      return scanner(height, position + waitTime) !== 0;
    });

    if (isAllZero) {
      return waitTime;
    }

    waitTime++;
  }
}

export default createSolver(async (input) => {
  const heightMap = new Map<number, number>();
  for await (const line of input) {
    const [position, height] = line.split(": ");
    heightMap.set(Number.parseInt(position), Number.parseInt(height));
  }

  return {
    first: computeSeverity(heightMap, 0),
    second: findWaitTime(heightMap),
  };
});
