import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./22";

test("2024.22", async (t) => {
  const input = `1
2
3
2024`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 37990510n);
  t.assert.equal(result.second, 23);
});
