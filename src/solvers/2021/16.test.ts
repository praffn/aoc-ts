import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./16";

test("2021.16", async (t) => {
  const inputs = [
    ["C200B40A82", 14, 3n],
    ["04005AC33890", 8, 54n],
    ["880086C3E88112", 15, 7n],
    ["CE00C43D881120", 11, 9n],
    ["D8005AC2A8F0", 13, 1n],
    ["F600BC2D8F", 19, 0n],
    ["9C005AC2F8F0", 16, 0n],
    ["9C0141080250320F1802104A08", 20, 1n],
  ] as const;

  for (const [input, p1, p2] of inputs) {
    const lineReader = createLineReaderFromString(input);
    const result = await solver(lineReader);

    t.assert.equal(result.first, p1);
    t.assert.equal(result.second, p2);
  }
});
