import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

test("2018.01", async (t) => {
  const input = `+7
+7
-2
-7
-4
+10`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 11);
  t.assert.equal(result.second, 12);
});
