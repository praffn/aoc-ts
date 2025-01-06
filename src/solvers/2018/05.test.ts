import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./05";

test("2018.05", async (t) => {
  const input = `dabAcCaCBAcCcaDA`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 10);
  t.assert.equal(result.second, 4);
});
