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

export function equals(a: Vec3, b: Vec3): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z;
}

export function magnitude(v: Vec3): number {
  return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
}

export function manhattan(v: Vec3): number {
  return Math.abs(v.x) + Math.abs(v.y) + Math.abs(v.z);
}

export function key(v: Vec3): string {
  return `${v.x},${v.y},${v.z}`;
}
