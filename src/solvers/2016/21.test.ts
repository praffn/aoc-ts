import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./21";

test("2016.21", async (t) => {
  const input = `reverse positions 1 through 6
rotate based on position of letter a
swap position 4 with position 1
reverse positions 1 through 5
move position 5 to position 7
swap position 4 with position 0
swap position 4 with position 6
rotate based on position of letter a
swap position 0 with position 2
move position 5 to position 2
move position 7 to position 1
swap letter d with letter c
swap position 5 with position 3
reverse positions 3 through 7
rotate based on position of letter d
swap position 7 with position 5
rotate based on position of letter f
swap position 4 with position 1
swap position 3 with position 6
reverse positions 4 through 7
rotate based on position of letter c
move position 0 to position 5
swap position 7 with position 4
rotate based on position of letter f
reverse positions 1 through 3
move position 5 to position 3
rotate based on position of letter g
reverse positions 2 through 5
rotate right 0 steps
rotate left 0 steps
swap letter f with letter b
rotate based on position of letter h
move position 1 to position 3
reverse positions 3 through 6
rotate based on position of letter h
swap position 4 with position 3
swap letter b with letter h
swap letter a with letter h
reverse positions 1 through 6
swap position 3 with position 6
swap letter e with letter d
swap letter e with letter h
swap position 1 with position 5
rotate based on position of letter a
reverse positions 4 through 5
swap position 0 with position 4
reverse positions 0 through 3
move position 7 to position 2
swap letter e with letter c
swap position 3 with position 4
rotate left 3 steps
rotate left 7 steps
rotate based on position of letter e
reverse positions 5 through 6
move position 1 to position 5
move position 1 to position 2
rotate left 1 step
move position 7 to position 6
rotate left 0 steps
reverse positions 5 through 6
reverse positions 3 through 7
swap letter d with letter e
rotate right 3 steps
swap position 2 with position 1
swap position 5 with position 7
swap letter h with letter d
swap letter c with letter d
rotate based on position of letter d
swap letter d with letter g
reverse positions 0 through 1
rotate right 0 steps
swap position 2 with position 3
rotate left 4 steps
rotate left 5 steps
move position 7 to position 0
rotate right 1 step
swap letter g with letter f
rotate based on position of letter a
rotate based on position of letter b
swap letter g with letter e
rotate right 4 steps
rotate based on position of letter h
reverse positions 3 through 5
swap letter h with letter e
swap letter g with letter a
rotate based on position of letter c
reverse positions 0 through 4
rotate based on position of letter e
reverse positions 4 through 7
rotate left 4 steps
swap position 0 with position 6
reverse positions 1 through 6
rotate left 2 steps
swap position 5 with position 3
swap letter b with letter d
swap letter b with letter d
rotate based on position of letter d
rotate based on position of letter c
rotate based on position of letter h
move position 4 to position 7`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "gfdhebac");
  t.assert.equal(result.second, "dhaegfbc");
});
