import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./18";

test("2017.18", async (t) => {
  const input = `set a 1
add a 2
mul a a
mod a 5
snd a
set a 0
rcv a
jgz a -1
set a 1
jgz a -2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 4);
  t.assert.equal(result.second, 1);
});
