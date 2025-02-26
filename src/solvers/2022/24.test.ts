import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./24";

test("2022.24", async (t) => {
  const input = `#E######
#>>.<^<#
#.<..<<#
#>v.><>#
#<^v^^>#
######.#`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 18);
  t.assert.equal(result.second, 54);
});
