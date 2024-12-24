import { max } from "../../lib/iter";
import { createSolver } from "../../solution";

function* generateSecretNumber(seed: bigint): Iterable<bigint> {
  let secretNumber = seed;

  while (true) {
    const a = secretNumber * 64n;
    secretNumber ^= a;
    secretNumber %= 16777216n;
    const b = secretNumber / 32n;
    secretNumber ^= b;
    secretNumber %= 16777216n;
    const c = secretNumber * 2048n;
    secretNumber ^= c;
    secretNumber %= 16777216n;

    yield secretNumber;
  }
}

export default createSolver(async (input) => {
  let first = 0n;
  const sequences = new Map<string, number>();

  for await (const line of input) {
    let n = 0;
    const seenSequences = new Set<string>();
    const sequence = [0, 0, 0, 0];
    let lastPrice = 0;
    for (const secretNumber of generateSecretNumber(BigInt(line))) {
      const price = Number(secretNumber % 10n);
      if (n > 0) {
        sequence[3] = sequence[2];
        sequence[2] = sequence[1];
        sequence[1] = sequence[0];
        sequence[0] = price - lastPrice;
        if (n > 3) {
          const key = sequence.join(",");
          if (!seenSequences.has(key)) {
            seenSequences.add(key);
            sequences.set(key, (sequences.get(key) || 0) + price);
          }
        }
      }

      if (++n === 2000) {
        first += secretNumber;
        break;
      }

      lastPrice = price;
    }
  }

  const second = max(sequences.values())!;

  return {
    first,
    second,
  };
});
