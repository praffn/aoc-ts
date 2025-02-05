import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./23";

test("2020.23", async (t) => {
  const input = `389125467`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "67384529");
  t.assert.equal(result.second, 149245887792);
});
