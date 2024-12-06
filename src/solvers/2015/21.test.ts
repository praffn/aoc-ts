import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./21";

test("2015.21", async (t) => {
  const input = `Hit Points: 103
Damage: 9
Armor: 2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 121);
  t.assert.equal(result.second, 201);
});
