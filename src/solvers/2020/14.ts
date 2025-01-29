import { createSolver } from "../../solution";

function applyMask(value: bigint, mask: string) {
  const or = BigInt(Number.parseInt(mask.replaceAll("X", "0"), 2));
  const and = BigInt(Number.parseInt(mask.replaceAll("X", "1"), 2));

  return (value | or) & and;
}

function* maskAddress(address: bigint, maskStr: string): Generator<bigint> {
  if (maskStr.length === 0) {
    yield 0n;
    return;
  }

  for (const submask of maskAddress(address >> 1n, maskStr.slice(0, -1))) {
    switch (maskStr.at(-1)) {
      case "0":
        yield (submask << 1n) + (address & 1n);
        break;
      case "1":
        yield (submask << 1n) + 1n;
        break;
      case "X":
        yield submask << 1n;
        yield (submask << 1n) + 1n;
        break;
    }
  }
}

const re = /mem\[(\d+)\] = (\d+)/;
export default createSolver(async (input) => {
  const memory1 = new Map<number, bigint>();
  const memory2 = new Map<bigint, bigint>();
  let mask = "";

  for await (const line of input) {
    if (line.startsWith("mask")) {
      mask = line.slice(7);
      continue;
    }

    const [, address, value] = line.match(re)!;

    memory1.set(+address, applyMask(BigInt(value), mask));
    for (const maskedAddress of maskAddress(BigInt(address), mask)) {
      memory2.set(maskedAddress, BigInt(value));
    }
  }

  return {
    first: [...memory1.values()].reduce((a, b) => a + b, 0n),
    second: [...memory2.values()].reduce((a, b) => a + b, 0n),
  };
});
