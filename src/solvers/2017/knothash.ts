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

export function knot(list: Array<number>, inp: Array<number>, i = 0, skip = 0) {
  for (const input of inp) {
    reverse(list, i, input);
    i += input + skip;
    skip++;
  }

  return { i, skip };
}

export function knothash(key: string) {
  const ring = Array.from({ length: 256 }, (_, i) => i);
  const instructions = key
    .split("")
    .map((c) => c.charCodeAt(0))
    .concat([17, 31, 73, 47, 23]);

  let i = 0;
  let skip = 0;

  for (let _ = 0; _ < 64; _++) {
    const r = knot(ring, instructions, i, skip);
    i = r.i;
    skip = r.skip;
  }

  // now reduce to dense hash
  const dense = [];
  for (let i = 0; i < 16; i++) {
    let v = 0;
    for (let j = 0; j < 16; j++) {
      v ^= ring[i * 16 + j];
    }
    dense.push(v);
  }

  // and return hexadecimal string
  return dense.map((n) => n.toString(16).padStart(2, "0")).join("");
}
