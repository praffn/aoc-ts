import { add, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function turnRight(dir: Vec2): Vec2 {
  return makeVec2(-dir.y, dir.x);
}

function turnLeft(dir: Vec2): Vec2 {
  return makeVec2(dir.y, -dir.x);
}

function reverse(dir: Vec2): Vec2 {
  return makeVec2(-dir.x, -dir.y);
}

type State = "clean" | "weakened" | "infected" | "flagged";

function solveFirst(infectionMap: Map<string, State>, startPosition: Vec2) {
  let position = startPosition;
  let direction = makeVec2(0, -1);

  const iterations = 10_000;

  let infections = 0;
  for (let i = 0; i < iterations; i++) {
    const isInfected = infectionMap.has(`${position.x},${position.y}`);
    if (isInfected) {
      direction = turnRight(direction);
      infectionMap.delete(`${position.x},${position.y}`);
    } else {
      direction = turnLeft(direction);
      infectionMap.set(`${position.x},${position.y}`, "infected");
      infections++;
    }

    position = add(position, direction);
  }

  return infections;
}

function solveSecond(infectionMap: Map<string, State>, startPosition: Vec2) {
  let position = startPosition;
  let direction = makeVec2(0, -1);

  const iterations = 10_000_000;

  let infections = 0;
  for (let i = 0; i < iterations; i++) {
    const state = infectionMap.get(`${position.x},${position.y}`) ?? "clean";

    switch (state) {
      case "clean":
        direction = turnLeft(direction);
        infectionMap.set(`${position.x},${position.y}`, "weakened");
        break;
      case "weakened":
        infectionMap.set(`${position.x},${position.y}`, "infected");
        infections++;
        break;
      case "infected":
        direction = turnRight(direction);
        infectionMap.set(`${position.x},${position.y}`, "flagged");
        break;
      case "flagged":
        direction = reverse(direction);
        infectionMap.set(`${position.x},${position.y}`, "clean");
        break;
    }

    position = add(position, direction);
  }

  return infections;
}

export default createSolverWithLineArray(async (input) => {
  const startPosition = makeVec2(
    Math.floor(input[0].length / 2),
    Math.floor(input.length / 2)
  );
  const infectionMap = new Map<string, State>();

  for (let y = 0; y < input.length; y++) {
    for (let x = 0; x < input[y].length; x++) {
      if (input[y][x] === "#") {
        infectionMap.set(`${x},${y}`, "infected");
      }
    }
  }

  return {
    first: solveFirst(new Map(infectionMap), startPosition),
    second: solveSecond(infectionMap, startPosition),
  };
});
