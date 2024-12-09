import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./09";

test("2024.09", async (t) => {
  const input = `2333133121414131402`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1928);
  t.assert.equal(result.second, 2858);
});
