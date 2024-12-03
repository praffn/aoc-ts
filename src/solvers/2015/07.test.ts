import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./07";

test("2015.07", async (t) => {
  const input = `1 -> x
NOT x -> y
70 -> z
x OR z -> v
v LSHIFT 1 -> b
b LSHIFT 2 -> a`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 568);
  t.assert.equal(result.second, 2272);
});
