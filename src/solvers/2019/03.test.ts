import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

test("2019.03", async (t) => {
  const input = `R98,U47,R26,D63,R33,U87,L62,D20,R33,U53,R51
U98,R91,D20,R16,D67,R40,U7,R15,U6,R7`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 135);
  t.assert.equal(result.second, 410);
});
