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

export function lte(a: Vec3, b: Vec3): boolean {
  return a.x <= b.x && a.y <= b.y && a.z <= b.z;
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

export function hashKey(v: Vec3) {
  return ((v.x * 73856093) ^ (v.y * 19349663) ^ (v.z * 83492791)) >>> 0;
}

export function clamp(v: Vec3, min: Vec3, max: Vec3): Vec3;
export function clamp(v: Vec3, min: number, max: number): Vec3;
export function clamp(v: Vec3, min: Vec3 | number, max: Vec3 | number): Vec3 {
  if (typeof min === "number") {
    return makeVec3(
      Math.max(min, Math.min(max as number, v.x)),
      Math.max(min, Math.min(max as number, v.y)),
      Math.max(min, Math.min(max as number, v.z))
    );
  }

  return makeVec3(
    Math.max(min.x, Math.min((max as Vec3).x, v.x)),
    Math.max(min.y, Math.min((max as Vec3).y, v.y)),
    Math.max(min.z, Math.min((max as Vec3).z, v.z))
  );
}

export function max(v: Vec3, w: Vec3): Vec3;
export function max(v: Vec3, max: number): Vec3;
export function max(v: Vec3, w: Vec3 | number): Vec3 {
  if (typeof w === "number") {
    return makeVec3(Math.max(v.x, w), Math.max(v.y, w), Math.max(v.z, w));
  }

  return makeVec3(Math.max(v.x, w.x), Math.max(v.y, w.y), Math.max(v.z, w.z));
}

export function min(v: Vec3, w: Vec3): Vec3;
export function min(v: Vec3, min: number): Vec3;
export function min(v: Vec3, w: Vec3 | number): Vec3 {
  if (typeof w === "number") {
    return makeVec3(Math.min(v.x, w), Math.min(v.y, w), Math.min(v.z, w));
  }

  return makeVec3(Math.min(v.x, w.x), Math.min(v.y, w.y), Math.min(v.z, w.z));
}

export function leq(a: Vec3, b: Vec3): boolean {
  return a.x <= b.x && a.y <= b.y && a.z <= b.z;
}

export function generateAllDirectionalOffsets() {
  return [
    makeVec3(-1, -1, -1),
    makeVec3(-1, -1, 0),
    makeVec3(-1, -1, 1),
    makeVec3(-1, 0, -1),
    makeVec3(-1, 0, 0),
    makeVec3(-1, 0, 1),
    makeVec3(-1, 1, -1),
    makeVec3(-1, 1, 0),
    makeVec3(-1, 1, 1),
    makeVec3(0, -1, -1),
    makeVec3(0, -1, 0),
    makeVec3(0, -1, 1),
    makeVec3(0, 0, -1),
    makeVec3(0, 0, 1),
    makeVec3(0, 1, -1),
    makeVec3(0, 1, 0),
    makeVec3(0, 1, 1),
    makeVec3(1, -1, -1),
    makeVec3(1, -1, 0),
    makeVec3(1, -1, 1),
    makeVec3(1, 0, -1),
    makeVec3(1, 0, 0),
    makeVec3(1, 0, 1),
    makeVec3(1, 1, -1),
    makeVec3(1, 1, 0),
    makeVec3(1, 1, 1),
  ];
}
