import { Grid2D } from "../../lib/grid/grid2d";
import { count } from "../../lib/iter";
import { createSolverWithString } from "../../solution";
import { knothash } from "./knothash";

export default createSolverWithString(async (input) => {
  const grid = new Grid2D(128, 128, false);

  for (let row = 0; row < 128; row++) {
    const hash = BigInt("0x" + knothash(`${input}-${row}`));
    for (let col = 0; col < 128; col++) {
      grid.set(col, row, ((hash >> BigInt(127 - col)) & 1n) === 1n);
    }
  }

  const usedSquaresCount = grid.count((set) => set);
  const regionCount = count(grid.regions((set) => set));

  return {
    first: usedSquaresCount,
    second: regionCount,
  };
});
