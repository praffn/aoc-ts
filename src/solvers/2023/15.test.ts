import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./15";

test("2023.15", async (t) => {
  const input = `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1320);
  t.assert.equal(result.second, 145);
});
