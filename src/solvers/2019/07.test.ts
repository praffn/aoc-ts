import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./07";

test("2019.07", async (t) => {
  const input = `3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54,-5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4,53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 20);
  t.assert.equal(result.second, 18216);
});
