import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2019.12", async (t) => {
  const input = `<x=-1, y=0, z=2>
<x=2, y=-10, z=-7>
<x=4, y=-8, z=8>
<x=3, y=5, z=-1>`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 183);
  t.assert.equal(result.second, 2772);
});
