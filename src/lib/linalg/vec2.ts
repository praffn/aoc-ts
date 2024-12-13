export type Vec2 = [number, number];

export function makeVec2(n: number): Vec2;
export function makeVec2(x: number, y: number): Vec2;
export function makeVec2(x: number, y?: number): Vec2 {
  return [x, y ?? x];
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return [a[0] + b[0], a[1] + b[1]];
}

export function equals(a: Vec2, b: Vec2): boolean {
  return a[0] === b[0] && a[1] === b[1];
}
