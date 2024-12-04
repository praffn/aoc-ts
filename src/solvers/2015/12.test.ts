import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2015-12", async (t) => {
  const input = JSON.stringify([
    1,
    { a: 2, b: [1, "a", 3] },
    "red",
    { red: 3 },
    [1, 2, 3],
    { a: "red", b: 3 },
  ]);

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 19);
  t.assert.equal(result.second, 16);
});
