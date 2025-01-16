import { count, isNonDecreasing, range } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

function hasDouble(digits: Array<number>) {
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] === digits[i - 1]) {
      return true;
    }
  }

  return false;
}

function hasStrictDouble(digits: Array<number>) {
  let run = 1;
  for (let i = 1; i < digits.length; i++) {
    if (digits[i] === digits[i - 1]) {
      run++;
    } else {
      if (run === 2) {
        return true;
      }

      run = 1;
    }
  }

  return run === 2;
}

function passes(n: number, strict = false) {
  const digits = n.toString().split("").map(Number);

  // It is a six-digit number.
  if (digits.length !== 6) {
    return false;
  }

  // It must have at least one double.
  if (strict && !hasStrictDouble(digits)) {
    return false;
  } else if (!strict && !hasDouble(digits)) {
    return false;
  }

  // Going from left to right, the digits never decrease.
  if (!isNonDecreasing(digits)) {
    return false;
  }

  return true;
}

function passesStrict(n: number) {
  return passes(n, true);
}

export default createSolverWithString(async (input) => {
  const [start, end] = input.split("-").map((n) => parseInt(n, 10));

  return {
    first: count(range(start, end + 1), passes),
    second: count(range(start, end + 1), passesStrict),
  };
});
