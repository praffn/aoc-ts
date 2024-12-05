import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./15";

test("2015.15", async (t) => {
  const input = `Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 62842880);
  t.assert.equal(result.second, 57600000);
});
