import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./23";

test("2021.23", async (t) => {
  const input = `#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 12521);
  t.assert.equal(result.second, 44169);
});
