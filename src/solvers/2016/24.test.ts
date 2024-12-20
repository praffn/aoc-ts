import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./24";

test("2016.24", async (t) => {
  const input = `###########
#0.1.....2#
#.#######.#
#4.......3#
###########`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 14);
  t.assert.equal(result.second, 20);
});
