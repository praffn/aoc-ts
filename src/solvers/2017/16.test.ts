import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./16";

test("2017.16", async (t) => {
  const input = `s9,x0/5,s3,x6/12,s7,x8/4,pd/o,x5/12,s11,x1/4,s2,x11/6,pa/g,s15,x14/2,s7,x13/7,pk/n,x5/4,s5,x8/11,pc/g,x2/1,s12,x3/13,s4,x4/2,pf/d,x13/15,s14,x3/5,s1,x2/9,pi/h,x14/4,s8,x1/11,pk/p,s8,x7/2,s8,x10/9,pl/f,x15/5,s8,pc/k,x10/7,s14,x15/2,pi/h,x7/10,pp/f,x11/14,pi/b,x7/4,pp/h,x15/14,s9,x8/13,pg/d,x9/11,s12,x12/14,s2,x15/2,pb/c,x0/7,ph/m,x8/12,s14,x2/4,pc/n,x14/6,s14,x13/7,s9,x2/0,pm/b,x10/13,s7,x2/4,pf/c,x3/8,pg/a,s13,x5/15,s4,x7/12,s9,x6/11,s3,x1/15,s4,x0/7,pn/e,x3/14,s14,x2/10,pb/f,x9/3,s7,x15/4,pi/o,x13/5,s11,x8/14,pc/f,x1/11,s12,x13/15,s7,pb/n,x14/12,s8,x1/13,s1,x15/14,s6,x1/11,pe/k,x7/6,s6,x13/1,s12,x3/7,po/b,x0/13,pc/g,x11/12,s10,pp/j,s3,x0/6,s2,pm/o,x7/4,s15,x11/15,s1,x14/8,s2,x10/1,pg/j,x3/13,s11,x11/0,s8,x2/13,s1,ph/a,x14/3,pp/g,x11/12,s13,x3/6,pe/f,x11/9,s7,x3/2,pb/a,s6,x9/4,ph/e,x2/14,s1,x0/4,s10,x14/2,s12,x11/6,s13,x3/10,pf/i,x7/11,pg/m,x12/5,s9,x14/3,pn/o,x15/2,s14,x9/0,ph/d,s6,x14/1,pk/j,s11,x4/9,s14,x3/7,s13,x2/11,s6,x0/5,pn/i,x7/3,s12,x13/1,s9,x9/12,s1,x8/15,s4,x0/13,s1,x7/1,pj/b,x13/3,s13,x14/9,s11,x7/0,s1,x10/12,po/k,s4,x9/13,s8,x10/14,pc/f,x0/8,s10,x13/2,s14,x14/10,s5,x8/12,s3,x15/13,s3,x11/0,pj/n,x2/9,s8,x15/14,pg/m,x13/10,s10,x5/6,s2,po/h,s10,x9/7,s13,x13/12`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "biocfldhjmaeknpg");
  t.assert.equal(result.second, "lofgbipnchkmajed");
});
