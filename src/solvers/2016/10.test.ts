import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./10";

test("2016.10", async (t) => {
  const input = `value 17 goes to bot 10
value 2 goes to bot 7
value 61 goes to bot 10
bot 10 gives low to bot 7 and high to ouput 0
bot 7 gives low to bot 99 and high to output 1
value 3 goes to bot 99
bot 99 gives low to bot 15 and high to output 2`;
  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);
  t.assert.equal(result.first, 10);
  t.assert.equal(result.second, 3111);
});
