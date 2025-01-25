import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./24";

test("2019.24", async (t) => {
  const input = `#.#.#
.#...
...#.
.###.
###.#`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 11042850);
  t.assert.equal(result.second, 1967);
});
