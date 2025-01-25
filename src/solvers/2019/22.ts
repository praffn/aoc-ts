import { modexp } from "../../lib/math";
import { createSolverWithLineArray } from "../../solution";

type Step =
  | {
      type: "reverse";
    }
  | {
      type: "cut";
      n: number;
    }
  | {
      type: "increment";
      n: number;
    };

// Implementations of operations that actually shuffle the deck
function reverse(deck: Array<number>) {
  return deck.toReversed();
}

function cut(deck: Array<number>, n: number) {
  return deck.slice(n).concat(deck.slice(0, n));
}

function increment(deck: Array<number>, n: number): Array<number> {
  let newDeck = Array.from<number>({ length: deck.length });

  for (let i = 0; i < deck.length; i++) {
    newDeck[(i * n) % deck.length] = deck[i];
  }

  return newDeck;
}

function modinv(n: bigint, m: bigint): bigint {
  return modexp(n, m - 2n, m);
}

function parseSteps(input: Iterable<string>): Array<Step> {
  const steps: Array<Step> = [];

  for (const line of input) {
    if (line.includes("deal into new stack")) {
      steps.push({ type: "reverse" });
    } else if (line.includes("deal with increment")) {
      steps.push({ type: "increment", n: parseInt(line.slice(20)) });
    } else if (line.includes("cut")) {
      steps.push({ type: "cut", n: parseInt(line.slice(4)) });
    }
  }

  return steps;
}

function solveFirst(steps: Array<Step>) {
  let deck = Array.from({ length: 10007 }).map((_, i) => i);

  for (const step of steps) {
    switch (step.type) {
      case "reverse":
        deck = reverse(deck);
        break;
      case "cut":
        deck = cut(deck, step.n);
        break;
      case "increment":
        deck = increment(deck, step.n);
        break;
    }
  }

  return deck.indexOf(2019);
}

function solveSecond(steps: Array<Step>) {
  // HUGE THANKS TO mcpower_ on reddit
  // https://www.reddit.com/r/adventofcode/comments/ee0rqi/comment/fbnkaju
  // I _kinda_ understand the math behind it now, but maaaaaan...
  // THIS IS COOL!
  const deckSize = 119315717514047n;
  const iterations = 101741582076661n;

  let incrementMultiplier = 1n;
  let offsetDiff = 0n;

  for (const step of steps) {
    switch (step.type) {
      case "reverse":
        incrementMultiplier *= -1n;
        incrementMultiplier %= deckSize;
        offsetDiff += incrementMultiplier;
        offsetDiff %= deckSize;
        break;
      case "cut":
        offsetDiff += BigInt(step.n) * incrementMultiplier;
        offsetDiff %= deckSize;
        break;
      case "increment":
        incrementMultiplier *= modinv(BigInt(step.n), deckSize);
        incrementMultiplier %= deckSize;
        break;
    }
  }

  const increment = modexp(incrementMultiplier, iterations, deckSize);
  const offset =
    (offsetDiff *
      (1n - increment) *
      modinv((1n - incrementMultiplier) % deckSize, deckSize)) %
    deckSize;

  return (offset + 2020n * increment) % deckSize;
}

export default createSolverWithLineArray(async (input) => {
  const steps = parseSteps(input);

  return {
    first: solveFirst(steps),
    second: solveSecond(steps),
  };
});
