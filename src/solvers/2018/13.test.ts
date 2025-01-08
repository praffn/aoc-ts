import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./13";

test("2018.13", async (t) => {
  const input = `/>-<\  
|   |  
| /<+-\\
| | | v
\\>+</ |
  |   ^
  \\<->/`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "2,0");
  t.assert.equal(result.second, "6,4");
});
