import { createSolverWithString } from "../../solution";

function parseStream(stream: string) {
  let pos = 0;

  let garbage = false;
  let depth = 0;
  let score = 0;
  let garbageScore = 0;

  while (pos < stream.length) {
    const char = stream[pos];

    if (garbage) {
      if (char === ">") {
        garbage = false;
      } else if (char === "!") {
        pos++;
      } else {
        garbageScore++;
      }
      pos++;
      continue;
    }

    switch (char) {
      case "{":
        depth++;
        score += depth;
        break;
      case "<":
        garbage = true;
        break;
      case "}":
        depth--;
        break;
    }
    pos++;
  }

  return { score, garbageScore };
}

export default createSolverWithString(async (input) => {
  const { score, garbageScore } = parseStream(input);

  return {
    first: score,
    second: garbageScore,
  };
});
