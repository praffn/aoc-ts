import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./04";

test("2025.04", async (t) => {
  const input = `..@@.@@@@.
@@@.@.@.@@
@@@@@.@.@@
@.@@@@..@.
@@.@@@@.@@
.@@@@@@@.@
.@.@.@.@@@
@.@@@.@@@@
.@@@@@@@@.
@.@.@@@.@.`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 13);
  t.assert.equal(result.second, 43);
});
