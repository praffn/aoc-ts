import { chunkWhile } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

/**
 * A rule is either a terminal (a string) or it is an array of sequences.
 */
type Rules = Record<number, string | Array<Array<number>>>;

const re =
  /^(\d+): (?:(?:(?<sequence>\d+(?: \d+)*)|(?<either>\d+(?: \d+)* \| \d+(?: \d+)*))|\"(?<terminal>a|b)\")$/;
/**
 * Returns a map of rules from the input.
 */
function parseRules(input: Array<string>) {
  const rules: Rules = {};
  for (const line of input) {
    const match = line.match(re)!;
    const id = parseInt(match[1]);

    if (match.groups?.terminal) {
      rules[id] = match.groups.terminal;
    } else if (match.groups?.sequence) {
      rules[id] = [match.groups.sequence.split(" ").map((v) => parseInt(v))];
    } else if (match.groups?.either) {
      rules[id] = match.groups.either
        .split(" | ")
        .map((v) => v.split(" ").map((v) => parseInt(v)));
    }
  }

  return rules;
}

/**
 * Returns a map of rules from the input, as well as the messages.
 */
function parse(input: Array<string>): {
  rules: Rules;
  messages: Array<string>;
} {
  const [rules, messages] = chunkWhile(input, (line) => line !== "");

  return {
    rules: parseRules(rules),
    messages,
  };
}

/**
 * Returns a generator that yields the remaining string after matching the rule
 * If it yields nothing, the rule did not match.
 */
function* run(rules: Rules, rule: number, str: string): Generator<string> {
  const value = rules[rule];
  if (typeof value === "string") {
    if (str.length !== 0 && str[0] === value) {
      yield str.slice(1);
    }
  } else {
    yield* runAlternative(rules, value, str);
  }
}

/**
 * Runs all sequences of the rule yields any remaining parts of matching strings
 */
function* runAlternative(
  rules: Rules,
  value: Array<Array<number>>,
  str: string
) {
  for (const seq of value) {
    yield* runSequence(rules, seq, str);
  }
}

/**
 * Runs all rules in a sequence and yields any remaining parts of matching strings
 */
function* runSequence(
  rules: Rules,
  seq: Array<number>,
  str: string
): Generator<string> {
  if (seq.length === 0) {
    yield str;
  } else {
    const [rule, ...rest] = seq;
    for (const remainingStr of run(rules, rule, str)) {
      yield* runSequence(rules, rest, remainingStr);
    }
  }
}

/**
 * Returns true if the string matches the rules
 */
function matches(rules: Rules, str: string) {
  // Since `run` will yield the "remaining" string of a match, we must assume
  // that a valid string will then yield an empty string, and an invalid string
  // will yield nothing. Therefore, we can just check that any yielded value is
  // the empty string.
  return run(rules, 0, str).some((v) => v === "");
}

/**
 * Just returns the number of messages that match the rules.
 */
function solveFirst(rules: Rules, messages: Array<string>) {
  return messages.filter((m) => matches(rules, m)).length;
}

/**
 * Adds the extra rules, causing rules to contain loops. No problem
 * Still just returns the number of messages that match the rules.
 */
function solveSecond(rules: Rules, messages: Array<string>) {
  const rulesWithAdditions = {
    ...rules,
    8: [[42], [42, 8]],
    11: [
      [42, 31],
      [42, 11, 31],
    ],
  };

  return messages.filter((m) => matches(rulesWithAdditions, m)).length;
}

export default createSolverWithLineArray(async (input) => {
  const { rules, messages } = parse(input);

  return {
    first: solveFirst(rules, messages),
    second: solveSecond(rules, messages),
  };
});
