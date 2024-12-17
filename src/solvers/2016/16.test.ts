import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./16";

test("2016.16", async (t) => {
  const input = `10011111011011001`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "10111110010110110");
  t.assert.equal(result.second, "01101100001100100");
});
