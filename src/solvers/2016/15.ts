import { numericProduct } from "../../lib/iter";
import { createSolver } from "../../solution";

type Disc = {
  positions: number;
  initialPosition: number;
};

const re = /Disc #\d+ has (\d+) positions; at time=0, it is at position (\d+)/;

function mmi(a: number, mod: number) {
  const b = a % mod;
  for (let h = 1; h <= mod; h++) {
    if ((b * h) % mod === 1) {
      return h;
    }
  }

  return 1;
}

function solveCRT(remainders: Array<number>, moduli: Array<number>) {
  const prod = numericProduct(moduli);

  let sum = 0;
  for (let i = 0; i < moduli.length; i++) {
    const p = prod / moduli[i];
    sum += remainders[i] * mmi(p, moduli[i]) * p;
  }

  return sum % prod;
}

function solve(discs: Array<Disc>): number {
  const remainders: Array<number> = [];
  const moduli: Array<number> = [];

  discs.forEach(({ positions, initialPosition }, i) => {
    moduli.push(positions);
    remainders.push(
      moduli.at(-1)! - ((initialPosition + i + 1) % moduli.at(-1)!)
    );
  });

  return solveCRT(remainders, moduli);
}

export default createSolver(async (input) => {
  const discs: Array<Disc> = [];

  for await (const line of input) {
    const parts = line.split(" ");
    const positions = Number.parseInt(parts[3]);
    const initialPosition = Number.parseInt(parts[11]);
    discs.push({ positions, initialPosition });
  }

  return {
    first: solve(discs),
    second: solve([...discs, { positions: 11, initialPosition: 0 }]),
  };
});
