import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2020.12", async (t) => {
  const input = `F10
N3
F7
R90
F11`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 25);
  t.assert.equal(result.second, 286);
});
