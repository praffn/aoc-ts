import { enumerate, range, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

const INDICES = [-2, -1, 0, 1, 2];
function nextGeneration(state: Set<number>, recipe: Set<string>) {
  const start = Math.min(...state);
  const end = Math.max(...state);

  const newState = new Set<number>();

  for (let i = start - 3; i < end + 4; i++) {
    const pattern = INDICES.map((j) => (state.has(i + j) ? "#" : ".")).join("");
    if (recipe.has(pattern)) {
      newState.add(i);
    }
  }

  return newState;
}

function solveFirst(state: Set<number>, recipes: Set<string>) {
  for (const _ of range(20)) {
    state = nextGeneration(state, recipes);
  }

  return sum(state);
}

// Thanks to sophiebits for the hint.
// After enough iterations the sum of the pots will increase by a constant amount
// We iterate 2000 times and assume that we have reached the constant increase
// We then sum the pots and add the remaining iterations times the constant increase
//  https://www.reddit.com/r/adventofcode/comments/a5eztl/comment/ebm4c9d/
function solveSecond(state: Set<number>, recipes: Set<string>) {
  const hIterations = 2000;
  let ls = 0;
  let s = 0;
  for (const _ of range(hIterations)) {
    ls = s;
    state = nextGeneration(state, recipes);
    s = sum(state);
  }

  return sum(state) + (50_000_000_000 - hIterations) * (s - ls);
}

export default createSolverWithLineArray(async (input) => {
  const initialState = new Set(
    enumerate(input[0].split(" ")[2])
      .filter(([_, c]) => c === "#")
      .map(([i, _]) => i)
  );
  const recipes = new Set<string>();

  for (const line of input.slice(2)) {
    const [recipe, result] = line.split(" => ");
    if (result === "#") {
      recipes.add(recipe);
    }
  }

  return {
    first: solveFirst(initialState, recipes),
    second: solveSecond(initialState, recipes),
  };
});
