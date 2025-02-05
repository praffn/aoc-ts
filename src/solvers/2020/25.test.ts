import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./25";

test("2020.25", async (t) => {
  const input = `5764801
17807724`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 14897079);
});
