export interface Vec4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export function makeVec4(n: number): Vec4;
export function makeVec4(x: number, y: number, z: number, w: number): Vec4;
export function makeVec4(x: number, y?: number, z?: number, w?: number): Vec4 {
  return { x, y: y ?? x, z: z ?? x, w: w ?? x };
}

export function add(a: Vec4, b: Vec4): Vec4 {
  return makeVec4(a.x + b.x, a.y + b.y, a.z + b.z, a.w + b.w);
}

export function sub(a: Vec4, b: Vec4): Vec4 {
  return makeVec4(a.x - b.x, a.y - b.y, a.z - b.z, a.w - b.w);
}

export function equals(a: Vec4, b: Vec4): boolean {
  return a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w;
}

export const zero = makeVec4(0);

export function key(v: Vec4): string {
  return `${v.x},${v.y},${v.z},${v.w}`;
}

export function generateAllDirectionalOffsets() {
  return [
    makeVec4(-1, -1, -1, -1),
    makeVec4(-1, -1, -1, 0),
    makeVec4(-1, -1, -1, 1),
    makeVec4(-1, -1, 0, -1),
    makeVec4(-1, -1, 0, 0),
    makeVec4(-1, -1, 0, 1),
    makeVec4(-1, -1, 1, -1),
    makeVec4(-1, -1, 1, 0),
    makeVec4(-1, -1, 1, 1),
    makeVec4(-1, 0, -1, -1),
    makeVec4(-1, 0, -1, 0),
    makeVec4(-1, 0, -1, 1),
    makeVec4(-1, 0, 0, -1),
    makeVec4(-1, 0, 0, 0),
    makeVec4(-1, 0, 0, 1),
    makeVec4(-1, 0, 1, -1),
    makeVec4(-1, 0, 1, 0),
    makeVec4(-1, 0, 1, 1),
    makeVec4(-1, 1, -1, -1),
    makeVec4(-1, 1, -1, 0),
    makeVec4(-1, 1, -1, 1),
    makeVec4(-1, 1, 0, -1),
    makeVec4(-1, 1, 0, 0),
    makeVec4(-1, 1, 0, 1),
    makeVec4(-1, 1, 1, -1),
    makeVec4(-1, 1, 1, 0),
    makeVec4(-1, 1, 1, 1),
    makeVec4(0, -1, -1, -1),
    makeVec4(0, -1, -1, 0),
    makeVec4(0, -1, -1, 1),
    makeVec4(0, -1, 0, -1),
    makeVec4(0, -1, 0, 0),
    makeVec4(0, -1, 0, 1),
    makeVec4(0, -1, 1, -1),
    makeVec4(0, -1, 1, 0),
    makeVec4(0, -1, 1, 1),
    makeVec4(0, 0, -1, -1),
    makeVec4(0, 0, -1, 0),
    makeVec4(0, 0, -1, 1),
    makeVec4(0, 0, 0, -1),
    makeVec4(0, 0, 0, 1),
    makeVec4(0, 0, 1, -1),
    makeVec4(0, 0, 1, 0),
    makeVec4(0, 0, 1, 1),
    makeVec4(0, 1, -1, -1),
    makeVec4(0, 1, -1, 0),
    makeVec4(0, 1, -1, 1),
    makeVec4(0, 1, 0, -1),
    makeVec4(0, 1, 0, 0),
    makeVec4(0, 1, 0, 1),
    makeVec4(0, 1, 1, -1),
    makeVec4(0, 1, 1, 0),
    makeVec4(0, 1, 1, 1),
    makeVec4(1, -1, -1, -1),
    makeVec4(1, -1, -1, 0),
    makeVec4(1, -1, -1, 1),
    makeVec4(1, -1, 0, -1),
    makeVec4(1, -1, 0, 0),
    makeVec4(1, -1, 0, 1),
    makeVec4(1, -1, 1, -1),
    makeVec4(1, -1, 1, 0),
    makeVec4(1, -1, 1, 1),
    makeVec4(1, 0, -1, -1),
    makeVec4(1, 0, -1, 0),
    makeVec4(1, 0, -1, 1),
    makeVec4(1, 0, 0, -1),
    makeVec4(1, 0, 0, 0),
    makeVec4(1, 0, 0, 1),
    makeVec4(1, 0, 1, -1),
    makeVec4(1, 0, 1, 0),
    makeVec4(1, 0, 1, 1),
    makeVec4(1, 1, -1, -1),
    makeVec4(1, 1, -1, 0),
    makeVec4(1, 1, -1, 1),
    makeVec4(1, 1, 0, -1),
    makeVec4(1, 1, 0, 0),
    makeVec4(1, 1, 0, 1),
    makeVec4(1, 1, 1, -1),
    makeVec4(1, 1, 1, 0),
    makeVec4(1, 1, 1, 1),
  ];
}
