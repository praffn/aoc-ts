import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./04";

test("2016.04", async (t) => {
  const input = `aaaaa-bbb-z-y-x-123[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]
rsvxltspi-sfnigx-wxsveki-984[sixve]`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 2498);
  t.assert.equal(result.second, 984);
});
