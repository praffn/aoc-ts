import { Array2D } from "../../lib/collections/array2d";
import { combine } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

type Board = Array2D<[number, boolean]>;
type Numbers = Array<number>;

function parse(input: string): [Numbers, Set<Board>] {
  const [rawNumbers, ...rawBoards] = input.split("\n\n");

  const numbers = rawNumbers.split(",").map((n) => Number.parseInt(n, 10));
  const boards = new Set<Board>();
  for (const rawBoard of rawBoards) {
    const data = rawBoard.split("\n").map((line) =>
      line
        .trim()
        .split(/\s+/)
        .map((n) => [Number.parseInt(n, 10), false] as [number, boolean])
    );

    boards.add(new Array2D(data));
  }

  return [numbers, boards];
}

/**
 * Marks the given number on the board, if it exists.
 */
function mark(board: Board, number: number) {
  const coords = board.findCoordinates((c) => c[0] === number);
  if (coords) {
    board.set(...coords, [number, true]);
  }
}

/**
 * Returns true if the board has a bingo, i.e. an entire row or column is marked.
 */
function hasBingo(board: Board) {
  for (const rowOrColumn of combine(board.rows(), board.columns())) {
    if (rowOrColumn.every((c) => c[1])) {
      return true;
    }
  }

  return false;
}

/**
 * Returns the score of the board, i.e. the sum all unmarked numbers multiplied
 * by the most recently drawn number.
 */
function score(board: Board, n: number) {
  return n * board.sum((c) => (c[1] ? 0 : c[0]));
}

/**
 * Returns the solutions to both parts
 * The first solution is the score of the first board to get bingo
 * The second solution is the score of the last board to get bingo
 */
function solve(numbers: Numbers, boards: Set<Board>): [number, number] {
  let firstWinningScore = -1;

  // Lets go through all numbers
  for (const n of numbers) {
    // And then through each board
    for (const board of boards) {
      // Mark that drawn number
      mark(board, n);

      if (hasBingo(board)) {
        // If the board has a bingo we can remove it
        boards.delete(board);

        // And lets set the first score (if it was the first)
        if (firstWinningScore === -1) {
          firstWinningScore = score(board, n);
        }

        // If we have no more boards left, this must have been the last board.
        // Lets return the score of the first board and this board.
        if (boards.size === 0) {
          return [firstWinningScore, score(board, n)];
        }
      }
    }
  }

  throw new Error("No solution found");
}

export default createSolverWithString(async (input) => {
  const [numbers, boards] = parse(input);
  const [first, second] = solve(numbers, boards);

  return {
    first,
    second,
  };
});
