import { ComparePriorityQueue } from "../../lib/collections/compare-priority-queue";
import { count } from "../../lib/iter";
import {
  abs,
  add,
  makeVec3,
  manhattan,
  scale,
  sub,
  type Vec3,
} from "../../lib/linalg/vec3";
import { createSolverWithLineArray } from "../../solution";

type Nanobot = {
  position: Vec3;
  radius: number;
};

const re = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/;
function parseNanobot(line: string): Nanobot {
  const [, x, y, z, radius] = line.match(re)!;

  return {
    position: makeVec3(+x, +y, +z),
    radius: +radius,
  };
}

type Box = {
  min: Vec3;
  max: Vec3;
};

function makeBox(min: Vec3, max: Vec3): Box {
  return { min, max };
}

const UNIT_CUBE_CORNERS = [
  makeVec3(0, 0, 0),
  makeVec3(0, 0, 1),
  makeVec3(0, 1, 0),
  makeVec3(0, 1, 1),
  makeVec3(1, 0, 0),
  makeVec3(1, 0, 1),
  makeVec3(1, 1, 0),
  makeVec3(1, 1, 1),
];

/**
 * Returns true if the bot intersects the box, otherwise false
 */
function intersects(box: Box, bot: Nanobot) {
  const { position, radius } = bot;
  const { min, max } = box;
  const d = sub(
    add(abs(sub(position, min)), abs(sub(position, max))),
    sub(max, min)
  );

  const distance = Math.floor((d.x + d.y + d.z) / 2);

  return distance <= radius;
}

/**
 * Returns the total count of bots that intersect with the given box
 */
function intersectionCount(box: Box, nanobots: Array<Nanobot>) {
  return count(nanobots, (bot) => intersects(box, bot));
}

// Workload and compare workload are used for the priority queue
type Workload = {
  reach: number;
  boxSize: number;
  distanceToOrigin: number;
  box: Box;
};

function compareWorkload(a: Workload, b: Workload) {
  return (
    b.reach - a.reach ||
    b.boxSize - a.boxSize ||
    b.distanceToOrigin - a.distanceToOrigin
  );
}

function findDistanceToOriginWithMaxNanobotReach(nanobots: Array<Nanobot>) {
  // Find the maximum component of the nanobots, i.e. the maximum x, y, or z
  const maxComponent = nanobots.reduce((max, { position, radius }) => {
    const { x, y, z } = position;
    return Math.max(max, x + radius, y + radius, z + radius);
  }, 0);

  // Find the smallest power of 2 that is larger than the max component
  // That will be the initial "radius" of our box, where we know ALL nanobots
  // are within that box
  const initialBoxSize = 1 << Math.ceil(Math.log2(maxComponent));
  const initialBox = makeBox(
    makeVec3(-initialBoxSize),
    makeVec3(initialBoxSize)
  );

  // We use a priority queue that orders by reach then box size then distance to origin
  const pq = new ComparePriorityQueue(compareWorkload);
  pq.enqueue({
    reach: nanobots.length,
    boxSize: 2 * initialBoxSize,
    distanceToOrigin: 3 * initialBoxSize,
    box: initialBox,
  });

  while (!pq.isEmpty()) {
    const { boxSize, distanceToOrigin, box } = pq.dequeue();

    // when box size is back to 1 we've found the answer with highest reach
    if (boxSize === 1) {
      return distanceToOrigin;
    }

    // We half the box size and create 8 new boxes, each with half the size of
    // the previous box. We then calculate the reach of each box and enqueue
    // them in the priority queue
    const newBoxSize = Math.floor(boxSize >> 1);
    for (const corner of UNIT_CUBE_CORNERS) {
      const factor = scale(corner, newBoxSize);
      const newMin = add(box.min, factor);
      const newMax = add(newMin, makeVec3(newBoxSize));

      const newBox = makeBox(newMin, newMax);
      const newDistanceToOrigin = manhattan(newMin);
      const newReach = intersectionCount(newBox, nanobots);
      pq.enqueue({
        reach: newReach,
        boxSize: newBoxSize,
        distanceToOrigin: newDistanceToOrigin,
        box: newBox,
      });
    }
  }

  throw new Error("Unreachable: No solution found");
}

function findNanobotsInRangeOfStrongestNanobot(nanobots: Array<Nanobot>) {
  // sort the nanobots by radius in descending order
  // strongest will then be the first element
  const sorted = nanobots.toSorted(({ radius: a }, { radius: b }) => b - a);
  const strongest = sorted[0];

  // just return the count of bots (including the strongest) that are within
  // the range of the strongest bot
  return count(
    sorted,
    ({ position }) =>
      manhattan(position, strongest.position) <= strongest.radius
  );
}

export default createSolverWithLineArray(async (input) => {
  const nanobots = input.map(parseNanobot);

  return {
    first: findNanobotsInRangeOfStrongestNanobot(nanobots),
    second: findDistanceToOriginWithMaxNanobotReach(nanobots),
  };
});
