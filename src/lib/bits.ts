export function bitSet(n: number, i: number): number {
  return n | (1 << i);
}

export function bitClear(n: number, i: number): number {
  return n & ~(1 << i);
}

export function bitToggle(n: number, i: number): number {
  return n ^ (1 << i);
}

export function bitUpdate(n: number, i: number, on: boolean | number): number {
  return on ? bitSet(n, i) : bitClear(n, i);
}

export function bitGet(n: number, i: number): boolean {
  return (n & (1 << i)) !== 0;
}

export function popcount(n: number): number {
  n = n - ((n >> 1) & 0x55555555);
  n = (n & 0x33333333) + ((n >> 2) & 0x33333333);
  return (((n + (n >> 4)) & 0xf0f0f0f) * 0x1010101) >> 24;
}
