import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./23";

test("2015.23", async (t) => {
  const input = `inc a
jie a, +4
inc a
tpl a
inc b
inc b`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2);
  t.assert.equal(result.second, 1);
});
