import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./10";

test("2017.10", async (t) => {
  const input = `63,144,180,149,1,255,167,84,125,65,188,0,2,254,229,24`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 4480);
  t.assert.equal(result.second, "c500ffe015c83b60fad2e4b7d59dabc4");
});
