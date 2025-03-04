import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2023.12", async (t) => {
  const input = `???.### 1,1,3
.??..??...?##. 1,1,3
?#?#?#?#?#?#?#? 1,3,1,6
????.#...#... 4,1,1
????.######..#####. 1,6,5
?###???????? 3,2,1`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 21);
  t.assert.equal(result.second, 525152);
});
