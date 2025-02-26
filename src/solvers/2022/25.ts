import { sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

const snafuDigits: Record<string, number> = {
  "=": -2,
  "-": -1,
  "0": 0,
  "1": 1,
  "2": 2,
};

function numberToSnafu(n: number): string {
  if (n === 0) {
    return "0";
  }

  const snafuDigits = [];
  while (n) {
    const remainder = n % 5;
    switch (remainder) {
      case 3:
        snafuDigits.push("=");
        n = Math.floor(n / 5) + 1;
        break;
      case 4:
        snafuDigits.push("-");
        n = Math.floor(n / 5) + 1;
        break;
      default:
        snafuDigits.push(remainder.toString());
        n = Math.floor(n / 5);
        break;
    }
  }

  return snafuDigits.reverse().join("");
}

function snafuToNumber(snafu: string): number {
  const digits = snafu.split("").reverse();
  let result = 0;
  for (const [i, digit] of digits.entries()) {
    result += snafuDigits[digit] * 5 ** i;
  }
  return result;
}

export default createSolverWithLineArray(async (input) => {
  const fuelRequirement = sum(input.map((snafu) => snafuToNumber(snafu)));

  return {
    first: numberToSnafu(fuelRequirement),
    second: "🐘 Merry Christmas! 🐒",
  };
});
