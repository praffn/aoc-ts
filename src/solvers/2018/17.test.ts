import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2018.17", async (t) => {
  const input = `x=495, y=2..7
y=7, x=495..501
x=501, y=3..7
x=498, y=2..4
x=506, y=1..2
x=498, y=10..13
x=504, y=10..13
y=13, x=498..504`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 57);
  t.assert.equal(result.second, 29);
});
