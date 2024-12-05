---
to: src/solvers/<%= year %>/<%= day.toString().padStart(2, '0') %>.test.ts
---

import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./<%= day.toString().padStart(2, '0') %>";

test("<%= year %>.<%= day.toString().padStart(2, '0') %>", async (t) => {
  const input = ``;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 0);
  t.assert.equal(result.second, 0);
});