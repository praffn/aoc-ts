import { createSolverWithLineArray } from "../../solution";

type NumberMonkey = {
  type: "number";
  name: string;
  value: number | null;
};

type OperationMonkey = {
  type: "operation";
  name: string;
  lhs: string;
  rhs: string;
  op: string;
};

type Monkey = NumberMonkey | OperationMonkey;

function parseMonkey(line: string): Monkey {
  const [name, expr] = line.split(": ");
  if (/\d+/.test(expr)) {
    return {
      type: "number",
      name,
      value: +expr,
    };
  }

  const [lhs, op, rhs] = expr.split(" ");
  return {
    type: "operation",
    name,
    lhs,
    rhs,
    op,
  };
}

function parse(input: Array<string>) {
  const monkeys = new Map<string, Monkey>();

  for (const line of input) {
    const monkey = parseMonkey(line);
    monkeys.set(monkey.name, monkey);
  }

  return monkeys;
}

/**
 * Returns the result of the arithmetic operation on the two numbers
 */
function performArithmetic(a: number, b: number, op: string) {
  switch (op) {
    case "+":
      return a + b;
    case "*":
      return a * b;
    case "-":
      return a - b;
    case "/":
      return a / b;
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}

/**
 * Returns the reverse of the arithmetic operation on the two numbers.
 * Since subtraction and division is non-commutative, we need to know know
 * which side of the operation we're reversing.
 */
function reverseArithmetic(a: number, b: number, op: string, lhs: boolean) {
  switch (op) {
    case "+":
      return a - b;
    case "-":
      return lhs ? a + b : b - a;
    case "*":
      return a / b;
    case "/":
      return lhs ? a * b : b / a;
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}

/**
 * Returns the final result of the target monkey.
 */
function evaluate(
  name: string,
  monkeys: Map<string, Monkey>,
  cache = new Map<string, number | null>()
) {
  if (cache.has(name)) {
    return cache.get(name)!;
  }

  const monkey = monkeys.get(name)!;

  if (monkey.type === "number") {
    cache.set(name, monkey.value);
    return monkey.value;
  }

  const lhs = evaluate(monkey.lhs, monkeys, cache);
  const rhs = evaluate(monkey.rhs, monkeys, cache);

  if (lhs === null || rhs === null) {
    cache.set(name, null);
    return null;
  }

  const result = performArithmetic(lhs, rhs, monkey.op);
  cache.set(name, result);

  return result;
}

/**
 * Just solves the first part by evaluating the root monkey
 */
function solveFirst(monkeys: Map<string, Monkey>) {
  return evaluate("root", monkeys)!;
}

/**
 * Solves the second part by figuring out which number "humn" should contain
 * to pass "root"'s equality check.
 */
function solveSecond(monkeys: Map<string, Monkey>) {
  monkeys = new Map(monkeys);
  // override "humn" to be null (which will propagate)
  monkeys.set("humn", { type: "number", name: "humn", value: null });
  // lets find the lhs and rhs of the root operation
  const { lhs, rhs } = monkeys.get("root")! as OperationMonkey;

  const known = new Map<string, number>();
  const lhsResult = evaluate(lhs, monkeys, known);
  const rhsResult = evaluate(rhs, monkeys, known);

  // since null from "humn" should propagate, either lhs or rhs should be null
  // whichever is null is the target monkey we're gonna "drill down" to find
  // all arithmetic operations that was done to it
  let target = lhsResult === null ? lhs : rhs;
  let current = lhsResult === null ? rhsResult! : lhsResult;

  // lets go all they way down and stop at "humn"
  while (target !== "humn") {
    // keep finding out which side of the operation is null

    const { lhs, op, rhs } = monkeys.get(target)! as OperationMonkey;

    if (known.get(lhs) === null) {
      target = lhs;
      current = reverseArithmetic(current, known.get(rhs)!, op, true);
    } else {
      target = rhs;
      current = reverseArithmetic(current, known.get(lhs)!, op, false);
    }
  }

  return current;
}

export default createSolverWithLineArray(async (input) => {
  const monkeys = parse(input);

  return {
    first: solveFirst(monkeys),
    second: solveSecond(monkeys),
  };
});
