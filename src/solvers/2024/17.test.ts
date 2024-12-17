import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2024.17", async (t) => {
  const input = `Register A: 18427963
Register B: 0
Register C: 0

Program: 2,4,1,1,7,5,0,3,4,3,1,6,5,5,3,0`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "2,0,7,3,0,3,1,3,7");
  t.assert.equal(result.second, 247839539763386);
});
