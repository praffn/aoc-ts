export function mod(a: number, b: number): number {
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

export function invmod(a: number, m: number): number {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) {
      return x;
    }
  }
  return -1;
}

export function modexp(base: number, exp: number, mod: number): number {
  if (mod === 1) return 0;
  let result = 1;
  base = ((base % mod) + mod) % mod;
  while (exp > 0) {
    if (exp % 2 === 1) {
      result = (result * base) % mod;
    }
    base = (base * base) % mod;
    exp = Math.floor(exp / 2);
  }

  return result;
}

export function divmod(
  a: number,
  b: number
): [quotient: number, remainder: number] {
  return [Math.floor(a / b), mod(a, b)];
}

export function digitConcat(a: number, b: number): number;
export function digitConcat(a: number, b: number, base: number): number;
export function digitConcat(a: number, b: number, base = 10): number {
  let m = base;
  while (m <= b) {
    m *= base;
  }

  return a * m + b;
}
