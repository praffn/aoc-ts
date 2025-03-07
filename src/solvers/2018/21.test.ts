import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./21";

test("2018.21", async (t) => {
  const input = `#ip 5
seti 123 0 2
bani 2 456 2
eqri 2 72 2
addr 2 5 5
seti 0 0 5
seti 0 5 2
bori 2 65536 4
seti 6718165 9 2
bani 4 255 3
addr 2 3 2
bani 2 16777215 2
muli 2 65899 2
bani 2 16777215 2
gtir 256 4 3
addr 3 5 5
addi 5 1 5
seti 27 8 5
seti 0 4 3
addi 3 1 1
muli 1 256 1
gtrr 1 4 1
addr 1 5 5
addi 5 1 5
seti 25 8 5
addi 3 1 3
seti 17 3 5
setr 3 6 4
seti 7 9 5
eqrr 2 0 3
addr 3 5 5
seti 5 1 5
`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 30842);
  t.assert.equal(result.second, 10748062);
});
