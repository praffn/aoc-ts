import { create } from "node:domain";
import type { LineReader } from "./line-reader";
import chalk from "chalk";

export interface Solution {
  readonly first: number | bigint | string;
  readonly second: number | bigint | string;
}

export type Solver = (input: LineReader) => Promise<Solution>;

export const SolverBrand = Symbol("Solver");

export function createSolver(solver: Solver): Solver {
  (solver as any)[SolverBrand] = true;
  return solver;
}

export async function getSolver(year: number, day: number): Promise<Solver> {
  const d = day.toString().padStart(2, "0");
  const importPath = `./solvers/${year}/${d}`;

  const solver = await import(importPath);
  if (!(solver.default as any)[SolverBrand]) {
    throw new Error(
      `Solver for year ${year}, day ${day} is not a valid solver`
    );
  }

  return solver.default as Solver;
}

export function createSolverWithLineArray(
  solver: (input: Array<string>) => Promise<Solution>
): Solver {
  const wrappedSolver = async (input: LineReader) => {
    const lines = [];
    for await (const line of input) {
      lines.push(line);
    }
    return solver(lines);
  };

  return createSolver(wrappedSolver);
}

export function createSolverWithString(
  solver: (input: string) => Promise<Solution>
): Solver {
  const wrappedSolver = createSolverWithLineArray(async (lines) => {
    return solver(lines.join());
  });

  return createSolver(wrappedSolver);
}

const MIN_BOX_SIZE = 44;
const CORNER_PIECE = chalk.yellowBright("*");
const HORIZONTAL_PIECE = chalk.gray("-");
const VERTICAL_PIECE = chalk.gray("|");

function christmasTree() {
  return chalk.green(`
    ${chalk.yellowBright("*")}
   /.\\
  /${chalk.red("o")}..\\
  /..${chalk.blueBright("o")}\\
 /.${chalk.cyanBright("o")}..${chalk.yellowBright("o")}\\
 /...${chalk.redBright("o")}.\\
/..${chalk.blueBright("o")}....\\
^^^${chalk.rgb(139, 69, 19)("[_]")}^^^  
`);
}

export function prettyPrintSolution(
  solution: Solution,
  year: number,
  day: number,
  runtimeMs: number
) {
  const firstSolution = solution.first.toString();
  const secondSolution = solution.second.toString();

  const maxSolutionLength = Math.max(
    firstSolution.length,
    secondSolution.length
  );

  const BOX_SIZE = Math.max(MIN_BOX_SIZE, maxSolutionLength + 27);

  const dec =
    CORNER_PIECE + HORIZONTAL_PIECE.repeat(BOX_SIZE - 2) + CORNER_PIECE;

  const title = `Solution for day ${day} of ${year}`;
  const fractionalTitlePadding = (BOX_SIZE - title.length) / 2;
  const titlePadding = Math.floor(fractionalTitlePadding) - 1;
  const rightTitlePadding = Math.ceil(fractionalTitlePadding) - 1;

  const titleLine =
    VERTICAL_PIECE +
    " ".repeat(titlePadding) +
    title +
    " ".repeat(rightTitlePadding) +
    VERTICAL_PIECE;

  const emptyDec = VERTICAL_PIECE + " ".repeat(BOX_SIZE - 2) + VERTICAL_PIECE;

  const first = `First:  ${solution.first}`;
  const second = `Second: ${solution.second}`;

  let firstLine =
    VERTICAL_PIECE +
    " ".repeat(titlePadding) +
    `${chalk.gray("First:")}  ${chalk.bold(solution.first)}` +
    " ".repeat(BOX_SIZE - first.length - titlePadding - 2) +
    VERTICAL_PIECE;

  let secondLine =
    VERTICAL_PIECE +
    " ".repeat(titlePadding) +
    `${chalk.gray("Second:")} ${chalk.bold(solution.second)}` +
    " ".repeat(BOX_SIZE - second.length - titlePadding - 2) +
    VERTICAL_PIECE;

  const ms = `Ran in ${runtimeMs}ms`;
  let msLine =
    VERTICAL_PIECE +
    " ".repeat(titlePadding) +
    chalk.gray(ms) +
    " ".repeat(BOX_SIZE - ms.length - titlePadding - 2) +
    VERTICAL_PIECE;

  const tree = christmasTree().split("\n");
  const treePadding = Math.floor((BOX_SIZE - tree[0].length) / 2);
  for (const treeLine of tree) {
    console.log(" ".repeat(treePadding) + treeLine);
  }

  console.log(dec);
  console.log(titleLine);
  console.log(emptyDec);
  console.log(firstLine);
  console.log(secondLine);
  console.log(emptyDec);
  console.log(msLine);
  console.log(dec);
}
