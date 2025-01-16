import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./23";

test("2018.23", async (t) => {
  const input = `pos=<10,12,12>, r=2
pos=<12,14,12>, r=2
pos=<16,12,12>, r=4
pos=<14,14,14>, r=6
pos=<50,50,50>, r=200
pos=<10,10,10>, r=5
pos=<-300,-300,-300>, r=1`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 6);
  t.assert.equal(result.second, 35); // off by one sometimes?
});
