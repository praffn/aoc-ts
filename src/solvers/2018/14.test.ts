import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./14";

test("2018.14", async (t) => {
  const input = `59414`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "5131221087");
  t.assert.equal(result.second, 2018);
});
