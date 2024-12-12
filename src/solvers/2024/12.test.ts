import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./12";

test("2024.12", async (t) => {
  const input = `RRRRIICCFF
RRRRIICCCF
VVRRRCCFFF
VVRCCCJFFF
VVVVCJJCFE
VVIVCCJJEE
VVIIICJJEE
MIIIIIJJEE
MIIISIJEEE
MMMISSJEEE`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1930);
  t.assert.equal(result.second, 1206);
});
