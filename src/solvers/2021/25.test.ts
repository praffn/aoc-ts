import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./25";

test("2021.25", async (t) => {
  const input = `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 58);
});
