import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./19";

test("2018.19", async (t) => {
  const input = `#ip 5
addi 5 16 5
seti 1 8 4
seti 1 5 3
mulr 4 3 1
eqrr 1 2 1
addr 1 5 5
addi 5 1 5
addr 4 0 0
addi 3 1 3
gtrr 3 2 1
addr 5 1 5
seti 2 5 5
addi 4 1 4
gtrr 4 2 1
addr 1 5 5
seti 1 2 5
mulr 5 5 5
addi 2 2 2
mulr 2 2 2
mulr 5 2 2
muli 2 11 2
addi 1 8 1
mulr 1 5 1
addi 1 18 1
addr 2 1 2
addr 5 0 5
seti 0 7 5
setr 5 0 1
mulr 1 5 1
addr 5 1 1
mulr 5 1 1
muli 1 14 1
mulr 1 5 1
addr 2 1 2
seti 0 0 0
seti 0 9 5`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1872);
  t.assert.equal(result.second, 18992592);
});
