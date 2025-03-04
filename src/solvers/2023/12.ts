import { sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type ConditionRecord = {
  springs: string;
  runs: Array<number>;
};

function keyRecord(record: ConditionRecord) {
  return `${record.springs}:${record.runs.join(",")}`;
}

function parse(line: string): ConditionRecord {
  const [springs, runsRaw] = line.split(" ");
  const runs = runsRaw.split(",").map((n) => +n);
  return { springs, runs };
}

/**
 * Returns the number of different arrangements of operational and broken
 * springs that satisfy the conditions in the record.
 */
function countArrangements(
  record: ConditionRecord,
  cache: Map<string, number> = new Map()
): number {
  const key = keyRecord(record);
  if (cache.has(key)) {
    return cache.get(key)!;
  }

  const { springs, runs } = record;

  // If there are no springs and no more runs then we have found a valid
  // arrangement. Otherwise we have simply run out of springs.
  if (springs.length === 0) {
    return runs.length === 0 ? 1 : 0;
  }

  // Ok basics done, lets check if we can fit a run at the start of the spring.
  let result = 0;
  switch (springs[0]) {
    case ".":
      // Spring is operational -- we can just ignore it and continue with the
      // remaining springs.
      result = countArrangements(
        {
          springs: springs.replace(/^\.+/, ""),
          runs,
        },
        cache
      );
      break;
    case "?":
      // Spring can be either operational or damaged. Let's check how many
      // arrangements we can get in both cases:
      result =
        countArrangements(
          {
            springs: springs.substring(1), // <-- assume operational
            runs,
          },
          cache
        ) +
        countArrangements(
          {
            springs: `#${springs.substring(1)}`, // <-- assume damaged
            runs,
          },
          cache
        );
      break;
    case "#":
      // Damaged (or assumed damaged)
      if (runs.length === 0) {
        // no arrangement
        result = 0;
      } else {
        const thisRun = runs[0];
        const remainingRuns = runs.slice(1);

        if (
          thisRun <= springs.length &&
          !springs.substring(0, thisRun).includes(".")
        ) {
          if (thisRun === springs.length) {
            // if current run is exactly the length of the remaining springs
            // we have exactly found an arrangment if and only if there are no
            // more runs left to check. Otherwise it is an invalid arrangement.
            result = remainingRuns.length === 0 ? 1 : 0;
          } else if (springs[thisRun] === "#") {
            result = 0;
          } else {
            // Ok we can fit this run in the springs. Let's check remaining
            // springs and runs.
            result = countArrangements(
              {
                springs: springs.substring(thisRun + 1),
                runs: remainingRuns,
              },
              cache
            );
          }
        } else {
          // invalid arrangement
          result = 0;
        }
      }
      break;
    default:
      throw new Error("Invalid spring type");
  }

  cache.set(key, result);
  return result;
}

/**
 * Unfolds the record, returning a new record where:
 *
 * - Springs have been repeared 5 times with a '?' between each chunk
 * - Runs have been repeated 5 times
 */
function unfold(record: ConditionRecord): ConditionRecord {
  const springs = new Array(5).fill(record.springs).join("?");
  const runs = new Array(5).fill(record.runs).flat();

  return { springs, runs };
}

function sumArrangements(records: Array<ConditionRecord>) {
  return sum(records.map((record) => countArrangements(record)));
}

export default createSolverWithLineArray(async (input) => {
  const reports = input.map(parse);

  return {
    first: sumArrangements(reports),
    second: sumArrangements(reports.map(unfold)),
  };
});
