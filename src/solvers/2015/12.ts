import { createSolverWithString } from "../../solution";

function count(obj: any, withRed: boolean): number {
  if (typeof obj === "string") {
    return 0;
  }

  if (typeof obj === "number") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.reduce((acc, val) => acc + count(val, withRed), 0);
  }

  if (typeof obj === "object") {
    let sum = 0;

    for (const value of Object.values(obj)) {
      if (!withRed) {
        if (value === "red") {
          return 0;
        }
      }

      sum += count(value, withRed);
    }

    return sum;
  }

  throw new Error("should never happen");
}

export default createSolverWithString(async (input) => {
  const payload = JSON.parse(input);

  return {
    first: count(payload, true),
    second: count(payload, false),
  };
});
