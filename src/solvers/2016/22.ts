import { Grid2D } from "../../lib/grid/grid2d";
import { permutations } from "../../lib/iter";
import { key, makeVec2 } from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

interface Node {
  x: number;
  y: number;
  size: number;
  used: number;
  avail: number;
}

const re = /x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T/;

export default createSolverWithLineArray(async (input) => {
  const nodes: Array<Node> = [];

  for await (const line of input.slice(2)) {
    const [, x, y, size, used, avail] = line.match(re)!;
    nodes.push({
      x: Number.parseInt(x),
      y: Number.parseInt(y),
      size: Number.parseInt(size),
      used: Number.parseInt(used),
      avail: Number.parseInt(avail),
    });
  }

  // Part 1: Find all viable pairs
  const viablePairs: Array<[Node, Node]> = [];
  for (const [a, b] of permutations(nodes, 2)) {
    if (a.used === 0 || a.used > b.avail) {
      continue;
    }

    viablePairs.push([a, b]);
  }

  // Part 2:
  // 1) We make a grid of the nodes
  // 2) Find the empty node
  // 3) Find steps to move it to the top
  // 4) Find steps to move next to the goal
  // 5) Move goal into empty
  // 6) Move goal to start
  const width = Math.max(...nodes.map((n) => n.x)) + 1;
  const height = Math.max(...nodes.map((n) => n.y)) + 1;
  const grid = new Grid2D<Node>(width, height);
  for (const node of nodes) {
    grid.set(node.x, node.y, node);
  }

  const emptyNode = nodes.find((n) => n.used === 0)!;

  // Returns [steps, x-position]
  function stepsToTop(node: Node): [number, number] {
    const start = makeVec2(node.x, node.y);
    const queue = [start];
    const dist = new Map<string, number>();
    dist.set(key(start), 0);

    while (queue.length > 0) {
      const current = queue.shift()!;
      const currentDistance = dist.get(key(current))!;
      const size = grid.at(current.x, current.y).size;
      if (current.y === 0) {
        return [dist.get(key(current))!, current.x];
      }
      for (const { value: node, x, y } of grid.neighbors(
        current.x,
        current.y
      )) {
        const position = makeVec2(x, y);
        const positionKey = key(position);
        if (dist.has(positionKey)) {
          continue;
        }

        if (node.used > size) {
          continue;
        }

        dist.set(positionKey, currentDistance + 1);
        queue.push(makeVec2(x, y));
      }
    }

    throw new Error("no path found");
  }

  let [steps, x] = stepsToTop(emptyNode);
  // move to the left of the goal
  steps += width - 2 - x;
  // move the goal to the left of the empty node
  steps += 1;
  // move empty space from behind to in front and finally move goal
  steps += 5 * (width - 2);

  return {
    first: viablePairs.length,
    second: steps,
  };
});
