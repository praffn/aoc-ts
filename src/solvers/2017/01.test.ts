import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./01";

test("2017.01", async (t) => {
  const input = `5255443714755555317777152441826784321918285999594221531636`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 74);
  t.assert.equal(result.second, 30);
});
