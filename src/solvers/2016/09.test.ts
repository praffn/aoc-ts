import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./09";

test("2016.09", async (t) => {
  const input = `(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 238);
  t.assert.equal(result.second, 445);
});
