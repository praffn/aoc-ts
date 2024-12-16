import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./11";

test("2016.11", async (t) => {
  const input = `The first floor contains a thulium generator, a thulium-compatible microchip, a plutonium generator, and a strontium generator.
The second floor contains a plutonium-compatible microchip and a strontium-compatible microchip.
The third floor contains a promethium generator, a promethium-compatible microchip, a ruthenium generator, and a ruthenium-compatible microchip.
The fourth floor contains nothing relevant.`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 31);
  t.assert.equal(result.second, 55);
});
