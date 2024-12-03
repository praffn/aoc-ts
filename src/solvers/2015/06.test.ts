import test from "node:test";
import solver from "./06";
import { createLineReaderFromString } from "../../line-reader";

test("2015-06", async (t) => {
  const input = `turn on 0,0 through 999,999
turn off 499,499 through 500,500
toggle 0,0 through 999,0
toggle 0,0 through 0,999
toggle 0,0 through 999,999`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2002);
  t.assert.equal(result.second, 3003996);
});
