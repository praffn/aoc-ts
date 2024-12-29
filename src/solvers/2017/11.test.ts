import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./11";

test("2017.11", async (t) => {
  const input = `se,sw,se,sw,sw,n,n,s,n,ne,sw,ne,ne,ne,ne,ne,sw,sw,s`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2);
  t.assert.equal(result.second, 4);
});
