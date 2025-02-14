export interface Vec2 {
  x: number;
  y: number;
}

export const zero = makeVec2(0);

export function makeVec2(n: number): Vec2;
export function makeVec2(x: number, y: number): Vec2;
export function makeVec2(x: number, y?: number): Vec2 {
  return { x, y: y ?? x };
}

export function lexicographicalCompare(a: Vec2, b: Vec2): number {
  if (a.x === b.x) {
    return a.y - b.y;
  }

  return a.x - b.x;
}

export function reverseLexicographicalCompare(a: Vec2, b: Vec2): number {
  if (a.y === b.y) {
    return a.x - b.x;
  }

  return a.y - b.y;
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

export function mod(a: Vec2, m: Vec2): Vec2 {
  return makeVec2(a.x % m.x, a.y % m.y);
}

export function equals(a: Vec2, b: Vec2): boolean {
  return a.x === b.x && a.y === b.y;
}

export function key(v: Vec2): string {
  return `${v.x},${v.y}`;
}

export function unkey(s: string): Vec2 {
  const [x, y] = s.split(",").map((n) => Number.parseInt(n));
  return makeVec2(x, y);
}

export function manhattan(v: Vec2): number;
export function manhattan(a: Vec2, b: Vec2): number;
export function manhattan(a: Vec2, b = zero): number {
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

export const cardinalDirections = [
  directions.north,
  directions.south,
  directions.west,
  directions.east,
];

export const ordinalDirections = [
  directions.northeast,
  directions.southeast,
  directions.northwest,
  directions.southwest,
];

export const allDirections = [
  directions.north,
  directions.south,
  directions.west,
  directions.east,
  directions.northeast,
  directions.southeast,
  directions.northwest,
  directions.southwest,
];
