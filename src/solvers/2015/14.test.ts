import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./14";

test("2015.14", async (t) => {
  const input = `Comet can fly 14 km/s for 10 seconds, but then must rest for 127 seconds.
Dancer can fly 16 km/s for 11 seconds, but then must rest for 162 seconds.`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2660);
  t.assert.equal(result.second, 1564);
});
