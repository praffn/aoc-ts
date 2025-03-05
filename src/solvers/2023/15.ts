import { enumerate, sum } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

function hash(str: string): number {
  let v = 0;
  for (const c of str) {
    v += c.charCodeAt(0);
    v *= 17;
    v %= 256;
  }

  return v;
}

type Instruction = {
  instruction: string;
  label: string;
} & (
  | {
      op: "remove";
    }
  | {
      op: "add";
      lens: number;
    }
);

const re = /(\w+)(-|=)(\d)?/;

function parse(input: string): Array<Instruction> {
  const instructions: Array<Instruction> = [];

  for (const str of input.split(",")) {
    const [, label, op, lens] = str.match(re)!;
    if (op === "-") {
      instructions.push({
        instruction: str,
        label,
        op: "remove",
      });
    } else {
      instructions.push({
        instruction: str,
        label,
        op: "add",
        lens: +lens,
      });
    }
  }

  return instructions;
}

/**
 * Follows the instructions and installs the lenses as described
 */
function installLenses(sequence: Array<Instruction>) {
  // We depend on the built-in Map to iterate in insertion order
  const boxes = Array.from({ length: 256 }, () => new Map<string, number>());

  for (const instruction of sequence) {
    const label = instruction.label;
    const box = boxes[hash(label)];

    if (instruction.op === "add") {
      box.set(label, instruction.lens);
    } else {
      box.delete(label);
    }
  }

  return boxes;
}

/**
 * Returns the sum of the focusing power of every lens
 */
function computeTotalFocusingPower(boxes: Array<Map<unknown, number>>) {
  let totalFocusingPower = 0;
  for (const [i, box] of boxes.entries()) {
    for (const [slot, focalLength] of enumerate(box.values())) {
      totalFocusingPower += (i + 1) * (slot + 1) * focalLength;
    }
  }

  return totalFocusingPower;
}

export default createSolverWithString(async (input) => {
  const instructions = parse(input);

  return {
    first: sum(instructions.map((i) => hash(i.instruction))),
    second: computeTotalFocusingPower(installLenses(instructions)),
  };
});
