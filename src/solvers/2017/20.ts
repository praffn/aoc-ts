import { combinations } from "../../lib/iter";
import {
  add,
  equals,
  magnitude,
  makeVec3,
  manhattan,
  type Vec3,
} from "../../lib/linalg/vec3";
import { createSolver } from "../../solution";

type Particle = {
  id: number;
  position: Vec3;
  velocity: Vec3;
  acceleration: Vec3;
};

function tick(p: Particle) {
  p.velocity = add(p.velocity, p.acceleration);
  p.position = add(p.position, p.velocity);
}

const vecRe = /<\s*(-?\d+),\s*(-?\d+),\s*(-?\d+)>/;

function parseVec(s: string): Vec3 {
  const [, x, y, z] = s.match(vecRe)!;
  return makeVec3(Number.parseInt(x), Number.parseInt(y), Number.parseInt(z));
}

export default createSolver(async (input) => {
  const particles: Array<Particle> = [];

  let id = 0;
  for await (const line of input) {
    const [p, v, a] = line.split(", ");
    particles.push({
      id: id++,
      position: parseVec(p),
      velocity: parseVec(v),
      acceleration: parseVec(a),
    });
  }

  particles.sort((a, b) => {
    const accelerationDiff =
      magnitude(a.acceleration) - magnitude(b.acceleration);
    if (accelerationDiff !== 0) {
      return accelerationDiff;
    }

    const velocityDiff = magnitude(a.velocity) - magnitude(b.velocity);
    if (velocityDiff !== 0) {
      return velocityDiff;
    }

    return manhattan(a.position) - manhattan(b.position);
  });

  const particleSet = new Set(particles);
  let ticks = 300;
  while (ticks-- > 0) {
    for (const [a, b] of combinations(particleSet, 2)) {
      if (equals(a.position, b.position)) {
        particleSet.delete(a);
        particleSet.delete(b);
      }
    }

    for (const particle of particleSet) {
      tick(particle);
    }
  }

  return {
    first: particles[0].id,
    second: particleSet.size,
  };
});
