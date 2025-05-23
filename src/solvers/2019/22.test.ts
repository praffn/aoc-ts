import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./22";

test("2019.22", async (t) => {
  const input = `deal into new stack
deal with increment 25
cut -5919
deal with increment 56
deal into new stack
deal with increment 20
deal into new stack
deal with increment 53
cut 3262
deal with increment 63
cut 3298
deal into new stack
cut -4753
deal with increment 57
deal into new stack
cut 9882
deal with increment 42
deal into new stack
deal with increment 40
cut 2630
deal with increment 32
cut 1393
deal with increment 74
cut 2724
deal with increment 23
cut -3747
deal into new stack
cut 864
deal with increment 61
deal into new stack
cut -4200
deal with increment 72
cut -7634
deal with increment 32
deal into new stack
cut 6793
deal with increment 38
cut 7167
deal with increment 10
cut -9724
deal into new stack
cut 6047
deal with increment 37
cut 7947
deal with increment 63
deal into new stack
deal with increment 9
cut -9399
deal with increment 26
cut 1154
deal with increment 74
deal into new stack
cut 3670
deal with increment 45
cut 3109
deal with increment 64
cut -7956
deal with increment 39
deal into new stack
deal with increment 61
cut -9763
deal with increment 20
cut 4580
deal with increment 30
deal into new stack
deal with increment 62
deal into new stack
cut -997
deal with increment 54
cut -1085
deal into new stack
cut -9264
deal into new stack
deal with increment 11
cut 6041
deal with increment 9
deal into new stack
cut 5795
deal with increment 26
cut 5980
deal with increment 38
cut 1962
deal with increment 25
cut -565
deal with increment 45
cut 9490
deal with increment 21
cut -3936
deal with increment 64
deal into new stack
cut -7067
deal with increment 75
cut -3975
deal with increment 29
deal into new stack
cut -7770
deal into new stack
deal with increment 12
cut 8647
deal with increment 49`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, 5472);
  t.assert.equal(result.second, 64586600795606n);
});
