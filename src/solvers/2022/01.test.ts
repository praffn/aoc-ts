import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

test("2022.01", async (t) => {
  const input = `1000
2000
3000

4000

5000
6000

7000
8000
9000

10000`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 24000);
  t.assert.equal(result.second, 45000);
});
