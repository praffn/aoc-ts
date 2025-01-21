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

export function lcm(a: number, b: number) {
  a = Math.abs(a);
  b = Math.abs(b);
  if (a > b) {
    return (a / gcd(a, b)) * b;
  }
  return (b / gcd(b, a)) * a;
}
