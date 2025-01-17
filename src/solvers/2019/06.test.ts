import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2019.06", async (t) => {
  const input = `COM)B
B)C
C)D
D)E
E)F
B)G
G)H
D)I
E)J
J)K
K)L
K)YOU
I)SAN`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 54);
  t.assert.equal(result.second, 4);
});
