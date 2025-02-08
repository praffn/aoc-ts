import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2021.17", async (t) => {
  const input = `target area: x=20..30, y=-10..-5`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 45);
  t.assert.equal(result.second, 112);
});
