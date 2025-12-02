import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./02";

test("2025.02", async (t) => {
  const input = `11-22,95-115,998-1012,1188511880-1188511890,222220-222224,
1698522-1698528,446443-446449,38593856-38593862,565653-565659,
824824821-824824827,2121212118-2121212124`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 1227775554);
  t.assert.equal(result.second, 4174379265);
});
