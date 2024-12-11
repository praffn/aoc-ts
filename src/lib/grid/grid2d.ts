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

    let fillFn = fill
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

  set(x: number, y: number, value: T) {
    this.#items[y * this.width + x] = value;
  }

  isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  *neighbors(
    x: number,
    y: number
  ): Generator<[value: T, x: number, y: number]> {
    for (let i = 0; i < 4; i++) {
      const [dx, dy] = DIRECTIONS[i];
      const nx = x + dx;
      const ny = y + dy;

      if (this.isValidPosition(nx, ny)) {
        yield [this.at(nx, ny), nx, ny];
      }
    }
  }

  *neighborsWithDiagonals(
    x: number,
    y: number
  ): Generator<[value: T, x: number, y: number]> {
    for (let i = 0; i < 8; i++) {
      const [dx, dy] = DIRECTIONS[i];
      const nx = x + dx;
      const ny = y + dy;

      if (this.isValidPosition(nx, ny)) {
        yield [this.at(nx, ny), nx, ny];
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

  print(this: Grid2D<string>): string;
  print(this: Grid2D<number>): string;
  print<T>(this: Grid2D<T>, formatter: (value: T) => string): string;
  print<T>(this: Grid2D<T>, formatter?: (value: T) => string) {
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
}