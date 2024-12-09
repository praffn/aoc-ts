import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./22";

test("2015.22", async (t) => {
  const input = `Hit Points: 58
Damage: 9`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1269);
  t.assert.equal(result.second, 1309);
});
