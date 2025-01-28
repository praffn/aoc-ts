import {
  add,
  directions,
  makeVec2,
  manhattan,
  scale,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function turn(direction: Vec2, angle: number): Vec2 {
  const normalizedAngle = ((angle % 360) + 360) % 360;

  switch (normalizedAngle) {
    case 90:
      return makeVec2(-direction.y, direction.x);

    case 180:
      return makeVec2(-direction.x, -direction.y);

    case 270:
      return makeVec2(direction.y, -direction.x);

    default:
      return direction;
  }
}

function solveFirst(input: Array<[string, number]>) {
  let position = zero;
  let direction = directions.east;

  for (const [action, value] of input) {
    switch (action) {
      case "N":
        position = add(position, scale(directions.north, value));
        break;
      case "S":
        position = add(position, scale(directions.south, value));
        break;
      case "E":
        position = add(position, scale(directions.east, value));
        break;
      case "W":
        position = add(position, scale(directions.west, value));
        break;
      case "L":
        direction = turn(direction, -value);
        break;
      case "R":
        direction = turn(direction, value);
        break;
      case "F":
        position = add(position, scale(direction, value));
        break;
    }
  }

  return manhattan(position);
}

function solveSecond(input: Array<[string, number]>) {
  let position = zero;
  let waypoint = makeVec2(10, -1);

  for (const [action, value] of input) {
    switch (action) {
      case "N":
        waypoint = add(waypoint, scale(directions.north, value));
        break;
      case "S":
        waypoint = add(waypoint, scale(directions.south, value));
        break;
      case "E":
        waypoint = add(waypoint, scale(directions.east, value));
        break;
      case "W":
        waypoint = add(waypoint, scale(directions.west, value));
        break;
      case "L":
        waypoint = turn(waypoint, -value);
        break;
      case "R":
        waypoint = turn(waypoint, value);
        break;
      case "F":
        position = add(position, scale(waypoint, value));
        break;
    }
  }

  return manhattan(position);
}

function parseActions(input: Array<string>): Array<[string, number]> {
  return input.map((line) => [line[0], Number.parseInt(line.slice(1))]);
}

export default createSolverWithLineArray(async (input) => {
  const actions = parseActions(input);

  return {
    first: solveFirst(actions),
    second: solveSecond(actions),
  };
});
