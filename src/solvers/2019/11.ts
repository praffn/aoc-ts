import { StructuralMap } from "../../lib/collections/structural-map";
import {
  add,
  directions,
  key,
  makeVec2,
  zero,
  type Vec2,
} from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";
import { HALT_TERMINATED, IntcodeCPU } from "./intcode";
import { Grid2D } from "../../lib/grid/grid2d";

/**
 * Turns the direction 90 degrees to the left if turn is 0, otherwise right
 * (it actually turns right when turning left and vice versa, but that's
 * because the axes are flipped)
 */
function turn90(direction: Vec2, turn: number): Vec2 {
  return turn === 0
    ? makeVec2(-direction.y, direction.x)
    : makeVec2(direction.y, -direction.x);
}

/**
 * Given a CPU and a starting color, performs the painting operation
 * returning a map of positions to colors
 */
function performPaint(
  cpu: IntcodeCPU,
  startColor: number
): StructuralMap<Vec2, number> {
  let currentPosition = zero;
  let currentDirection = directions.south;

  const paintMap = new StructuralMap(key, [[currentPosition, startColor]]);

  while (true) {
    cpu.writeInput(paintMap.get(currentPosition) ?? 0);
    const haltReason = cpu.run();

    const color = cpu.output.dequeue();
    const turn = cpu.output.dequeue();

    paintMap.set(currentPosition, color);
    currentDirection = turn90(currentDirection, turn);
    currentPosition = add(currentPosition, currentDirection);

    if (haltReason === HALT_TERMINATED) {
      break;
    }
  }

  return paintMap;
}

/**
 * Takes a paint map and paints it to a grid, restricting size of only known
 * painted areas.
 */
function paintToGrid(paintMap: StructuralMap<Vec2, number>) {
  const vecs = Array.from(paintMap.keys());
  const minX = Math.min(...vecs.map((v) => v.x));
  const minY = Math.min(...vecs.map((v) => v.y));
  const maxX = Math.max(...vecs.map((v) => v.x));
  const maxY = Math.max(...vecs.map((v) => v.y));

  const grid = new Grid2D(maxX - minX + 1, maxY - minY + 1, " ");

  for (const [position, color] of paintMap) {
    grid.set(position.x - minX, maxY - position.y, color === 1 ? "#" : " ");
  }

  return grid;
}

export default createSolverWithString(async (input) => {
  const cpu = new IntcodeCPU(input);

  const paintMapWithBlackStart = performPaint(cpu, 0);

  // Uncomment below code to print solution to part 2
  // cpu.reset();
  // const paintMapWithWhiteStart = performPaint(cpu, 1);
  // const grid = paintToGrid(paintMapWithWhiteStart);
  // console.log(grid.toString());

  return {
    first: paintMapWithBlackStart.size,
    second: "uncomment and see console",
  };
});
