import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./09";

test("2022.09", async (t) => {
  const input = `R 5
U 8
L 8
D 3
R 17
D 10
L 25
U 20`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 88);
  t.assert.equal(result.second, 36);
});
