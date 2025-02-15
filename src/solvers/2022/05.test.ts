import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./05";

test("2022.05", async (t) => {
  const input = `    [D]    
[N] [C]    
[Z] [M] [P]
 1   2   3 

move 1 from 2 to 1
move 3 from 1 to 3
move 2 from 2 to 1
move 1 from 1 to 2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "CMZ");
  t.assert.equal(result.second, "MCD");
});
