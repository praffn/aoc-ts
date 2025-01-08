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

export function scale(a: Vec2, f: number): Vec2 {
  return makeVec2(a.x * f, a.y * f);
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

export const directions = {
  north: makeVec2(0, -1),
  south: makeVec2(0, 1),
  west: makeVec2(-1, 0),
  east: makeVec2(1, 0),
  northeast: makeVec2(1, -1),
  southeast: makeVec2(1, 1),
  northwest: makeVec2(-1, -1),
  southwest: makeVec2(-1, 1),
} as const;
