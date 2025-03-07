import { sum } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

//#region Types & Parsing

type Category = "x" | "m" | "a" | "s";

type Part = Record<Category, number>;

/**
 * A rule with some value and some operation, that if the part satisfies, it
 * should go to the target workflow.
 */
type Rule = {
  category: Category;
  op: "lt" | "gt";
  value: number;
  target: string;
};

/**
 * A workflow is a collection of rules that tell us where a part should go
 * based on its values, as well as a fallback target if no rules are satisfied.
 */
type Workflow = {
  name: string;
  rules: Array<Rule>;
  fallback: string;
};

function parsePart(line: string): Part {
  const [x, m, a, s] = line.match(/(\d+)/g)!;
  return { x: +x, m: +m, a: +a, s: +s };
}

function parseRule(str: string): Rule {
  const category = str[0] as Category;
  const op = str[1] === "<" ? "lt" : "gt";
  const rest = str.slice(2);
  const [val, target] = rest.split(":");

  return {
    category,
    op,
    value: +val,
    target,
  };
}

function parseWorkflow(line: string): Workflow {
  const [, name, rulesString] = line.match(/(\w+){([^}]+)}/)!;
  const rawRules = rulesString.split(",");
  const fallback = rawRules.pop()!;
  return {
    name,
    rules: rawRules.map(parseRule),
    fallback,
  };
}

/**
 * Parses the input and returns an array of parts and a map of workflows
 */
function parse(input: string): [Array<Part>, Map<string, Workflow>] {
  const [rawWorkflows, rawParts] = input
    .split("\n\n")
    .map((s) => s.split("\n"));

  const parts = rawParts.map(parsePart);
  const workflows = new Map(
    rawWorkflows.map(parseWorkflow).map((w) => [w.name, w])
  );

  return [parts, workflows];
}

type Range = Record<Category, [number, number]>;

/**
 * Returns a new deep copy of the range
 */
function copyRange({ x, m, a, s }: Range): Range {
  return { x: [...x], m: [...m], a: [...a], s: [...s] };
}

//#endregion

//#region Solution

/**
 * Returns true if the part passes the workflow rule
 */
function passes(part: Part, rule: Rule) {
  const partValue = part[rule.category];
  return rule.op === "lt" ? partValue < rule.value : partValue > rule.value;
}

/**
 * Recursively passes the part through workflows until it is either accepted or
 * rejected. Returns true if accepted.
 */
function isAccepted(
  part: Part,
  workflows: Map<string, Workflow>,
  current = "in"
) {
  if (current === "A") return true;
  if (current === "R") return false;

  const workflow = workflows.get(current)!;
  for (const rule of workflow.rules) {
    if (passes(part, rule)) {
      // passes rule, continue down the rule target workflow
      return isAccepted(part, workflows, rule.target);
    }
  }

  // no rules passed, go to fallback workflow
  return isAccepted(part, workflows, workflow.fallback);
}

/**
 * Returns the sum of the total rating of all parts that are accepted by the
 * workflows.
 */
function getTotalRating(parts: Array<Part>, workflows: Map<string, Workflow>) {
  return sum(
    parts
      .filter((p) => isAccepted(p, workflows))
      .map((p) => p.x + p.m + p.a + p.s)
  );
}

/**
 * Returns a list of all valid ranges for the given workflow
 */
function getValidRanges(
  range: Range,
  workflows: Map<string, Workflow>,
  current = "in"
): Array<Range> {
  if (current === "A") {
    // all good, return the range
    return [copyRange(range)];
  }

  if (current === "R") {
    // no good :(
    return [];
  }

  const workflow = workflows.get(current)!;
  const ranges: Array<Range> = [];

  // Alright, lets go through all rules
  for (const rule of workflow.rules) {
    const newRange = copyRange(range);

    if (rule.op === "lt") {
      // If the rule is a less than check, we need to update the upper bound
      // of the range, and then recurse down the rule target workflow
      newRange[rule.category][1] = rule.value - 1;
      ranges.push(...getValidRanges(newRange, workflows, rule.target));
      range[rule.category][0] = rule.value;
    } else {
      // If the rule is a greater than check, we need to update the lower bound
      // of the range, and then recurse down the rule target workflow
      newRange[rule.category][0] = rule.value + 1;
      ranges.push(...getValidRanges(newRange, workflows, rule.target));
      range[rule.category][1] = rule.value;
    }
  }

  // Also recurse down the fallback workflow
  ranges.push(
    ...getValidRanges(copyRange(range), workflows, workflow.fallback)
  );

  return ranges;
}

/**
 * Returns the number of distinct rating combinations that are accepted by the
 * workflows
 */
function getDistinctRatingCombinations(workflows: Map<string, Workflow>) {
  // Start with the "super range"
  const range: Range = {
    x: [1, 4000],
    m: [1, 4000],
    a: [1, 4000],
    s: [1, 4000],
  };

  // And lets get all valid ranges
  const validRanges = getValidRanges(range, workflows);

  // Now we can calculate the number of combinations
  let combinations = 0;
  for (const r of validRanges) {
    combinations +=
      (r.x[1] - r.x[0] + 1) *
      (r.m[1] - r.m[0] + 1) *
      (r.a[1] - r.a[0] + 1) *
      (r.s[1] - r.s[0] + 1);
  }

  return combinations;
}

//#endregion

export default createSolverWithString(async (input) => {
  const [parts, workflows] = parse(input);

  return {
    first: getTotalRating(parts, workflows),
    second: getDistinctRatingCombinations(workflows),
  };
});
