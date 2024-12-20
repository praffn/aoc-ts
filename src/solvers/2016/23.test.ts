import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./23";

test("2016.23", async (t) => {
  const input = `cpy a b
dec b
cpy a d
cpy 0 a
cpy b c
inc a
dec c
jnz c -2
dec d
jnz d -5
dec b
cpy b c
cpy c d
dec d
inc c
jnz d -2
tgl c
cpy -16 c
jnz 1 c
cpy 77 c
jnz 87 d
inc a
inc d
jnz d -2
inc c
jnz c -5`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 11739);
  t.assert.equal(result.second, 6831);
});
