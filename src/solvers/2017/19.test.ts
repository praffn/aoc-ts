import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./19";

test("2017.19", async (t) => {
  const input = `     |          
     |  +--+    
     A  |  C    
 F---|----E|--+ 
     |  |  |  D 
     +B-+  +--+ 
`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "ABCDEF");
  t.assert.equal(result.second, 38);
});
