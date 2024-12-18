import { createSolverWithLineArray } from "../../solution";

function swapPosition(password: Array<string>, x: number, y: number) {
  const temp = password[x];
  password[x] = password[y];
  password[y] = temp;
  return password;
}

function swapLetter(password: Array<string>, x: string, y: string) {
  const xIndex = password.indexOf(x);
  const yIndex = password.indexOf(y);
  return swapPosition(password, xIndex, yIndex);
}

function rotateLeft(passsword: Array<string>, steps: number) {
  const copy = passsword.slice();
  const x = copy.splice(0, steps);
  copy.push(...x);
  return copy;
}

function rotateRight(password: Array<string>, steps: number) {
  const copy = password.slice();
  const x = copy.splice(copy.length - steps);
  copy.unshift(...x);
  return copy;
}

function rotateBasedOnPosition(password: Array<string>, x: string) {
  const index = password.indexOf(x);
  const steps = index + 1 + (index >= 4 ? 1 : 0);
  return rotateRight(password, steps);
}

function arrayShallowEquals(a: Array<unknown>, b: Array<unknown>) {
  if (a.length !== b.length) {
    return false;
  }

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      return false;
    }
  }

  return true;
}

function unrotateBasedOnPosition(password: Array<string>, x: string) {
  for (let i = 0; i < password.length; i++) {
    const rotated = rotateLeft(password, i);
    const unrotated = rotateBasedOnPosition(rotated, x);
    if (arrayShallowEquals(unrotated, password)) {
      return rotated;
    }
  }
  throw new Error("...");
}

function reverseSpan(password: Array<string>, x: number, y: number) {
  const span = password.slice(x, y + 1).reverse();
  password.splice(x, span.length, ...span);
  return password;
}

function move(password: Array<string>, x: number, y: number) {
  const letter = password.splice(x, 1)[0];
  password.splice(y, 0, letter);
  return password;
}

function N(n: string) {
  return Number.parseInt(n, 10);
}

function scramble(
  initialPassword: string,
  instructions: Array<string>,
  unscramble = false
) {
  const _instructions = unscramble ? instructions.toReversed() : instructions;
  let password = initialPassword.split("");

  for (const line of _instructions) {
    const parts = line.split(" ");
    switch (parts[0]) {
      case "swap":
        if (parts[1] === "position") {
          password = swapPosition(password, N(parts[2]), N(parts[5]));
        } else {
          password = swapLetter(password, parts[2], parts[5]);
        }
        break;
      case "rotate":
        if (parts[1] === "left") {
          password = unscramble
            ? rotateRight(password, N(parts[2]))
            : rotateLeft(password, N(parts[2]));
        } else if (parts[1] === "right") {
          password = unscramble
            ? rotateLeft(password, N(parts[2]))
            : rotateRight(password, N(parts[2]));
        } else {
          password = unscramble
            ? unrotateBasedOnPosition(password, parts[6])
            : rotateBasedOnPosition(password, parts[6]);
        }
        break;
      case "reverse":
        password = reverseSpan(password, N(parts[2]), N(parts[4]));
        break;
      case "move": {
        const a = unscramble ? N(parts[5]) : N(parts[2]);
        const b = unscramble ? N(parts[2]) : N(parts[5]);
        password = move(password, a, b);
        break;
      }
      default:
        throw new Error(`Unknown instruction: ${line}`);
    }
  }

  return password.join("");
}

function unscramble(initialPassword: string, instructions: Array<string>) {
  return scramble(initialPassword, instructions, true);
}

export default createSolverWithLineArray(async (input) => {
  return {
    first: scramble("abcdefgh", input),
    second: unscramble("fbgdceah", input),
  };
});
