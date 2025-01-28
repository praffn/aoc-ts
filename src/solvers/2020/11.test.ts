import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./11";

test("2020.11", async (t) => {
  const input = `L.LL.LL.LL
LLLLLLL.LL
L.L.L..L..
LLLL.LL.LL
L.LL.LL.LL
L.LLLLL.LL
..L.L.....
LLLLLLLLLL
L.LLLLLL.L
L.LLLLL.LL`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 37);
  t.assert.equal(result.second, 26);
});
