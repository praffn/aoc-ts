import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./05";

test("2019.05", async (t) => {
  const input = `3,21,1008,21,5,20,1005,20,22,107,5,21,20,1006,20,31,1106,0,36,98,0,0,1002,21,125,20,4,20,1105,1,46,104,999,1105,1,46,1101,1000,1,20,4,20,1105,1,46,98,99`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 999);
  t.assert.equal(result.second, 625);
});
