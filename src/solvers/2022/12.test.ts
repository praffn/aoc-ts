import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2022.12", async (t) => {
  const input = `Sabqponm
abcryxxl
accszExk
acctuvwj
abdefghi`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 31);
  t.assert.equal(result.second, 29);
});
