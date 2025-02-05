import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./22";

test("2020.22", async (t) => {
  const input = `Player 1:
9
2
6
3
1

Player 2:
5
8
4
7
10`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 306);
  t.assert.equal(result.second, 291);
});
