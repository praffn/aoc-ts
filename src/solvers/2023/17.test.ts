import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2023.17", async (t) => {
  const input = `2413432311323
3215453535623
3255245654254
3446585845452
4546657867536
1438598798454
4457876987766
3637877979653
4654967986887
4564679986453
1224686865563
2546548887735
4322674655533`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 102);
  t.assert.equal(result.second, 94);
});
