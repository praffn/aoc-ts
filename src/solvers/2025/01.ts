import { mod } from "../../lib/math/math";
import { createSolverWithLineArray } from "../../solution";

function parseRotation(line: string) {
  const direction = line[0];
  const distance = Number.parseInt(line.slice(1), 10);

  switch (direction) {
    case "L":
      return -distance;
    case "R":
      return distance;
    default:
      throw new Error(`Invalid direction: ${direction}`);
  }
}

const DIAL_SIZE = 100;
const DIAL_INITIAL_POSITION = 50;

function solve(
  startPosition: number,
  dialSize: number,
  rotations: Array<number>
) {
  let position = startPosition;
  let zeroEndings = 0;
  let zeroCrossings = 0;

  for (const rotation of rotations) {
    if (rotation === 0) continue;

    const newPosition = mod(position + rotation, dialSize);
    if (newPosition === 0) {
      zeroEndings++;
    }

    if (rotation > 0) {
      // Moving forward (clockwise)
      if (position === 0) {
        // Starting at 0, moving forward - count only complete wraps
        zeroCrossings += Math.floor(rotation / dialSize);
      } else {
        // Not starting at 0
        // We pass/land on 0 if position + rotation >= dialSize
        // Count: ceil((position + rotation - dialSize + 1) / dialSize) if >= dialSize
        const totalSteps = position + rotation;
        if (totalSteps >= dialSize) {
          // How many times do we hit 0?
          // First time at step (dialSize - position), then every dialSize after
          zeroCrossings += Math.floor((totalSteps - dialSize) / dialSize) + 1;
        }
      }
    } else {
      // Moving backward (counter-clockwise)
      if (position === 0) {
        // Starting at 0, moving backward - count only complete wraps
        zeroCrossings += Math.floor(Math.abs(rotation) / dialSize);
      } else {
        // Not starting at 0
        // We pass/land on 0 going backward
        const stepsBackward = Math.abs(rotation);
        if (stepsBackward >= position) {
          // We reach 0 at least once
          // First time after 'position' steps, then every dialSize after
          const stepsAfterFirst = stepsBackward - position;
          zeroCrossings += 1 + Math.floor(stepsAfterFirst / dialSize);
        }
      }
    }

    position = newPosition;
  }

  return { zeroEndings, zeroCrossings };
}

export default createSolverWithLineArray(async (input) => {
  const rotations = input.map(parseRotation);

  const { zeroEndings, zeroCrossings } = solve(
    DIAL_INITIAL_POSITION,
    DIAL_SIZE,
    rotations
  );

  return {
    first: zeroEndings,
    second: zeroCrossings,
  };
});
