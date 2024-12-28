import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./04";

test("2017.04", async (t) => {
  const input = `abcde fghij
abcde xyz ecdab
a ab abc abd abf abj
iiii oiii ooii oooi oooo
oiii ioii iioi iiio
aa bb cc dd ee
aa bb cc dd aa
aa bb cc dd aaa`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 7);
  t.assert.equal(result.second, 5);
});
