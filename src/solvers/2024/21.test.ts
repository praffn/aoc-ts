import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./21";

test("2024.21", async (t) => {
  const input = `029A
980A
179A
456A
379A`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 126384);
  t.assert.equal(result.second, 154115708116294);
});
