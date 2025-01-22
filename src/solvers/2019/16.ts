import { range, sum } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

const BASE_PATTERN = [0, 1, 0, -1];
function phase(signal: Array<number>) {
  for (let i = 0; i < signal.length; i++) {
    let out = 0;
    for (let j = 0; j < signal.length; j++) {
      const multiplier = BASE_PATTERN[Math.floor((j + 1) / (i + 1)) % 4];
      out += signal[j] * multiplier;
    }

    signal[i] = Math.abs(out) % 10;
  }
  return signal;
}

function phase2(signal: Array<number>) {
  let partialSum = sum(signal);
  for (let i = 0; i < signal.length; i++) {
    const tmp = partialSum;
    partialSum -= signal[i];
    signal[i] = Math.abs(tmp) % 10;
  }
}

function solveFirst(signal: Array<number>) {
  const signalCopy = signal.slice();
  for (const _ of range(100)) {
    phase(signalCopy);
  }
  return signalCopy.slice(0, 8).join("");
}

function solveSecond(signal: Array<number>) {
  // find the offset from the original signal
  const offset = Number.parseInt(signal.slice(0, 7).join(""), 10);
  // now repeat signal 10000 times
  const repeatedInputSignal = Array.from(
    { length: 10000 },
    () => signal
  ).flat();
  // cut the signal from the offset
  const cutSignal = repeatedInputSignal.slice(offset);

  for (const _ of range(100)) {
    phase2(cutSignal);
  }

  return cutSignal.slice(0, 8).join("");
}

export default createSolverWithString(async (input) => {
  const signal = input.split("").map((n) => Number.parseInt(n, 10));

  return {
    first: solveFirst(signal),
    second: solveSecond(signal),
  };
});
