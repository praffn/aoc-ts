import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./05";

test("2016.05", async (t) => {
  t.skip("This test is skipped because it takes too long to run");
  return;

  const input = `abc`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "18f47a30");
  t.assert.equal(result.second, "05ace8e3");
});
