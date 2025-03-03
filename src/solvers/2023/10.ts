import { StructuralSet } from "../../lib/collections/structural-set";
import { DirectedGraph } from "../../lib/graph/directed-graph";
import {
  add,
  cross,
  directions,
  equals,
  key,
  makeVec2,
  type Vec2,
  zero,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

/**
 * Parses the input and returns the position of the animal and the directed
 * graph representing pipes and their connections.
 */
function parse(input: Array<string>): [Vec2, DirectedGraph<Vec2>] {
  const graph = new DirectedGraph<Vec2>(key);

  let animal = zero;

  for (const [y, line] of input.entries()) {
    for (const [x, char] of line.split("").entries()) {
      if (char === ".") {
        continue;
      }

      // Add proper connections depending on pipe type
      const position = makeVec2(x, y);
      switch (char) {
        case "|":
          graph.addEdge(position, add(position, directions.north));
          graph.addEdge(position, add(position, directions.south));
          break;
        case "-":
          graph.addEdge(position, add(position, directions.east));
          graph.addEdge(position, add(position, directions.west));
          break;
        case "L":
          graph.addEdge(position, add(position, directions.north));
          graph.addEdge(position, add(position, directions.east));
          break;
        case "J":
          graph.addEdge(position, add(position, directions.north));
          graph.addEdge(position, add(position, directions.west));
          break;
        case "7":
          graph.addEdge(position, add(position, directions.south));
          graph.addEdge(position, add(position, directions.west));
          break;
        case "F":
          graph.addEdge(position, add(position, directions.south));
          graph.addEdge(position, add(position, directions.east));
          break;
        case "S":
          animal = position;
          // We've found the animal. The pipe at the animal position is unknown
          // but we just need to connect to any pipes around it that connect to
          // this position.

          // Connect north if pipe above connects south
          if ("|7F".includes(input[y - 1]?.[x])) {
            graph.addEdge(position, add(position, directions.north));
          }

          // Connect south if pipe below connects north
          if ("|LJ".includes(input[y + 1]?.[x])) {
            graph.addEdge(position, add(position, directions.south));
          }

          // Connect west if pipe to the left connects east
          if ("-LF".includes(input[y]?.[x - 1])) {
            graph.addEdge(position, add(position, directions.west));
          }

          // Connect east if pipe to the right connects west
          if ("-7J".includes(input[y]?.[x + 1])) {
            graph.addEdge(position, add(position, directions.east));
          }

          break;
      }
    }
  }

  return [animal, graph];
}

/**
 * Returns the path that makes up the loop in the graph starting from the given
 * start position.
 */
function findLoopPath(graph: DirectedGraph<Vec2>, from: Vec2) {
  const seen = new StructuralSet(key);
  const stack: Array<Array<Vec2>> = [[from]];

  while (stack.length > 0) {
    const currentPath = stack.pop()!;
    const current = currentPath.at(-1)!;
    const parent = currentPath.at(-2);

    seen.add(current);

    for (const neighbor of graph.neighbors(current)) {
      if (parent && equals(neighbor, parent)) {
        continue;
      }

      if (seen.has(neighbor)) {
        return currentPath;
      }

      stack.push(currentPath.concat(neighbor));
    }
  }

  throw new Error("No loop found");
}

/**
 * Returns the interior area of the simple polygon defined by the given points.
 */
function interiorArea(points: Array<Vec2>) {
  // First we're gonna do the shoelace algorithm to find the area of the polygon
  let area = 0;

  for (let i = 0; i < points.length; i++) {
    const a = points[i];
    const b = points[(i + 1) % points.length];
    area += cross(a, b);
  }

  // Then using Pick's theorem we can find the interior area
  return (Math.abs(area) - points.length + 3) >> 1;
}

export default createSolverWithLineArray(async (input) => {
  const [animalPosition, graph] = parse(input);

  const loopPath = findLoopPath(graph, animalPosition);

  return {
    // The furthest position in the loop is just the middle of the loop
    first: Math.ceil(loopPath.length / 2),
    second: interiorArea(loopPath),
  };
});
