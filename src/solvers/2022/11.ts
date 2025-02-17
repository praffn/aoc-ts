import { numericProduct, range } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

//#region Types & Parsing

type Operation = (old: number) => number;
type Test = { mod: number; trueMonkey: number; falseMonkey: number };

type Monkey = {
  items: Array<number>;
  operation: Operation;
  test: Test;
  inspections: number;
};

function parseOperation(input: string): Operation {
  const [, , lhsRaw, op, rhsRaw] = input.split(" ");
  const lhs = lhsRaw === "old" ? null : +lhsRaw;
  const rhs = rhsRaw === "old" ? null : +rhsRaw;

  return (old: number) => {
    const a = lhs ?? old;
    const b = rhs ?? old;

    return op === "+" ? a + b : a * b;
  };
}

function parseTest(input: Array<string>): Test {
  const [mod, trueMonkey, falseMonkey] = input.map(
    (line) => +line.split(" ").at(-1)!
  );

  return { mod, trueMonkey, falseMonkey };
}

function parseMonkeys(input: string): Array<Monkey> {
  const monkeys: Array<Monkey> = [];

  const chunks = input.split("\n\n").map((chunk) => chunk.split("\n"));

  for (const chunk of chunks) {
    const [, itemsRaw] = chunk[1].split(": ");
    const items = itemsRaw.split(", ").map((n) => +n);
    const operation = parseOperation(chunk[2].split(": ")[1]);
    const test = parseTest(chunk.slice(3));
    monkeys.push({ items, operation, test, inspections: 0 });
  }

  return monkeys;
}

//#endregion

//#region Monkey Business

/**
 * Returns the total monkey business level after the given number of iterations.
 *
 * If `reduceWorry` is true, the worry is reduced by a factor of 3 before being
 * passed to the next monkey. Otherwise, the worry is reduced by the total mod
 * of all monkeys.
 */
function monkeyBusiness(
  monkeys: Array<Monkey>,
  iterations: number,
  reduceWorry: boolean
) {
  // deepish clone
  monkeys = monkeys.map((m) => ({
    ...m,
    items: [...m.items],
  }));

  // we can safely reduce the worry level by the product of all monkey test mods
  const totalMod = numericProduct(monkeys.map((m) => m.test.mod));

  // Lets go through each monkey and each item (FIFO) and pass it to the next
  // monkey based on the test.
  for (const _ of range(iterations)) {
    for (const monkey of monkeys) {
      for (const _ of range(monkey.items.length)) {
        let worry = monkey.items.shift()!;
        monkey.inspections++;
        worry = monkey.operation(worry);
        if (reduceWorry) {
          // if reduceWorry is true, we reduce the worry by a factor of 3
          worry = Math.floor(worry / 3);
        } else {
          // otherwise we reduce it by the total mod
          worry %= totalMod;
        }
        const newMonkey =
          worry % monkey.test.mod === 0
            ? monkey.test.trueMonkey
            : monkey.test.falseMonkey;
        monkeys[newMonkey].items.push(worry);
      }
    }
  }

  // return the product of the inspections of the two monkeys with the most
  // inspections
  const [a, b] = monkeys.sort((a, b) => b.inspections - a.inspections);
  return a.inspections * b.inspections;
}

//#endregion

export default createSolverWithString(async (input) => {
  const monkeys = parseMonkeys(input);

  return {
    first: monkeyBusiness(monkeys, 20, true),
    second: monkeyBusiness(monkeys, 10_000, false),
  };
});
