import { chunk } from "../../lib/iter";
import { makeVec2, zero } from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";
import { HALT_TERMINATED, IntcodeCPU } from "./intcode";

/**
 * Runs a single iteration of the game and returns the number of block tiles.
 */
function getBlockCount(cpu: IntcodeCPU) {
  cpu.run();
  let blockTiles = 0;
  for (const [, , id] of chunk(cpu.output.dequeueIterator(), 3)) {
    if (id === 2) {
      blockTiles++;
    }
  }

  return blockTiles;
}

/**
 * Starts the game with 2 quarters and plays it until all blocks are broken.
 * We do this by trying to keep the paddle under the ball at all times.
 * Returns the final score.
 */
function play(cpu: IntcodeCPU) {
  cpu.setMemory(0, 2);

  let score = -1;

  while (true) {
    const haltReason = cpu.run();

    let paddleX = 0;
    let ballX = 0;

    for (const [x, y, id] of chunk(cpu.output.dequeueIterator(), 3)) {
      if (x === -1 && y === 0) {
        // Score output
        score = id;
        continue;
      }
      if (id === 3) {
        // Update paddle position
        paddleX = x;
        continue;
      }
      if (id === 4) {
        // Update ball position
        ballX = x;
        continue;
      }
    }

    if (haltReason === HALT_TERMINATED) {
      // game finished, terminate
      break;
    }

    // Move the paddle towards the ball
    cpu.writeInput(Math.sign(ballX - paddleX));
  }

  return score;
}

export default createSolverWithString(async (input) => {
  const cpu = new IntcodeCPU(input);

  const first = getBlockCount(cpu);
  cpu.reset();
  const second = play(cpu);

  return {
    first,
    second,
  };
});
