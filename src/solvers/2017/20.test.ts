import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./20";

test("2017.20", async (t) => {
  const input = `p=<-11104,1791,5208>, v=<-6,36,-84>, a=<19,-5,-4>
p=<5556,2862,7112>, v=<-6,-118,-35>, a=<-9,2,-10>
p=<133,-419,-5111>, v=<-4,-74,62>, a=<0,5,5>
p=<2870,3219,-3870>, v=<38,29,8>, a=<-7,-7,6>
p=<-936,-114,893>, v=<39,-23,-113>, a=<6,5,6>
p=<-984,1296,1337>, v=<43,-17,-33>, a=<6,-14,-12>
p=<-582,924,-1291>, v=<29,-12,95>, a=<3,-10,2>
p=<-72,-882,353>, v=<-72,28,-29>, a=<12,7,0>
p=<1230,-132,-205>, v=<-83,-54,76>, a=<-3,10,-9>
p=<840,-960,-415>, v=<-83,67,35>, a=<2,2,0>
p=<840,-961,-415>, v=<-83,67,35>, a=<2,2,0>
p=<840,-962,-415>, v=<-83,67,35>, a=<2,2,0>`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 9);
  t.assert.equal(result.second, 2);
});
