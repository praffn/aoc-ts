import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./02";

test("2016.02", async (t) => {
  const input = `ULL
RRDDD
LURDL
UUUUD`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "1985");
  t.assert.equal(result.second, "5DB3");
});
