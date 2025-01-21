import { combinations, range } from "../../lib/iter";
import { lcm } from "../../lib/math";
import { createSolverWithLineArray } from "../../solution";

const re = /<x=(-?\d+), y=(-?\d+), z=(-?\d+)>/;
/**
 * Returns three arrays (one for each 3d axis)
 * Every even element in the array is a position in that axis of a single moon
 * Every odd element in the array is a velocity in that axis of a single moon
 * I.e. index+0 is position, index+1 is velocity
 */
function parse(
  input: Array<string>
): [Array<number>, Array<number>, Array<number>] {
  const xs: Array<number> = [];
  const ys: Array<number> = [];
  const zs: Array<number> = [];

  for (const line of input) {
    const [, x, y, z] = line.match(re)!;
    xs.push(+x, 0);
    ys.push(+y, 0);
    zs.push(+z, 0);
  }

  return [xs, ys, zs];
}

/**
 * Calculates the new velocities for each moon in the system with respect to
 * every other moon in the system. Updates positions accordingly
 */
function step(ns: Array<number>) {
  for (const [aIndex, bIndex] of combinations(range(ns.length / 2), 2)) {
    const aPos = ns[aIndex * 2];
    const bPos = ns[bIndex * 2];

    const d = Math.sign(aPos - bPos);

    ns[aIndex * 2 + 1] -= d;
    ns[bIndex * 2 + 1] += d;
  }

  for (let i = 0; i < ns.length; i += 2) {
    ns[i] += ns[i + 1];
  }
}

/**
 * Just runs the step function on all three axes
 */
function stepAll(xs: Array<number>, ys: Array<number>, zs: Array<number>) {
  step(xs);
  step(ys);
  step(zs);
}

/**
 * Runs n steps of the simulation and then returns the total energy of the system
 */
function findTotalEnergyAfterNSteps(
  xs: Array<number>,
  ys: Array<number>,
  zs: Array<number>,
  steps: number
) {
  xs = xs.slice();
  ys = ys.slice();
  zs = zs.slice();

  for (let i = 0; i < steps; i++) {
    stepAll(xs, ys, zs);
  }

  return computeTotalEnergy(xs, ys, zs);
}

/**
 * Returns the systems total potential energy multiplied by its total kinetic energy
 * Potential energy is the sum of the absolute values of the moons positions
 * Kinetic energy is the sum of the absolute values of the moons velocities
 */
function computeTotalEnergy(
  xs: Array<number>,
  ys: Array<number>,
  zs: Array<number>
) {
  let total = 0;
  for (let i = 0; i < xs.length; i += 2) {
    total +=
      (Math.abs(xs[i]) + Math.abs(ys[i]) + Math.abs(zs[i])) *
      (Math.abs(xs[i + 1]) + Math.abs(ys[i + 1]) + Math.abs(zs[i + 1]));
  }

  return total;
}

/**
 * Continoously steps the system until it reaches a state it has seen before,
 * then returns the number of steps it took to reach that state
 */
function findFirstCycle(ns: Array<number>) {
  const seen = new Set<string>([ns.join(",")]);
  let steps = 0;
  while (true) {
    step(ns);
    steps += 1;
    const key = ns.join(",");
    if (seen.has(key)) {
      return steps;
    }
    seen.add(key);
  }
}

/**
 * Finds the amount of steps each axis needs to reach a cycle, then returns the
 * least common multiple of those three numbers
 */
function findFirstTotalCycle(
  xs: Array<number>,
  ys: Array<number>,
  zs: Array<number>
) {
  const a = findFirstCycle(xs);
  const b = findFirstCycle(ys);
  const c = findFirstCycle(zs);

  return lcm(a, lcm(b, c));
}

export default createSolverWithLineArray(async (input) => {
  const [xs, ys, zs] = parse(input);

  return {
    first: findTotalEnergyAfterNSteps(xs, ys, zs, 1000),
    second: findFirstTotalCycle(xs, ys, zs),
  };
});
