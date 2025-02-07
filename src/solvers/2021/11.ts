import { Array2D } from "../../lib/collections/array2d";
import { createSolverWithLineArray } from "../../solution";

class OctopusGrid {
  #grid: Array2D<number>;
  #flashes = 0;

  constructor(lines: Array<string>) {
    this.#grid = new Array2D(
      lines.map((line) => line.split("").map((c) => Number.parseInt(c, 10)))
    );
  }

  /**
   * Flashes the octopus at the given position and increments the energy level
   * for all of its neighbors. It will recursively flash any neighbor that
   * reaches an energy level of 10.
   *
   * This method is only called after every octopus has been incremented by 1,
   * so we can safely assume that any octopus with an energy level of 0 has
   * already been flashed and can be skipped.
   */
  #flash(x: number, y: number) {
    // Increment the number of flashes
    this.#flashes++;
    // And set the energy level to 0
    this.#grid.set(x, y, 0);

    // Go through every moore neighbor (cardinal and diagonal)
    for (const [v, nx, ny] of this.#grid.mooreNeighbors(x, y)) {
      // Skip if the energy level is 0 (already flashed)
      if (v === 0) {
        continue;
      }

      // Increment the energy level
      this.#grid.set(nx, ny, v + 1);
      // Recursively flash if the energy level is 10
      if (v + 1 >= 10) {
        this.#flash(nx, ny);
      }
    }
  }

  /**
   * Runs the octopus simulation until all octopuses flash at the same time.
   * It returns the number of steps it took as well as the amount of flashes
   * that had occured at 100 steps.
   */
  solve(): [number, number] {
    let t = 0;
    let flashesAt100 = 0;

    while (true) {
      t++;
      for (const [v, x, y] of this.#grid.entries()) {
        this.#grid.set(x, y, v + 1);
      }
      for (const [v, x, y] of this.#grid.entries()) {
        if (v === 10) {
          this.#flash(x, y);
        }
      }

      let done = true;
      for (const [v, x, y] of this.#grid.entries()) {
        if (v !== 0) {
          done = false;
        }
      }

      if (t === 100) {
        flashesAt100 = this.#flashes;
      }

      if (done) {
        break;
      }
    }

    return [t, flashesAt100];
  }
}

export default createSolverWithLineArray(async (input) => {
  const octopusGrid = new OctopusGrid(input);
  const [lastStep, flashesAtStep100] = octopusGrid.solve();

  return {
    first: flashesAtStep100,
    second: lastStep,
  };
});
