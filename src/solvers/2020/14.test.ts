import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./14";

test("2020.14", async (t) => {
  const input = `mask = 000000000000000000000000000000X1001X
mem[42] = 100
mask = 00000000000000000000000000000000X0XX
mem[26] = 1
mem[27] = 1`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 52n);
  t.assert.equal(result.second, 208n);
});
