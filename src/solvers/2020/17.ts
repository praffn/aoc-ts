import { StructuralSet } from "../../lib/collections/structural-set";
import { range } from "../../lib/iter";
import {
  add,
  generateAllDirectionalOffsets,
  key,
  makeVec4,
  type Vec4,
} from "../../lib/linalg/vec4";
import { generateAllDirectionalOffsets as generateAllDirectionalOffsets3D } from "../../lib/linalg/vec3";
import { createSolverWithLineArray } from "../../solution";

type CubeMap = {
  cubes: StructuralSet<Vec4>;
  min: Vec4;
  max: Vec4;
};

// Offsets used for calculating neighbors. We have all for 4D and add an extra
// dimension for 3D (w = 0).
const DIRECTIONAL_OFFSETS_4D = generateAllDirectionalOffsets();
const DIRECTIONAL_OFFSETS_3D = generateAllDirectionalOffsets3D().map((v) => {
  return makeVec4(v.x, v.y, v.z, 0);
});

function parse(input: Array<string>): CubeMap {
  const cubes = new StructuralSet(key);
  const width = input[0].length;
  const height = input.length;

  for (const x of range(width)) {
    for (const y of range(height)) {
      if (input[y][x] === "#") {
        cubes.add(makeVec4(x, y, 0, 0));
      }
    }
  }

  return {
    cubes,
    min: makeVec4(0, 0, 0, 0),
    max: makeVec4(width, height, 1, 1),
  };
}

/**
 * Returns the amount of neighbors of a given position.
 */
function getNeighborCount(
  cubes: StructuralSet<Vec4>,
  position: Vec4,
  dimensions = 3
): number {
  let count = 0;
  const offsets =
    dimensions === 3 ? DIRECTIONAL_OFFSETS_3D : DIRECTIONAL_OFFSETS_4D;

  for (const offset of offsets) {
    const offsetPosition = add(position, offset);
    if (cubes.has(offsetPosition)) {
      count++;
    }
  }

  return count;
}

/**
 * Runs a single step of the simulation, returning a new cube map.
 */
function step({ cubes, min, max }: CubeMap, dimensions = 3): CubeMap {
  const newCubes = new StructuralSet(key);

  // Lets go through every dimension and check if the cube at the position
  // should be active or not.
  for (let x = min.x - 1; x <= max.x; x++) {
    for (let y = min.y - 1; y <= max.y; y++) {
      for (let z = min.z - 1; z <= max.z; z++) {
        for (let w = min.w - 1; w <= max.w; w++) {
          const position = makeVec4(x, y, z, w);
          const neighborCount = getNeighborCount(cubes, position, dimensions);

          if (cubes.has(position)) {
            if (neighborCount === 2 || neighborCount === 3) {
              newCubes.add(position);
            }
          } else {
            if (neighborCount === 3) {
              newCubes.add(position);
            }
          }
        }
      }
    }
  }

  return {
    cubes: newCubes,
    // We need to expand the bounds of the cube map, as a new cube might have
    // been activated at the edges.
    min: add(min, makeVec4(-1, -1, -1, -1)),
    max: add(max, makeVec4(1, 1, 1, 1)),
  };
}

/**
 * Runs n steps of the simulation and returns the amount of active cubes.
 */
function run(cubeMap: CubeMap, times: number, dimensions = 3): number {
  for (const _ of range(times)) {
    cubeMap = step(cubeMap, dimensions);
  }

  return cubeMap.cubes.size;
}

export default createSolverWithLineArray(async (input) => {
  const cubeMap = parse(input);

  return {
    first: run(cubeMap, 6, 3),
    second: run(cubeMap, 6, 4),
  };
});
