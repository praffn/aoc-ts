import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./09";

test("2018.09", async (t) => {
  const input = `30 players; last marble is worth 5807 points`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 37305);
  t.assert.equal(result.second, 320997431);
});
