import { parseArgs, type ParseArgsConfig } from "node:util";
import { createLineReader } from "./line-reader";
import { getSolver, prettyPrintSolution } from "./solution";

const parseArgsConfig = {
  options: {
    year: {
      type: "string",
      short: "y",
      default: new Date().getFullYear().toString(),
    },
    day: {
      type: "string",
      short: "d",
    },
    input: {
      type: "string",
      short: "i",
      default: "-",
    },
    help: {
      type: "boolean",
      short: "h",
      default: false,
    },
  },
} satisfies ParseArgsConfig;

function printUsage() {
  const usage = `Usage: aoc [flags]
\t-y, --year <year>    The year to run the solver for. Defaults to the current year.
\t-d, --day <day>      The day to run the solver for. Required.
\t-i, --input <file>   The input file to read from. Use "-" for stdin. Defaults to stdin.
\t-h, --help           Print this help message.`;

  console.error(usage);
}

function parseYearAndDay(
  year: string,
  day: string
): { year: number; day: number } {
  const y = Number.parseInt(year, 10);
  const d = Number.parseInt(day, 10);

  if (Number.isNaN(y) || Number.isNaN(d)) {
    throw new Error(`Invalid year or day: ${year}, ${day}`);
  }

  return { year: y, day: d };
}

async function run() {
  const { values: args } = parseArgs(parseArgsConfig);

  if (args.help) {
    printUsage();
    process.exit(0);
  }

  if (!args.day) {
    console.error("Day is required");
    printUsage();
    process.exit(1);
  }

  const { year, day } = parseYearAndDay(args.year, args.day);

  try {
    const solver = await getSolver(year, day);

    try {
      const lineReader = createLineReader(args.input);
      const solution = await solver(lineReader);
      lineReader.close();
      prettyPrintSolution(solution, year, day, 0);
    } catch (e) {
      console.error(e);
    }
  } catch (e) {
    console.error(
      `A valid solver could not be found for day ${day} of ${year}`
    );
    process.exit(1);
  }
}

run();
