import { createSolverWithLineArray } from "../../solution";

const connectionRe = /([^\s]+)\s([^\s]+)\s([^\s]+)\s->\s([^\s]+)/;

type Connection = {
  lhs: string;
  rhs: string;
  dst: string;
  op: string;
};

function compute(a: number, b: number, op: string) {
  switch (op) {
    case "AND":
      return a & b;
    case "OR":
      return a | b;
    case "XOR":
      return a ^ b;
    default:
      throw new Error(`Unknown operation: ${op}`);
  }
}

function isNotXYZ(s: string) {
  return !s.startsWith("z") && !s.startsWith("x") && !s.startsWith("y");
}

function simulate(connections: Array<Connection>, gates: Map<string, number>) {
  // Lets resolve all connections
  const unresolvedConnections = new Map<string, Set<Connection>>();
  for (const connection of connections) {
    resolve(connection, gates, unresolvedConnections);
  }

  // Find all z gates sorted
  const zGates = Array.from(
    gates.entries().filter(([key]) => key.startsWith("z"))
  ).sort(([a], [b]) => -a.localeCompare(b));

  // Convert z gates to a number (z00 -> z01 -> ... -> zNN, where z00 is LSB)
  // We start with MSB and then we just continue to shift left and OR next bit
  let result = 0n;
  for (const [, value] of zGates) {
    result <<= 1n;
    result |= BigInt(value);
  }

  return result;
}

function resolve(
  connection: Connection,
  gates: Map<string, number>,
  unresolved: Map<string, Set<Connection>>
) {
  const { lhs, rhs, dst, op } = connection;

  let unresolvable = false;
  if (!gates.has(lhs)) {
    unresolvable = true;
    unresolved.set(lhs, (unresolved.get(lhs) || new Set()).add(connection));
  }
  if (!gates.has(rhs)) {
    unresolvable = true;
    unresolved.set(rhs, (unresolved.get(rhs) || new Set()).add(connection));
  }
  if (unresolvable) {
    return false;
  }

  const a = gates.get(lhs)!;
  const b = gates.get(rhs)!;
  gates.set(dst, compute(a, b, op));

  if (unresolved.has(dst)) {
    const unresolvedConnections = unresolved.get(dst)!;
    for (const unresolvedConnection of unresolvedConnections) {
      if (resolve(unresolvedConnection, gates, unresolved)) {
        unresolvedConnections.delete(unresolvedConnection);
      }
    }
  }

  return true;
}

function findWrongGates(connections: Array<Connection>) {
  const highestZ = connections.reduce((r, { dst }) => {
    if (dst.startsWith("z")) {
      if (dst > r) {
        return dst;
      }
    }
    return r;
  }, "z00");

  const wrongGates = new Set<string>();
  for (const connection of connections) {
    const { lhs, rhs, dst, op } = connection;

    if (dst.startsWith("z") && op !== "XOR" && dst !== highestZ) {
      wrongGates.add(dst);
    }

    if (op === "XOR" && isNotXYZ(lhs) && isNotXYZ(rhs) && isNotXYZ(dst)) {
      wrongGates.add(dst);
    }

    if (op === "AND" && lhs !== "x00" && rhs !== "x00") {
      for (const other of connections) {
        if ((other.lhs === dst || other.rhs === dst) && other.op !== "OR") {
          wrongGates.add(dst);
        }
      }
    }

    if (op === "XOR") {
      for (const other of connections) {
        if ((other.lhs === dst || other.rhs === dst) && other.op === "OR") {
          wrongGates.add(dst);
        }
      }
    }
  }

  return Array.from(wrongGates).sort().join(",");
}

export default createSolverWithLineArray(async (input) => {
  const splitIndex = input.indexOf("");

  const gates = new Map(
    input.slice(0, splitIndex).map((line) => {
      const [key, value] = line.split(": ");
      return [key, value === "1" ? 1 : 0];
    })
  );

  const connections = input.slice(splitIndex + 1).map((line) => {
    const [, lhs, op, rhs, dst] = line.match(connectionRe)!;
    return { lhs, op, rhs, dst } satisfies Connection;
  });

  return {
    first: simulate(connections, gates),
    second: findWrongGates(connections),
  };
});
