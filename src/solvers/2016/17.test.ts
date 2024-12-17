import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2016.17", async (t) => {
  const input = `gdjjyniy`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "DUDDRLRRRD");
  t.assert.equal(result.second, 578);
});
