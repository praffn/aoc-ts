import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2016.12", async (t) => {
  const input = `jnz c 2
cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 42);
  t.assert.equal(result.second, 1);
});
