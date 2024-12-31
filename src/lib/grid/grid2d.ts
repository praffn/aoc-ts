import type { Vec2 } from "../linalg/vec2";

const DIRECTIONS = [
  // top, right, bottom, left
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
  // diagonals
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, -1],
];

export interface TraversalConfig<T> {
  allowDiagonals?: boolean;
  predicate?: (value: T, x: number, y: number) => boolean;
  getNeighbors?: (x: number, y: number) => Iterable<{ x: number; y: number }>;
}

export class Grid2D<T> {
  readonly #items: Array<T>;
  readonly width: number;
  readonly height: number;

  constructor(width: number, height: number);
  constructor(
    width: number,
    height: number,
    fillFn: (x: number, y: number) => T
  );
  constructor(
    width: number,
    height: number,
    fill: T extends Function ? never : T
  );
  constructor(
    width: number,
    height: number,
    fill?: T | ((x: number, y: number) => T)
  ) {
    this.width = width;
    this.height = height;

    let fillFn =
      fill !== undefined
        ? typeof fill === "function"
          ? (_: number, i: number) =>
              (fill as any)(Math.floor(i % width), Math.floor(i / width))
          : () => fill
        : undefined;

    this.#items = Array.from({ length: width * height }, fillFn as any);
  }

  at(x: number, y: number): T {
    return this.#items[y * this.width + x];
  }

  atVector({ x, y }: Vec2) {
    return this.at(x, y);
  }

  set(x: number, y: number, value: T) {
    this.#items[y * this.width + x] = value;
  }

  fillRect(x: number, y: number, w: number, h: number, value: T) {
    for (let dy = 0; dy < h; dy++) {
      for (let dx = 0; dx < w; dx++) {
        if (!this.isValidPosition(x + dx, y + dy)) {
          continue;
        }
        this.set(x + dx, y + dy, value);
      }
    }
  }

  findPosition(predicate: (value: T) => boolean): [number, number] | null {
    for (let i = 0; i < this.#items.length; i++) {
      if (predicate(this.#items[i])) {
        return [i % this.width, Math.floor(i / this.width)];
      }
    }

    return null;
  }

  findPositionVector(
    predicate: (value: T, x: number, y: number) => boolean
  ): Vec2 | null {
    for (let i = 0; i < this.#items.length; i++) {
      const x = i % this.width;
      const y = Math.floor(i / this.width);
      if (predicate(this.#items[i], x, y)) {
        return { x, y };
      }
    }

    return null;
  }

  *findAllPositions(
    predicate: (value: T) => boolean
  ): Generator<[number, number]> {
    for (let i = 0; i < this.#items.length; i++) {
      if (predicate(this.#items[i])) {
        yield [i % this.width, Math.floor(i / this.width)];
      }
    }
  }

  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  *neighbors(
    x: number,
    y: number,
    predicate?: (value: T) => boolean
  ): Iterable<{ value: T; x: number; y: number }> {
    for (let i = 0; i < 4; i++) {
      const [dx, dy] = DIRECTIONS[i];
      const nx = x + dx;
      const ny = y + dy;

      if (this.isValidPosition(nx, ny)) {
        const neighborValue = this.at(nx, ny);
        if (predicate === undefined || predicate(neighborValue)) {
          yield { value: neighborValue, x: nx, y: ny };
        }
      }
    }
  }

  *neighborsWithDiagonals(
    x: number,
    y: number
  ): Iterable<{ value: T; x: number; y: number }> {
    for (let i = 0; i < 8; i++) {
      const [dx, dy] = DIRECTIONS[i];
      const nx = x + dx;
      const ny = y + dy;

      if (this.isValidPosition(nx, ny)) {
        yield { value: this.at(nx, ny), x: nx, y: ny };
      }
    }
  }

  [Symbol.iterator](): Iterator<[value: T, x: number, y: number]> {
    return this.#items[Symbol.iterator]().map((value, index) => {
      const x = index % this.width;
      const y = Math.floor(index / this.width);
      return [value, x, y];
    });
  }

  values(): Iterable<T> {
    return this.#items.values();
  }

  static fromLines<T = string>(lines: Array<string>): Grid2D<T>;
  static fromLines<T>(
    lines: Array<string>,
    formatter: (line: string) => T
  ): Grid2D<T>;
  static fromLines<T>(
    lines: Array<string>,
    formatter?: (line: string) => Array<T>
  ): Grid2D<T> {
    return Grid2D.from2DArray(
      lines.map((line) => {
        return formatter ? formatter(line) : (line.split("") as Array<T>);
      })
    );
  }

  static from2DArray<T>(arr: Array<Array<T>>): Grid2D<T> {
    const height = arr.length;
    const width = arr[0].length;
    const grid = new Grid2D<T>(width, height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid.#items[y * width + x] = arr[y][x];
      }
    }

    return grid;
  }

