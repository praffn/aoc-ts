import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2022.17", async (t) => {
  const input = `>>><<><>><<<>><>>><<<>>><<<><<<>><>><<>>`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 3068);
  t.assert.equal(result.second, 1514285714288);
});
