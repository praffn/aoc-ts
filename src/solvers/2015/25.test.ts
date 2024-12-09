import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./25";

test("2015.25", async (t) => {
  const input = `To continue, please consult the code grid in the manual.  Enter the code at row 3010, column 3019.`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 8997277);
  t.assert.equal(result.second, "Merry Christmas!");
});
