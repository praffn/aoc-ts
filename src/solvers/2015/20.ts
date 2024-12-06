import { createSolver } from "../../solution";

function* divisors(n: number): Generator<number> {
  const sqrtN = Math.sqrt(n);
  for (let k = 1; k <= sqrtN; k++) {
    if (n % k === 0) {
      yield k;
      const nk = n / k;
      if (k !== nk) {
        yield nk;
      }
    }
  }
}

function calculatePresentsAtHouse(housenumber: number): number {
  let presents = 0;
  const sqrtHousenumber = Math.sqrt(housenumber);

  for (let k = 1; k <= sqrtHousenumber; k++) {
    if (housenumber % k === 0) {
      presents += k;
      const nk = housenumber / k;
      if (k !== nk) {
        presents += nk;
      }
    }
  }

  return presents * 10;
}

function calculatePresentsAtHouse2(housenumber: number): number {
  let presents = 0;
  const sqrtHousenumber = Math.sqrt(housenumber);

  for (let k = 1; k <= sqrtHousenumber; k++) {
    if (housenumber % k === 0) {
      const nkx = housenumber / (k * 50);
      const nk = housenumber / k;

      console.log(k);
      if (nkx <= 1) {
        presents += k * 11;
      }

      if (k !== nk) {
        console.log(nk);
        if (housenumber / (nk * 50) <= 1) {
          presents += nk * 11;
        }
      }
    }
  }

  return presents * 10;
}

export default createSolver(async (input) => {
  for await (const line of input) {
    // console.log(line);
  }

  const target = 33100000;

  let houseNumber = 1;
  let first: number | undefined = undefined;
  let second: number | undefined = undefined;

  function x(n: number) {
    let presents = 0;
    for (const divisor of divisors(n)) {
      if (n / (divisor * 50)) {
        presents += divisor * 11;
      }
    }

    return presents * 11;
  }

  function y(n: number) {
    let presents = 0;
    for (const divisor of divisors(n)) {
      presents += divisor;
    }

    return presents * 10;
  }

  while (first === undefined || second === undefined) {
    if (first === undefined) {
      const presents1 = y(houseNumber);
      if (presents1 >= target) {
        first = houseNumber;
      }
    }

    if (second === undefined) {
      const presents2 = x(houseNumber);
      if (presents2 >= target) {
        second = houseNumber;
      }
    }

    houseNumber++;
  }

  return {
    first: first,
    second: second,
  };
});
