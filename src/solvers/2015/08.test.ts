import test from "node:test";
import { countStringLength } from "./08";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./08";

test("2015.08", async (t) => {
  const input = `""
"abc"
"aaa\\"aaa"
"\\x27"`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 12);
  t.assert.equal(result.second, 19);
});
