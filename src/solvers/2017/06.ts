import { createSolverWithString } from "../../solution";

function redstribute(banks: Array<number>): [number, number] {
  const seen = new Map<string, number>();

  let cycles = 0;
  while (true) {
    if (seen.has(banks.join(","))) {
      return [cycles, cycles - seen.get(banks.join(","))!];
    }
    seen.set(banks.join(","), cycles);

    const max = Math.max(...banks);
    const index = banks.indexOf(max);
    let n = banks[index];
    banks[index] = 0;

    for (let i = index + 1; n > 0; i++) {
      banks[i % banks.length]++;
      n--;
    }

    cycles++;
  }
}

export default createSolverWithString(async (input) => {
  const banks = input.split("\t").map((n) => Number.parseInt(n));

  const [cycles, loopSize] = redstribute(banks);

  return {
    first: cycles,
    second: loopSize,
  };
});
