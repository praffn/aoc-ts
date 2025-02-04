import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./21";

test("2020.21", async (t) => {
  const input = `mxmxvkd kfcds sqjhc nhms (contains dairy, fish)
trh fvjkl sbzzf mxmxvkd (contains dairy)
sqjhc fvjkl (contains soy)
sqjhc mxmxvkd sbzzf (contains fish)`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 5);
  t.assert.equal(result.second, "mxmxvkd,sqjhc,fvjkl");
});
