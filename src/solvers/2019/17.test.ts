import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./17";

test("2019.17", async (t) => {
  const input = `1,330,331,332,109,3744,1102,1182,1,16,1101,0,1441,24,101,0,0,570,1006,570,36,102,1,571,0,1001,570,-1,570,1001,24,1,24,1106,0,18,1008,571,0,571,1001,16,1,16,1008,16,1441,570,1006,570,14,21102,1,58,0,1105,1,786,1006,332,62,99,21102,333,1,1,21101,73,0,0,1105,1,579,1102,0,1,572,1101,0,0,573,3,574,101,1,573,573,1007,574,65,570,1005,570,151,107,67,574,570,1005,570,151,1001,574,-64,574,1002,574,-1,574,1001,572,1,572,1007,572,11,570,1006,570,165,101,1182,572,127,1002,574,1,0,3,574,101,1,573,573,1008,574,10,570,1005,570,189,1008,574,44,570,1006,570,158,1106,0,81,21101,0,340,1,1106,0,177,21102,1,477,1,1106,0,177,21102,514,1,1,21102,176,1,0,1106,0,579,99,21101,0,184,0,1106,0,579,4,574,104,10,99,1007,573,22,570,1006,570,165,1001,572,0,1182,21102,375,1,1,21102,1,211,0,1106,0,579,21101,1182,11,1,21102,1,222,0,1105,1,979,21102,1,388,1,21101,233,0,0,1105,1,579,21101,1182,22,1,21101,244,0,0,1106,0,979,21101,0,401,1,21101,255,0,0,1105,1,579,21101,1182,33,1,21101,266,0,0,1106,0,979,21102,1,414,1,21102,1,277,0,1106,0,579,3,575,1008,575,89,570,1008,575,121,575,1,575,570,575,3,574,1008,574,10,570,1006,570,291,104,10,21102,1,1182,1,21101,0,313,0,1106,0,622,1005,575,327,1102,1,1,575,21101,327,0,0,1105,1,786,4,438,99,0,1,1,6,77,97,105,110,58,10,33,10,69,120,112,101,99,116,101,100,32,102,117,110,99,116,105,111,110,32,110,97,109,101,32,98,117,116,32,103,111,116,58,32,0,12,70,117,110,99,116,105,111,110,32,65,58,10,12,70,117,110,99,116,105,111,110,32,66,58,10,12,70,117,110,99,116,105,111,110,32,67,58,10,23,67,111,110,116,105,110,117,111,117,115,32,118,105,100,101,111,32,102,101,101,100,63,10,0,37,10,69,120,112,101,99,116,101,100,32,82,44,32,76,44,32,111,114,32,100,105,115,116,97,110,99,101,32,98,117,116,32,103,111,116,58,32,36,10,69,120,112,101,99,116,101,100,32,99,111,109,109,97,32,111,114,32,110,101,119,108,105,110,101,32,98,117,116,32,103,111,116,58,32,43,10,68,101,102,105,110,105,116,105,111,110,115,32,109,97,121,32,98,101,32,97,116,32,109,111,115,116,32,50,48,32,99,104,97,114,97,99,116,101,114,115,33,10,94,62,118,60,0,1,0,-1,-1,0,1,0,0,0,0,0,0,1,0,16,0,109,4,2102,1,-3,586,21002,0,1,-1,22101,1,-3,-3,21101,0,0,-2,2208,-2,-1,570,1005,570,617,2201,-3,-2,609,4,0,21201,-2,1,-2,1106,0,597,109,-4,2105,1,0,109,5,2101,0,-4,630,20102,1,0,-2,22101,1,-4,-4,21102,0,1,-3,2208,-3,-2,570,1005,570,781,2201,-4,-3,653,20102,1,0,-1,1208,-1,-4,570,1005,570,709,1208,-1,-5,570,1005,570,734,1207,-1,0,570,1005,570,759,1206,-1,774,1001,578,562,684,1,0,576,576,1001,578,566,692,1,0,577,577,21102,1,702,0,1106,0,786,21201,-1,-1,-1,1105,1,676,1001,578,1,578,1008,578,4,570,1006,570,724,1001,578,-4,578,21101,731,0,0,1105,1,786,1106,0,774,1001,578,-1,578,1008,578,-1,570,1006,570,749,1001,578,4,578,21102,756,1,0,1105,1,786,1106,0,774,21202,-1,-11,1,22101,1182,1,1,21102,1,774,0,1105,1,622,21201,-3,1,-3,1105,1,640,109,-5,2105,1,0,109,7,1005,575,802,21002,576,1,-6,21001,577,0,-5,1106,0,814,21102,1,0,-1,21101,0,0,-5,21102,1,0,-6,20208,-6,576,-2,208,-5,577,570,22002,570,-2,-2,21202,-5,49,-3,22201,-6,-3,-3,22101,1441,-3,-3,2101,0,-3,843,1005,0,863,21202,-2,42,-4,22101,46,-4,-4,1206,-2,924,21102,1,1,-1,1105,1,924,1205,-2,873,21102,1,35,-4,1105,1,924,2102,1,-3,878,1008,0,1,570,1006,570,916,1001,374,1,374,1202,-3,1,895,1101,0,2,0,2102,1,-3,902,1001,438,0,438,2202,-6,-5,570,1,570,374,570,1,570,438,438,1001,578,558,921,21002,0,1,-4,1006,575,959,204,-4,22101,1,-6,-6,1208,-6,49,570,1006,570,814,104,10,22101,1,-5,-5,1208,-5,47,570,1006,570,810,104,10,1206,-1,974,99,1206,-1,974,1101,0,1,575,21101,0,973,0,1106,0,786,99,109,-7,2105,1,0,109,6,21102,0,1,-4,21102,1,0,-3,203,-2,22101,1,-3,-3,21208,-2,82,-1,1205,-1,1030,21208,-2,76,-1,1205,-1,1037,21207,-2,48,-1,1205,-1,1124,22107,57,-2,-1,1205,-1,1124,21201,-2,-48,-2,1105,1,1041,21101,-4,0,-2,1106,0,1041,21102,1,-5,-2,21201,-4,1,-4,21207,-4,11,-1,1206,-1,1138,2201,-5,-4,1059,2102,1,-2,0,203,-2,22101,1,-3,-3,21207,-2,48,-1,1205,-1,1107,22107,57,-2,-1,1205,-1,1107,21201,-2,-48,-2,2201,-5,-4,1090,20102,10,0,-1,22201,-2,-1,-2,2201,-5,-4,1103,1201,-2,0,0,1106,0,1060,21208,-2,10,-1,1205,-1,1162,21208,-2,44,-1,1206,-1,1131,1105,1,989,21101,439,0,1,1106,0,1150,21102,477,1,1,1105,1,1150,21101,0,514,1,21101,1149,0,0,1105,1,579,99,21101,0,1157,0,1105,1,579,204,-2,104,10,99,21207,-3,22,-1,1206,-1,1138,1201,-5,0,1176,1202,-4,1,0,109,-6,2105,1,0,12,11,38,1,9,1,38,1,9,1,38,1,9,1,38,1,9,1,38,1,9,1,38,1,9,9,30,1,17,1,24,9,15,1,24,1,5,1,1,1,15,1,24,1,5,1,1,1,15,1,24,1,7,1,15,1,24,1,7,1,15,1,24,1,7,1,15,1,24,1,7,9,7,9,16,1,15,1,15,1,10,7,11,7,13,1,28,1,3,1,1,1,13,1,28,1,3,1,1,1,13,1,28,1,3,1,1,1,13,1,28,1,1,5,13,11,18,1,1,1,1,1,25,1,18,5,25,1,20,1,27,1,20,1,27,1,20,1,27,1,20,1,27,1,20,1,27,1,14,7,27,1,14,1,33,1,14,1,27,7,14,1,27,1,20,1,27,1,20,1,27,1,20,1,27,1,20,1,27,1,20,1,3,5,17,5,18,1,3,1,3,1,17,1,1,1,1,1,18,11,13,5,1,1,22,1,3,1,1,1,13,1,1,1,3,1,22,1,3,9,7,1,1,1,3,1,22,1,5,1,5,1,7,1,1,1,3,1,22,7,5,1,7,7,34,1,9,1,38,1,9,1,38,1,9,1,38,11,8`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);
  t.assert.equal(result.first, 8520);
  t.assert.equal(result.second, 926819);
});
