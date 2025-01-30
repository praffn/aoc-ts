export function abs(n: bigint): bigint {
  return n < 0n ? -n : n;
}

export function mod(a: bigint, b: bigint): bigint {
  return ((a % b) + b) % b;
}

export function gcd(a: bigint, b: bigint) {
  // iterative was waaaay faster than recursive
  let tmp;
  while (b !== 0n) {
    tmp = b;
    b = a % b;
    a = tmp;
  }

  return a;
}

export function lcm(a: bigint, b: bigint) {
  a = abs(a);
  b = abs(b);
  if (a > b) {
    return (a / gcd(a, b)) * b;
  }
  return (b / gcd(b, a)) * a;
}

export function invmod(a: bigint, m: bigint): bigint {
  a = mod(a, m);
  for (let x = 1n; x < m; x++) {
    if (mod(a * x, m) === 1n) {
      return x;
    }
  }
  return -1n;
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
