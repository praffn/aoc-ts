import { Queue } from "../../lib/collections/queue";
import { StructuralSet } from "../../lib/collections/structural-set";
import { add, key, leq, makeVec3, type Vec3 } from "../../lib/linalg/vec3";
import { createSolverWithLineArray } from "../../solution";

type Droplet = {
  // unit cubes comprising the droplet
  cubes: StructuralSet<Vec3>;
  // bounding box (expanded by 1 in all directions)
  min: Vec3;
  max: Vec3;
};

/**
 * Returns the droplet from the input
 */
function parse(input: Array<string>) {
  const cubes = new StructuralSet(key);

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const line of input) {
    const [x, y, z] = line.split(",").map(Number);
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
    cubes.add(makeVec3(x, y, z));
  }

  return {
    cubes,
    min: makeVec3(minX - 1, minY - 1, minZ - 1),
    max: makeVec3(maxX + 1, maxY + 1, maxZ + 1),
  };
}

const directions = [
  makeVec3(-1, 0, 0),
  makeVec3(1, 0, 0),
  makeVec3(0, -1, 0),
  makeVec3(0, 1, 0),
  makeVec3(0, 0, -1),
  makeVec3(0, 0, 1),
];

/**
 * Returns the total surface area of the droplet, including internal surfaces
 */
function findTotalSurfaceArea(droplet: Droplet) {
  // each cube has a surface area of 6
  let surfaceArea = droplet.cubes.size * 6;

  // Now lets go through each cube and subtract each face that is adjacent to
  // another cube
  for (const cube of droplet.cubes) {
    for (const direction of directions) {
      const neighbor = add(cube, direction);
      if (droplet.cubes.has(neighbor)) {
        surfaceArea -= 1;
      }
    }
  }

  return surfaceArea;
}

/**
 * Returns the surface area of only the faces of the droplet that are exposed to
 * the outside, i.e. only the "external" faces.
 */
function findExternalSurfaceArea(droplet: Droplet) {
  // flood fill the air around the droplet
  const visited = new StructuralSet(key);
  const queue = new Queue<Vec3>();
  // external keeps track of any "external air cube" that is adjacent
  const external = new StructuralSet(key);

  // we're gonna start right outside the droplet, at the minimum point in the
  // bounding box
  queue.enqueue(droplet.min);
  visited.add(droplet.min);

  while (!queue.isEmpty()) {
    const current = queue.dequeue();
    // add the current cube to the external set
    external.add(current);

    // go in each direction
    for (const direction of directions) {
      const neighbor = add(current, direction);
      // if we're inside the bounding box, and we haven't visited this cube yet,
      // AND we're looking at air (i.e. not a cube in the droplet), we add it to
      // the queue
      if (
        leq(droplet.min, neighbor) &&
        leq(neighbor, droplet.max) &&
        !visited.has(neighbor) &&
        !droplet.cubes.has(neighbor)
      ) {
        queue.enqueue(neighbor);
        visited.add(neighbor);
      }
    }
  }

  // Alright, we now have all the "external" air cubes. Now we just need to
  // count the total droplet faces that are adjacent to an external air cube
  let externalSurface = 0;

  for (const cube of droplet.cubes) {
    for (const direction of directions) {
      const neighbor = add(cube, direction);
      if (external.has(neighbor)) {
        externalSurface += 1;
      }
    }
  }

  return externalSurface;
}

export default createSolverWithLineArray(async (input) => {
  const droplet = parse(input);

  return {
    first: findTotalSurfaceArea(droplet),
    second: findExternalSurfaceArea(droplet),
  };
});
