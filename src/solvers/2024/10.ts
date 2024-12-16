import { allPaths } from "../../lib/graph/algos";
import { DirectedGraph } from "../../lib/graph/DirectedGraph";
import { Grid2D } from "../../lib/grid/grid2d";
import { createSolverWithLineArray } from "../../solution";

export default createSolverWithLineArray(async (input) => {
  // the topographic map
  const map = Grid2D.from2DArray(
    input.map((line) => line.split("").map((n) => Number.parseInt(n, 10)))
  );
  // directed graph. edges go from any node with height h to any neighbor with heigh h + 1
  const graph = new DirectedGraph();
  // map from height to set of coordinates of that height
  const heightToCoords = new Map<number, Set<string>>();

  for (const [height, x, y] of map) {
    const coords = `${x},${y}`;
    heightToCoords.set(
      height,
      (heightToCoords.get(height) || new Set()).add(coords)
    );

    for (const { value: neighborHeight, x: nx, y: ny } of map.neighbors(x, y)) {
      // if the neighbor is one unit taller, add an edge
      if (neighborHeight - height === 1) {
        const neighborCoords = `${nx},${ny}`;
        graph.addEdge(coords, neighborCoords);
      }
    }
  }

  // loop through all coordinates at height 0
  // find all paths from each of them to any coordinate at height 9
  const zeroCoords = heightToCoords.get(0)!;
  const nineCoords = heightToCoords.get(9)!;
  let totalPaths = 0;
  const uniques = new Set<string>();
  for (const coord of zeroCoords) {
    for (const path of allPaths(graph, coord, ...nineCoords)) {
      totalPaths++;
      const start = path[0];
      const end = path[path.length - 1];
      uniques.add(`${start}->${end}`);
    }
  }

  return {
    first: uniques.size,
    second: totalPaths,
  };
});
