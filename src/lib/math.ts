export function mod(a: number, b: number) {
  return ((a % b) + b) % b;
}

export function gcd(a: number, b: number) {
  // iterative was waaaay faster than recursive

  let tmp;
  while (b !== 0) {
    tmp = b;
    b = a % b;
    a = tmp;
  }

  return a;
}
