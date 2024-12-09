import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2016.06", async (t) => {
  const input = `eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "easter");
  t.assert.equal(result.second, "advent");
});
