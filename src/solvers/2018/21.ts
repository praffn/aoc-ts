import { createSolverWithLineArray } from "../../solution";

export default createSolverWithLineArray(async (input) => {
  // let z = 0x10000;
  const a = Number.parseInt(input[7].split(" ")[2]);
  const b = Number.parseInt(input[8].split(" ")[1]);
  let z = a;
  let x = b;
  const d = Number.parseInt(input[12].split(" ")[2]);

  const seen = new Set<number>();
  let last = -1;
  let first = 0;
  let second = 0;

  while (true) {
    let cond = true;
    while (cond) {
      x += z & 0xff;
      x &= 0xffffff;
      x *= d;
      x &= 0xffffff;
      cond = z >= 0x100;
      if (cond) {
        z >>= 8;
      }
    }

    if (last === -1) {
      first = x;
    }
    if (seen.has(x)) {
      second = last;
      break;
    }

    seen.add(x);
    last = x;
    z = x | a;
    x = b;
  }

  return { first, second };
});
