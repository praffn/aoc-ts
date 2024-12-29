import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./09";

test("2017.09", async (t) => {
  const input = `{{},<{}!>!!>,{{<a!>},<a!>},>}}`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 8);
  t.assert.equal(result.second, 9);
});
