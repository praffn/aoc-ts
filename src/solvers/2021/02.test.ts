import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./02";

test("2021.02", async (t) => {
  const input = `forward 5
down 5
forward 8
up 3
down 8
forward 2`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 150);
  t.assert.equal(result.second, 900);
});
