import { range } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

function reverse(arr: Array<unknown>, start: number, length: number) {
  let end = start + length - 1;
  while (start < end) {
    const temp = arr[start % arr.length];
    arr[start % arr.length] = arr[end % arr.length];
    arr[end % arr.length] = temp;
    start++;
    end--;
  }
}

function hash(list: Array<number>, inp: Array<number>, i = 0, skip = 0) {
  for (const input of inp) {
    reverse(list, i, input);
    i += input + skip;
    skip++;
  }

  return { i, skip };
}

function knotHash(input: Array<number>, instructions: Array<number>) {
  // first hash 64 times
  let m = { i: 0, skip: 0 };
  for (const _ of range(64)) {
    m = hash(input, instructions, m.i, m.skip);
  }

  // now reduce to dense hash
  const dense = [];
  for (const i of range(16)) {
    let v = 0;
    for (const j of range(16)) {
      v ^= input[i * 16 + j];
    }
    dense.push(v);
  }

  // and return hexadecimal string
  return dense.map((n) => n.toString(16).padStart(2, "0")).join("");
}

export default createSolverWithString(async (input) => {
  const inputA = input.split(",").map((n) => Number.parseInt(n, 10));
  const inputB = input
    .split("")
    .map((s) => s.charCodeAt(0))
    .concat([17, 31, 73, 47, 23]);
  const listA = Array.from({ length: 256 }, (_, i) => i);
  const listB = listA.slice();

  hash(listA, inputA);
  const first = listA[0] * listA[1];

  return {
    first,
    second: knotHash(listB, inputB),
  };
});
