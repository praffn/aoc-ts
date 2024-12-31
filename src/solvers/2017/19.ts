import { Grid2D } from "../../lib/grid/grid2d";
import { add, makeVec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

const DIRECTIONS = {
  up: makeVec2(0, -1),
  down: makeVec2(0, 1),
  left: makeVec2(-1, 0),
  right: makeVec2(1, 0),
} as const;

export default createSolverWithLineArray(async (input) => {
  const grid = Grid2D.fromLines(input);

  let position = grid.findPositionVector((v, _, y) => {
    return v === "|" && y === 0;
  })!;
  let direction = DIRECTIONS.down;
  let steps = 0;
  const letters: Array<string> = [];
  while (true) {
    const currentChar = grid.atVector(position);

    if (currentChar === " ") {
      break;
    }

    steps++;

    if (currentChar === "|" || currentChar === "-") {
      position = add(position, direction);
      continue;
    }

    if (currentChar === "+") {
      let nextPosition = add(position, direction);
      let nextChar = grid.atVector(nextPosition);
      if (
        (nextChar === "-" && direction.y === 0) ||
        (nextChar === "|" && direction.x === 0)
      ) {
        position = nextPosition;
      } else {
        const turn1 = makeVec2(-direction.y, -direction.x);
        const turn2 = makeVec2(direction.y, direction.x);

        for (const turn of [turn1, turn2]) {
          nextPosition = add(position, turn);
          nextChar = grid.atVector(nextPosition);
          if (nextChar !== " ") {
            direction = turn;
            position = nextPosition;
            break;
          }
        }
      }
      continue;
    }

    if (currentChar !== " ") {
      letters.push(currentChar);
      position = add(position, direction);
      continue;
    }
  }

  return {
    first: letters.join(""),
    second: steps,
  };
});
