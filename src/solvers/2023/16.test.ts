import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./16";

test("2023.16", async (t) => {
  const input = `.|...\\....
|.-.\\.....
.....|-...
........|.
..........
.........\\
..../.\\\\..
.-.-/..|..
.|....-|.\\
..//.|....`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 46);
  t.assert.equal(result.second, 51);
});
