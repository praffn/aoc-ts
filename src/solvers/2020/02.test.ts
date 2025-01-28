import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./02";

test("2020.02", async (t) => {
  const input = `1-4 n: nnnnn
5-7 z: qhcgzzz
7-11 m: mmmmmmsmmmmm
5-8 d: ldddtdgnzddddwl
16-18 q: qsqqqqqqqqqpqqqlqhq
5-7 s: bwkbdlwns
14-17 v: vvvvvvvvvvvvvpvvxv
4-5 v: mvkvvn
2-5 h: lcwghhkpkxvzkvrmxrv
2-9 m: kmdvdlvxmhgsmlzp
3-14 t: twtblftnmmxttsdcm
7-19 f: cmshsffhcvdvzlgfbhnf`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 6);
  t.assert.equal(result.second, 4);
});
