import { directions, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

function dir(s: string) {
  switch (s) {
    case "R":
    case "0":
      return directions.east;
    case "D":
    case "1":
      return directions.south;
    case "L":
    case "2":
      return directions.west;
    case "U":
    case "3":
      return directions.north;
    default:
      throw new Error(`Invalid direction: ${s}`);
  }
}

type Instruction = [direction: Vec2, steps: number];

function parse(input: Array<string>): [Array<Instruction>, Array<Instruction>] {
  const first: Array<Instruction> = [];
  const second: Array<Instruction> = [];

  for (const line of input) {
    const [d, steps, color] = line.split(" ");
    first.push([dir(d), +steps]);
    second.push([dir(color[7]), Number.parseInt(color.slice(2, 7), 16)]);
  }

  return [first, second];
}

function getArea(instructions: Array<Instruction>): number {
  let p = 0;
  let area = 1;

  for (const [dir, steps] of instructions) {
    p += dir.x * steps;
    area += dir.y * steps * p + steps / 2;
  }

  return area;
}

export default createSolverWithLineArray(async (input) => {
  const [first, second] = parse(input);

  return {
    first: getArea(first),
    second: getArea(second),
  };
});
