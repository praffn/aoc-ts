import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./18";

test("2016.18", async (t) => {
  const input = `.^^..^...^..^^.^^^.^^^.^^^^^^.^.^^^^.^^.^^^^^^.^...^......^...^^^..^^^.....^^^^^^^^^....^^...^^^^..^`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2005n);
  t.assert.equal(result.second, 20008491n);
});
