import { createSolverWithString } from "../../solution";

function dance(programs: string, instructions: Array<string>) {
  for (const move of instructions) {
    programs = step(programs, move);
  }

  return programs;
}

function step(programs: string, move: string) {
  const arr = programs.split("");
  switch (move[0]) {
    case "s": {
      const n = Number.parseInt(move.slice(1));
      arr.unshift(...arr.splice(-n));
      break;
    }
    case "x": {
      const [a, b] = move
        .slice(1)
        .split("/")
        .map((n) => Number.parseInt(n));

      const tmp = arr[a];
      arr[a] = arr[b];
      arr[b] = tmp;
      break;
    }
    case "p": {
      const [a, b] = move.slice(1).split("/");
      const aIndex = arr.indexOf(a);
      const bIndex = arr.indexOf(b);
      const tmp = arr[aIndex];
      arr[aIndex] = arr[bIndex];
      arr[bIndex] = tmp;
      break;
    }
  }

  const result = arr.join("");
  return result;
}

export default createSolverWithString(async (input) => {
  const programs = "abcdefghijklmnop";

  const instructions = input.split(",");

  const first = dance(programs, instructions);

  const iterations = 1_000_000_000;
  let second = programs;
  for (let i = 0; i < iterations; i++) {
    second = dance(second, instructions);
    if (second === programs) {
      // if we reach initial state, we can skip
      i += (Math.floor(iterations / (i + 1)) - 1) * (i + 1);
    }
  }

  return {
    first,
    second,
  };
});
