import { UndirectedGraph } from "../../lib/graph/undirected-graph";
import { combinations } from "../../lib/iter";
import {
  magnitudeSquared,
  sub,
  makeVec3,
  key,
  type Vec3,
} from "../../lib/linalg/vec3";
import { createSolverWithLineArray } from "../../solution";

/**
 * Parses the input into a list of Vec3, representing the position of
 * each junction box.
 */
function parse(input: Array<string>): Array<Vec3> {
  return input.map((line) => {
    const [x, y, z] = line.split(",").map((n) => Number.parseInt(n));
    return makeVec3(x, y, z);
  });
}

/**
 * Returns a list of pairs of points, sorted by the distances between them in
 * ascending order.
 */
function getPairsByDistance(points: Array<Vec3>) {
  const pairs = Array.from(combinations(points, 2)).map(
    ([a, b]) => [a, b, magnitudeSquared(sub(a, b))] as const
  );

  return pairs.sort((a, b) => a[2] - b[2]);
}

export default createSolverWithLineArray(async (input, _, toConnect = 1000) => {
  const boxes = parse(input);

  // We're going to use an undirected graph to represent the circuits
  const circuitGraph = new UndirectedGraph<Vec3>(key);
  boxes.forEach((box) => circuitGraph.addVertex(box));

  // Now, let's connect the first `toConnect` pairs of boxes
  const pairs = getPairsByDistance(boxes);
  const firstPairs = pairs.slice(0, toConnect);
  const remainingPairs = pairs.slice(toConnect);

  for (const [a, b] of firstPairs) {
    circuitGraph.addEdge(a, b);
  }

  // We've connected the first 1000 pairs. Let's find the three largest
  // connected components (i.e. largest circuits by number of boxes)
  const connectedComponents = Array.from(
    circuitGraph.connectedComponents()
  ).sort((a, b) => b.size - a.size);
  const largestComponents = connectedComponents.slice(0, 3);

  // The solution to the first part is the product of the sizes of the three
  // largest components:
  const first = largestComponents.reduce((acc, curr) => acc * curr.size, 1);

  // Now, on to part 2. Lets connect the remaining pairs until ALL boxes have
  // been connected, i.e. there is **no** isolated vertex in the graph.
  //
  // The solution is the product of the x coordinates of the two boxes that
  // were connected last.

  let second = -1;
  for (const [a, b] of remainingPairs) {
    circuitGraph.addEdge(a, b);

    if (!circuitGraph.hasIsolatedVertices()) {
      second = a.x * b.x;
      break;
    }
  }

  return {
    first,
    second,
  };
});
