import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./08";

test("2020.08", async (t) => {
  const input = `nop +0
acc +1
jmp +4
acc +3
jmp -3
acc -99
acc +1
jmp -4
acc +6`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 5);
  t.assert.equal(result.second, 8);
});
