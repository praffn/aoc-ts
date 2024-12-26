import { createSolverWithLineArray } from "../../solution";

function parseSchematics(input: Array<string>) {
  return input.reduce(
    (acc, line) => {
      if (line === "") {
        acc.push([]);
      } else {
        acc[acc.length - 1].push(line);
      }
      return acc;
    },
    [[]] as Array<Array<string>>
  );
}

function getKeysAndLocks(schematics: Array<Array<string>>) {
  const keys: Array<Array<number>> = [];
  const locks: Array<Array<number>> = [];
  for (const schematic of schematics) {
    const isLock = schematic[0][0] === "#";
    if (!isLock) {
      schematic.reverse();
    }

    const n = [-1, -1, -1, -1, -1];
    for (const line of schematic) {
      for (let i = 0; i < 5; i++) {
        if (line[i] === "#") {
          n[i]++;
        }
      }
    }

    if (isLock) {
      locks.push(n);
    } else {
      keys.push(n);
    }
  }

  return { keys, locks };
}

function findUniqueFits(
  keys: Array<Array<number>>,
  locks: Array<Array<number>>
) {
  let uniqueFits = 0;
  for (const lock of locks) {
    for (const key of keys) {
      let fits = true;
      for (let i = 0; i < 5; i++) {
        if (lock[i] + key[i] > 5) {
          fits = false;
          break;
        }
      }

      if (fits) {
        uniqueFits++;
      }
    }
  }

  return uniqueFits;
}

export default createSolverWithLineArray(async (input) => {
  const { keys, locks } = getKeysAndLocks(parseSchematics(input));

  return {
    first: findUniqueFits(keys, locks),
    second: "Merry Christmas! 🎄",
  };
});
