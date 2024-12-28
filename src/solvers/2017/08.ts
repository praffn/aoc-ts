import { createSolver } from "../../solution";

function condition(op: string, n: number, v: number) {
  switch (op) {
    case ">":
      return n > v;
    case "<":
      return n < v;
    case ">=":
      return n >= v;
    case "<=":
      return n <= v;
    case "==":
      return n === v;
    case "!=":
      return n !== v;
  }
}

export default createSolver(async (input) => {
  const regs = new Map<string, number>();
  let highest = -Infinity;

  for await (const line of input) {
    const [reg, op, valS, _, condReg, condOp, condValS] = line.split(" ");
    const condRegVal = regs.get(condReg) ?? 0;
    const condVal = Number.parseInt(condValS, 10);

    if (!condition(condOp, condRegVal, condVal)) {
      continue;
    }

    const val = Number.parseInt(valS, 10);
    const regVal = regs.get(reg) ?? 0;
    const newVal = regVal + (op === "inc" ? val : -val);
    regs.set(reg, newVal);
    highest = Math.max(highest, newVal);
  }

  return {
    first: Math.max(...regs.values()),
    second: highest,
  };
});
