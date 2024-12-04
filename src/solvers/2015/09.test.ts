import test from "node:test";
import solver from "./09";
import { createLineReaderFromString } from "../../line-reader";

test("2015.09", async (t) => {
  const input = `London to Dublin = 464
London to Belfast = 518
Dublin to Belfast = 141`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 605);
  t.assert.equal(result.second, 982);
});
