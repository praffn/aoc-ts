import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2022.06", async (t) => {
  const input = `zcfzfwzzqfrljwzlrfnpqdbhtmscgvjw`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 11);
  t.assert.equal(result.second, 26);
});
