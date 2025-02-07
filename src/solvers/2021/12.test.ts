import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2021.12", async (t) => {
  const input = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 19);
  t.assert.equal(result.second, 103);
});
