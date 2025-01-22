import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./16";

test("2019.16", async (t) => {
  const input = `03036732577212944063491565474664`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "24465799");
  t.assert.equal(result.second, "84462026");
});
