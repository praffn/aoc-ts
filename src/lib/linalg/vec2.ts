export interface Vec2 {
  x: number;
  y: number;
}

export function makeVec2(n: number): Vec2;
export function makeVec2(x: number, y: number): Vec2;
export function makeVec2(x: number, y?: number): Vec2 {
  return { x, y: y ?? x };
}

export function add(a: Vec2, b: Vec2): Vec2 {
  return makeVec2(a.x + b.x, a.y + b.y);
}

export function sub(a: Vec2, b: Vec2): Vec2 {
  return makeVec2(a.x - b.x, a.y - b.y);
}

export function equals(a: Vec2, b: Vec2): boolean {
  return a.x === b.x && a.y === b.y;
}

export function key(v: Vec2): string {
  return `${v.x},${v.y}`;
}

export function manhattan(a: Vec2, b: Vec2): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}
