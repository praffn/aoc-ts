import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./21";

test("2021.21", async (t) => {
  const input = `Player 1 starting position: 4
Player 2 starting position: 8`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 739785);
  t.assert.equal(result.second, 444356092776315);
});
