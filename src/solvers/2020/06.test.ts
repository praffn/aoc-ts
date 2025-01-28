import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2020.06", async (t) => {
  const input = `abc

a
b
c

ab
ac

a
a
a
a

b`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 11);
  t.assert.equal(result.second, 6);
});
