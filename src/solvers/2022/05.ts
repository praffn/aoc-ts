import { range } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

type Rule = {
  count: number;
  fromIndex: number;
  toIndex: number;
};

/**
 * Parses the input, returning the stack and the rules
 */
function parse(input: string): [Array<Array<string>>, Array<Rule>] {
  const [arrangement, rulesRaw] = input.split("\n\n").map((l) => l.split("\n"));

  // flippedStacks is the arrangement of stacks (including empty), but rotatee
  // 90 degrees. Example (left is correct, right is flipped)
  //    _  _ D          A _ _
  //    _  B E     =>   C B _
  //    A  C F          F E D
  // This is because it is just easier to parse it line by line first
  const flippedStacks: Array<Array<string>> = [];
  for (const line of arrangement.slice(0, -1)) {
    const flippedStack: Array<string> = [];
    for (let i = 1; i < line.length; i += 4) {
      const c = line[i];
      flippedStack.push(c);
    }
    flippedStacks.push(flippedStack);
  }

  // Now lets flip those stacks back
  const stacks: Array<Array<string>> = Array.from(
    { length: flippedStacks[0].length },
    () => []
  );
  for (const flippedStack of flippedStacks.reverse()) {
    for (const [i, crate] of flippedStack.entries()) {
      if (crate !== " ") {
        stacks[i].push(crate);
      }
    }
  }

  // And parse the rules
  const rules = rulesRaw.map((line) => {
    const [, count, , from, , to] = line.split(" ");
    return {
      count: +count,
      fromIndex: +from - 1,
      toIndex: +to - 1,
    };
  });

  return [stacks, rules];
}

function top(stacks: Array<Array<string>>): string {
  return stacks.map((stack) => stack.at(-1)).join("");
}

export default createSolverWithString(async (input) => {
  const [stacks1, rules] = parse(input);
  // deep copy -- we're gonna solve part1 on `stacks1` and part 2 on `stacks2`
  const stacks2 = stacks1.map((stack) => [...stack]);

  for (const rule of rules) {
    // for part 1 we pop n times off the from stack and push to the to stack
    for (const _ of range(rule.count)) {
      stacks1[rule.toIndex].push(stacks1[rule.fromIndex].pop()!);
    }
    // for part 2 we take all n at once
    stacks2[rule.toIndex].push(...stacks2[rule.fromIndex].splice(-rule.count));
  }

  return {
    first: top(stacks1),
    second: top(stacks2),
  };
});
