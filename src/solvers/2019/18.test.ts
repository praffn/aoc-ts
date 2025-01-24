import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./18";

test("2019.18", async (t) => {
  const input = `#################
#i.G..c...e..H.p#
########.########
#j.A..b...f..D.o#
########@########
#k.E..a...g..B.n#
########.########
#l.F..d...h..C.m#
#################`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);
  t.assert.equal(result.first, 136);
  t.assert.equal(result.second, 14);
});
