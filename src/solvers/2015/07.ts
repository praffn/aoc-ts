import { createSolver } from "../../solution";

type Value = string | number;

type Gate =
  | {
      operator: "AND" | "OR" | "LSHIFT" | "RSHIFT";
      operand1: Value;
      operand2: Value;
    }
  | {
      operator: "NOT" | "ASSIGN";
      operand1: Value;
    };

function isDigit(c: string): boolean {
  return c >= "0" && c <= "9";
}

function parseValue(value: string): Value {
  return isDigit(value[0]) ? Number.parseInt(value, 10) : value;
}

function parseGate(input: string): Gate {
  const [first, second, third] = input.split(" ");

  if (!second) {
    return {
      operator: "ASSIGN",
      operand1: parseValue(first),
    };
  }

  if (first === "NOT") {
    return {
      operator: "NOT",
      operand1: parseValue(second),
    };
  }

  return {
    operator: second as Gate["operator"],
    operand1: parseValue(first),
    operand2: parseValue(third),
  };
}

function evaluate(
  target: Value,
  wires: Map<string, Gate>,
  cache: Map<string, number>
): number {
  if (typeof target === "number") {
    return target;
  }

  if (cache.has(target)) {
    return cache.get(target)!;
  }

  const gate = wires.get(target)!;

  switch (gate.operator) {
    case "ASSIGN": {
      const value = evaluate(gate.operand1, wires, cache);
      cache.set(target, value);
      return value;
    }
    case "NOT": {
      const value = 65535 - evaluate(gate.operand1, wires, cache);
      cache.set(target, value);
      return value;
    }
    case "AND": {
      const value1 =
        typeof gate.operand1 === "number"
          ? gate.operand1
          : evaluate(gate.operand1, wires, cache);
      const value2 =
        typeof gate.operand2 === "number"
          ? gate.operand2
          : evaluate(gate.operand2, wires, cache);
      const value = value1 & value2;
      cache.set(target, value);
      return value;
    }
    case "OR": {
      const value1 =
        typeof gate.operand1 === "number"
          ? gate.operand1
          : evaluate(gate.operand1, wires, cache);
      const value2 =
        typeof gate.operand2 === "number"
          ? gate.operand2
          : evaluate(gate.operand2, wires, cache);
      const value = value1 | value2;
      cache.set(target, value);
      return value;
    }
    case "LSHIFT": {
      const value1 =
        typeof gate.operand1 === "number"
          ? gate.operand1
          : evaluate(gate.operand1, wires, cache);
      const value = value1 << evaluate(gate.operand2, wires, cache);
      cache.set(target, value);
      return value;
    }
    case "RSHIFT": {
      const value1 =
        typeof gate.operand1 === "number"
          ? gate.operand1
          : evaluate(gate.operand1, wires, cache);
      const value = value1 >> evaluate(gate.operand2, wires, cache);
      cache.set(target, value);
      return value;
    }
  }
}

export default createSolver(async (input) => {
  const wires = new Map<string, Gate>();
  const cache = new Map<string, number>();

  for await (const line of input) {
    const [rawGate, target] = line.split(" -> ");
    const gate = parseGate(rawGate);
    wires.set(target, gate);
  }

  const a1 = evaluate("a", wires, cache);
  cache.clear();
  cache.set("b", a1);
  const a2 = evaluate("a", wires, cache);

  return {
    first: a1,
    second: a2,
  };
});
