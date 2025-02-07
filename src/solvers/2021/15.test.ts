import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./15";

test("2021.15", async (t) => {
  const input = `1163751742
1381373672
2136511328
3694931569
7463417111
1319128137
1359912421
3125421639
1293138521
2311944581`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 40);
  t.assert.equal(result.second, 315);
});
