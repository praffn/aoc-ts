import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./25";

test("2022.25", async (t) => {
  const input = `1=-0-2
12111
2=0=
21
2=01
111
20012
112
1=-1=
1-12
12
1=
122
`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "2=-1=0");
});