  toString(this: Grid2D<string>): string;
  toString(this: Grid2D<number>): string;
  toString<T>(this: Grid2D<T>, formatter: (value: T) => string): string;
  toString<T>(this: Grid2D<T>, formatter?: (value: T) => string) {
    formatter ??= (value) => String(value);

    const rows: Array<string> = [];
    for (let y = 0; y < this.height; y++) {
      let row = "";
      for (let x = 0; x < this.width; x++) {
        row += formatter(this.at(x, y));
      }
      rows.push(row);
    }

    return rows.join("\n");
  }

  column(x: number): Generator<T>;
  column(x: number, skip: number): Generator<T>;
  *column(x: number, skip = 0) {
    for (let y = skip; y < this.height; y++) {
      yield this.at(x, y);
    }
  }

  row(y: number): Generator<T>;
  row(y: number, skip: number): Generator<T>;
  *row(y: number, skip = 0) {
    for (let x = skip; x < this.width; x++) {
      yield this.at(x, y);
    }
  }

  count(predicate: (value: T, x: number, y: number) => boolean): number {
    return this.#items.filter((value, index) => {
      const x = index % this.width;
      const y = Math.floor(index / this.width);
      return predicate(value, x, y);
    }).length;
  }

  *dfs(
    x: number,
    y: number,
    config: Partial<TraversalConfig<T>> = {}
  ): Iterable<[value: T, x: number, y: number]> {
    const visited = new Set<number>();
    const stack = [[x, y]];
    const startValue = this.at(x, y);

    const predicate = config.predicate ?? ((value) => value === startValue);
    const getNeighbors =
      config.getNeighbors ??
      (config.allowDiagonals
        ? this.neighborsWithDiagonals.bind(this)
        : this.neighbors.bind(this));

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      const index = y * this.width + x;

      if (visited.has(index)) {
        continue;
      }

      visited.add(index);
      if (!predicate(this.at(x, y), x, y)) {
        continue;
      }

      yield [this.at(x, y), x, y];

      for (const { x: nx, y: ny } of getNeighbors(x, y)) {
        if (visited.has(ny * this.width + nx)) {
          continue;
        }

        stack.push([nx, ny]);
      }
    }
  }

  regions(): Generator<Array<[x: number, y: number, neighbors: number]>>;
  regions(
    predicate: (v: T) => boolean
  ): Generator<Array<[x: number, y: number, neighbors: number]>>;
  *regions(
    predicate?: (v: T) => boolean
  ): Generator<Array<[x: number, y: number, neighbors: number]>> {
    const visited = new Set<number>();

    const floodFill = (index: number) => {
      const stack = [index];
      const region: Array<[number, number, number]> = [];
      const searchValue = this.#items[index];

      while (stack.length > 0) {
        const current = stack.pop()!;
        if (visited.has(current)) {
          continue;
        }

        visited.add(current);
        const x = current % this.width;
        const y = Math.floor(current / this.width);
        let neighborCount = 0;

        for (const { value, x: nx, y: ny } of this.neighbors(x, y)) {
          if (predicate) {
            if (!predicate(value)) {
              continue;
            }
          } else if (value !== searchValue) {
            continue;
          }

          neighborCount++;
          stack.push(ny * this.width + nx);
        }

        region.push([x, y, neighborCount]);
      }

      return region;
    };

    for (let i = 0; i < this.#items.length; i++) {
      if (visited.has(i)) {
        continue;
      }

      if (predicate && !predicate(this.#items[i])) {
        continue;
      }

      yield floodFill(i);
    }
  }
}
