import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./15";

test("2016.15", async (t) => {
  const input = `Disc #1 has 5 positions; at time=0, it is at position 2.
Disc #2 has 13 positions; at time=0, it is at position 7.
Disc #3 has 17 positions; at time=0, it is at position 10.
Disc #4 has 3 positions; at time=0, it is at position 2.
Disc #5 has 19 positions; at time=0, it is at position 9.
Disc #6 has 7 positions; at time=0, it is at position 0.`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 148737);
  t.assert.equal(result.second, 2353212);
});
