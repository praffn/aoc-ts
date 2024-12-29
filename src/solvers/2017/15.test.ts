import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./15";

test("2017.15", async (t) => {
  t.skip("this test is disabled because it takes too long to run");
  return;
  const input = `Generator A starts with 516
Generator B starts with 190`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 597);
  t.assert.equal(result.second, 303);
});
