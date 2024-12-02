import { createSolver } from "../../solution";

function interdifference(ns: Array<number>): Array<number> {
  const diffs = [];
  for (let i = 1; i < ns.length; i++) {
    diffs.push(Math.abs(ns[i] - ns[i - 1]));
  }

  return diffs;
}

function isStrictlyIncreasing(ns: Array<number>): boolean {
  return ns.every((n, i) => i === 0 || n > ns[i - 1]);
}

function isStrictlyDecreasing(ns: Array<number>): boolean {
  return ns.every((n, i) => i === 0 || n < ns[i - 1]);
}

function isMonotonic(ns: Array<number>): boolean {
  return isStrictlyIncreasing(ns) || isStrictlyDecreasing(ns);
}

const isWithinRange = (min: number, max: number) => (n: number) => {
  return n >= min && n <= max;
};

const isWithin1And3 = isWithinRange(1, 3);
function isSafe(ns: Array<number>): boolean {
  return isMonotonic(ns) && interdifference(ns).every(isWithin1And3);
}

export default createSolver(async (input) => {
  let safeReports = 0;
  let safeReportsWithDampening = 0;

  for await (const line of input) {
    const report = line.split(" ").map((n) => Number.parseInt(n, 10));

    if (isSafe(report)) {
      safeReports++;
      safeReportsWithDampening += 1;
      continue;
    }

    for (let i = 0; i < report.length; i++) {
      const subReport = [...report.slice(0, i), ...report.slice(i + 1)];
      if (isSafe(subReport)) {
        safeReportsWithDampening++;
        break;
      }
    }
  }

  return {
    first: safeReports,
    second: safeReportsWithDampening,
  };
});
