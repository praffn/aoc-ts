import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

test("2025.01", async (t) => {
  const input = `L68
L30
R48
L5
R60
L55
L1
L99
R14
L82`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 3);
  t.assert.equal(result.second, 6);
});
