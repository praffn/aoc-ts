import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./06";

test("2018.06", async (t) => {
  const input = `63, 142
190, 296
132, 194
135, 197
327, 292
144, 174
103, 173
141, 317
265, 58
344, 50
184, 238
119, 61
329, 106
70, 242
272, 346
312, 166
283, 351
286, 206
57, 225
347, 125
152, 186
131, 162
45, 299
142, 102
61, 100
111, 218
73, 266
350, 173
306, 221
42, 284
150, 122
322, 286
346, 273
75, 354
68, 124
194, 52
92, 44
77, 98
77, 107
141, 283
87, 306
184, 110
318, 343
330, 196
303, 353
268, 245
180, 220
342, 337
127, 107
203, 127`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 5429);
  t.assert.equal(result.second, 32614);
});
