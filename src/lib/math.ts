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

export function invmod(a: number, m: number) {
  a = mod(a, m);
  for (let x = 1; x < m; x++) {
    if (mod(a * x, m) === 1) {
      return x;
    }
  }
  return -1;
}

export function modexp(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod === 1n) return 0n;
  let result = 1n;
  base = ((base % mod) + mod) % mod;
  while (exp > 0n) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    base = (base * base) % mod;
    exp /= 2n;
  }

  return result;
}
