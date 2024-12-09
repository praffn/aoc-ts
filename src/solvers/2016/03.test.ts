import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./03";

test("2016.03", async (t) => {
  const input = `  775  785  361
  622  375  125
  297  839  375
  245   38  891
  503  463  849
  731  482  759
   29  734  734
  245  771  269
  261  315  904
  669   96  581
  570  745  156
  124  678  684
  472  360   73
  174  251  926
  406  408  976
  413  238  571
  375  554   22
  211  379  590`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 7);
  t.assert.equal(result.second, 18);
});
