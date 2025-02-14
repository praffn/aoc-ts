import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./02";

test("2022.02", async (t) => {
  const input = `A Y
B X
C Z`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 15);
  t.assert.equal(result.second, 12);
});
