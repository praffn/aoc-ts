import { createSolver } from "../../solution";

interface Sue {
  [key: string]: number;
}

function parseSue(line: string): Sue {
  const [_, info] = line.split(/(?<=\d):\s/);

  const sue: Sue = {};

  for (const pair of info.split(", ")) {
    const [key, value] = pair.split(": ");

    sue[key] = Number.parseInt(value, 10);
  }

  return sue;
}

const KNOWN_SUE: Sue = {
  children: 3,
  cats: 7,
  samoyeds: 2,
  pomeranians: 3,
  akitas: 0,
  vizslas: 0,
  goldfish: 5,
  trees: 3,
  cars: 2,
  perfumes: 1,
};

function matchesKnownSue(candidate: Sue): boolean {
  for (const key in candidate) {
    if (KNOWN_SUE[key] !== candidate[key]) {
      return false;
    }
  }

  return true;
}

function matchesKnownSueInexact(candidate: Sue): boolean {
  for (const key in candidate) {
    if (key === "cats" || key === "trees") {
      if (candidate[key] <= KNOWN_SUE[key]) {
        return false;
      }
      continue;
    } else if (key === "pomeranians" || key === "goldfish") {
      if (candidate[key] >= KNOWN_SUE[key]) {
        return false;
      }
      continue;
    }

    if (KNOWN_SUE[key] !== candidate[key]) {
      return false;
    }
  }

  return true;
}

export default createSolver(async (input) => {
  const sues: Array<Sue> = [];

  for await (const line of input) {
    sues.push(parseSue(line));
  }

  const first = sues.findIndex(matchesKnownSue) + 1;
  const second = sues.findIndex(matchesKnownSueInexact) + 1;

  return {
    first,
    second,
  };
});
