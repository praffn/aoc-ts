import { createSolver } from "../../solution";

const instructionRegex = /([^\d]*) (\d+),(\d+) through (\d+),(\d+)/;

interface Instruction {
  type: "toggle" | "turn on" | "turn off";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

function parseInstruction(raw: string): Instruction {
  const match = raw.match(instructionRegex)!;

  return {
    type: match[1] as Instruction["type"],
    x1: Number.parseInt(match[2], 10),
    y1: Number.parseInt(match[3], 10),
    x2: Number.parseInt(match[4], 10),
    y2: Number.parseInt(match[5], 10),
  };
}

export default createSolver(async (input) => {
  // Each is a 1d array representing a 1000x1000 grid of lights
  // onOffGrid is for for part 1: whether lights are on or off
  const onOffGrid = Array(1000 * 1000).fill(false);
  // brightnessGrid is for part 2: the brightness of each light
  const brightnessGrid = Array(1000 * 1000).fill(0);

  for await (const line of input) {
    const instruction = parseInstruction(line);

    for (let y = instruction.y1; y <= instruction.y2; y++) {
      for (let x = instruction.x1; x <= instruction.x2; x++) {
        const index = y * 1000 + x;
        switch (instruction.type) {
          case "toggle":
            onOffGrid[index] = !onOffGrid[index];
            brightnessGrid[index] += 2;
            break;
          case "turn on":
            onOffGrid[index] = true;
            brightnessGrid[index]++;
            break;
          case "turn off":
            onOffGrid[index] = false;
            brightnessGrid[index] = Math.max(0, brightnessGrid[index] - 1);
            break;
        }
      }
    }
  }

  const first = onOffGrid.filter((x) => x).length;
  const second = brightnessGrid.reduce((a, b) => a + b, 0);

  return {
    first,
    second,
  };
});
