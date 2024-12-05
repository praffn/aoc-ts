import { combinations } from "../../lib/iter";
import { createSolver } from "../../solution";

function countCombinations(containers: Array<number>, target: number) {
  const dp = new Array(target + 1).fill(0);
  dp[0] = 1;

  for (const container of containers) {
    for (let currentSum = target; currentSum >= container; currentSum--) {
      dp[currentSum] += dp[currentSum - container];
    }
  }

  return dp[target];
}

function countMinimalCombinations(containers: Array<number>, target: number) {
  let answer = 0;

  for (let i = 1; i < containers.length + 1; i++) {
    for (const container of combinations(containers, i)) {
      const sum = container.reduce((acc, val) => acc + val, 0);
      if (sum === target) {
        answer++;
      }
    }

    if (answer > 0) {
      break;
    }
  }

  return answer;
}

const TARGET = 150;

export default createSolver(async (input) => {
  const containers: Array<number> = [];

  for await (const line of input) {
    containers.push(Number.parseInt(line, 10));
  }

  return {
    first: countCombinations(containers, TARGET),
    second: countMinimalCombinations(containers, TARGET),
  };
});
