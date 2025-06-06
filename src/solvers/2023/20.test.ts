import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./20";

test("2023.20", async (t) => {
  const input = `%jb -> fz
%xz -> ck, bg
%xm -> qt, cs
%df -> hc, lq
%mt -> sx
%fr -> ks, hc
%tn -> pf
%gt -> pp, kb
%jn -> ck, nz
%td -> kz
&rd -> vd
%pp -> gv, kb
&qt -> jb, vx, bt, gh, td, gb
%ms -> xz
%vx -> fp
%rb -> ck, mt
%nz -> hh
%fp -> rp, qt
%gd -> gc
%gv -> kb
%nl -> cc, hc
%cs -> qt
%kz -> jb, qt
%vg -> fr, hc
%zq -> qt, xm
%pv -> ps
&bt -> vd
%ps -> kb, rf
%hh -> ck, ms
broadcaster -> gn, gb, rb, df
%gh -> td
%rf -> kb, nm
%rp -> qt, gh
%gc -> kb, pv
%gb -> vx, qt
%rq -> ck, ts
%nm -> gt
%gn -> kb, tn
&ck -> nz, fv, rb, sx, ms, mt
&fv -> vd
%cc -> vg
%bg -> ck, rq
&hc -> qr, ch, df, dj, cc, rd
%qr -> dj
%gq -> hc, ch
&pr -> vd
%ks -> lc, hc
%dj -> nl
%fz -> qt, zq
%lq -> gq, hc
&kb -> pv, pr, tn, nm, pf, gn, gd
%ts -> ck
%lc -> hc
%jl -> ck, jn
%sx -> jl
%pf -> gd
&vd -> rx
%ch -> qr`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 788848550);
  t.assert.equal(result.second, 228300182686739);
});
