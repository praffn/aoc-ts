export interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function makeVec3(n: number): Vec3;
export function makeVec3(x: number, y: number, z: number): Vec3;
export function makeVec3(x: number, y?: number, z?: number): Vec3 {
  return { x, y: y ?? x, z: z ?? x };
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return makeVec3(a.x + b.x, a.y + b.y, a.z + b.z);
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return makeVec3(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function abs(a: Vec3): Vec3 {
  return makeVec3(Math.abs(a.x), Math.abs(a.y), Math.abs(a.z));
}

export function scale(a: Vec3, s: number): Vec3 {
  return makeVec3(a.x * s, a.y * s, a.z * s);
}

export function equals(a: Vec3, b: Vec3): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

export function magnitude(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export const zero = makeVec3(0);

export function manhattan(v: Vec3): number;
export function manhattan(v: Vec3, w: Vec3): number;
export function manhattan(v: Vec3, w = zero): number {
  return Math.abs(v.x - w.x) + Math.abs(v.y - w.y) + Math.abs(v.z - w.z);
}

export function key(v: Vec3): string {
  return `${v.x},${v.y},${v.z}`;
}
