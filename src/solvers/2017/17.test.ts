import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2017.17", async (t) => {
  const input = `371`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1311);
  t.assert.equal(result.second, 39170601);
});
