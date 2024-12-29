import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2017.12", async (t) => {
  const input = `0 <-> 2
1 <-> 1
2 <-> 0, 3, 4
3 <-> 2, 4
4 <-> 2, 3, 6
5 <-> 6
6 <-> 4, 5
7 <-> 8`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 6);
  t.assert.equal(result.second, 3);
});
