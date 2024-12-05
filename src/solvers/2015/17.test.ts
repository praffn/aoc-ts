import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2015.17", async (t) => {
  const input = `11
30
47
31
32
36
3
1
5
3
32
36
15
11
46
26
28
1
19
3`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 4372);
  t.assert.equal(result.second, 4);
});
