import { createSolverWithString } from "../../solution";

type Vec2 = { x: number; y: number };

function rotate(v: Vec2, rotation: 1 | -1): Vec2 {
  return {
    x: v.y * rotation,
    y: v.x * -rotation,
  };
}

function manhattanDistance(v: Vec2): number {
  return Math.abs(v.x) + Math.abs(v.y);
}

function getKey(v: Vec2): string {
  return `${v.x},${v.y}`;
}

export default createSolverWithString(async (input) => {
  const instructions = input.split(", ").map((instruction) => {
    return {
      rotation: instruction[0] === "R" ? 1 : -1,
      distance: parseInt(instruction.slice(1)),
    } as const;
  });

  const position = { x: 0, y: 0 };
  let direction = { x: 0, y: 1 };

  const visited = new Set<string>();
  let firstVisitedTwice: Vec2 | undefined;

  for (const { rotation, distance } of instructions) {
    direction = rotate(direction, rotation);

    for (let i = 0; i < distance; i++) {
      position.x += direction.x;
      position.y += direction.y;

      if (!firstVisitedTwice) {
        const key = getKey(position);
        if (visited.has(key)) {
          firstVisitedTwice = { ...position };
        }
        visited.add(key);
      }
    }
  }

  return {
    first: manhattanDistance(position),
    second: manhattanDistance(firstVisitedTwice!),
  };
});
