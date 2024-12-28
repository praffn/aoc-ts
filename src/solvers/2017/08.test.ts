import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./08";

test("2017.08", async (t) => {
  const input = `b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1);
  t.assert.equal(result.second, 10);
});
