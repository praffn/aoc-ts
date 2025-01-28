import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

test("2020.01", async (t) => {
  const input = `1721
979
366
299
675
1456`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 514579);
  t.assert.equal(result.second, 241861950);
});
