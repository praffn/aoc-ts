export class Array2D<T> {
  #data: Array<T>;
  #width: number;
  #height: number;

  constructor(size: number);
  constructor(width: number, height: number);
  constructor(data: Array<Array<T>>);
  constructor(width: number, rawData: Array<T>);
  constructor(
    widthOrData: number | Array<Array<T>>,
    heightOrRawData?: number | Array<T>
  ) {
    // case constructor(size: number);
    if (
      typeof widthOrData === "number" &&
      typeof heightOrRawData === "undefined"
    ) {
      this.#width = widthOrData;
      this.#height = widthOrData;
      this.#data = new Array(widthOrData ** 2);
      return;
    }
    // constructor(width: number, height: number);
    if (
      typeof widthOrData === "number" &&
      typeof heightOrRawData === "number"
    ) {
      this.#width = widthOrData;
      this.#height = heightOrRawData;
      this.#data = new Array(widthOrData * heightOrRawData);
      return;
    }
    // case constructor(data: Array<Array<T>>);
    if (Array.isArray(widthOrData)) {
      this.#height = widthOrData.length;
      this.#width = widthOrData[0].length;
      this.#data = widthOrData.flat();
      return;
    }
    // constructor(width: number, rawData: Array<T>);
    if (typeof widthOrData === "number" && Array.isArray(heightOrRawData)) {
      this.#width = widthOrData;
      this.#height = heightOrRawData.length / widthOrData;
      this.#data = heightOrRawData.slice();
      return;
    }

    throw new Error("Invalid constructor arguments");
  }

  /**
   * Returns the flat array index for the given coordinates
   */
  #index(x: number, y: number) {
    return y * this.#width + x;
  }

  #deindex(i: number): [number, number] {
    return [i % this.#width, Math.floor(i / this.#width)];
  }

  isInBounds(x: number, y: number) {
    return x >= 0 && x < this.#width && y >= 0 && y < this.#height;
  }

  get(x: number, y: number): T {
    if (!this.isInBounds(x, y)) {
      throw new Error("Out of bounds");
    }
    return this.#data[this.#index(x, y)];
  }

  set(x: number, y: number, value: T) {
    if (!this.isInBounds(x, y)) {
      throw new Error("Out of bounds");
    }
    this.#data[this.#index(x, y)] = value;
  }

  get height() {
    return this.#height;
  }

  get width() {
    return this.#width;
  }

  get size() {
    return this.#data.length;
  }

  *row(y: number) {
    y = y < 0 ? this.#height + y : y;
    for (let x = 0; x < this.#width; x++) {
      yield this.get(x, y);
    }
  }

  *column(x: number) {
    x = x < 0 ? this.#width + x : x;
    for (let y = 0; y < this.#height; y++) {
      yield this.get(x, y);
    }
  }

  /**
   * Returns a "flat" regular array of all the values, row-major order.
   */
  flatten() {
    return this.#data.slice();
  }

  /**
   * Returns the sum of all elements in the array by the given function.
   * If the array elements are numbers the function can be omitted.
   */
  sum(this: Array2D<number>): number;
  sum(by: (value: T) => number): number;
  sum(by?: (value: T) => number): number {
    if (by) {
      return this.#data.reduce((sum, value) => sum + by(value), 0);
    }

    return this.#data.reduce((sum, value) => sum + (value as number), 0);
  }

  /**
   * Returns the total count of items in the array2D. If a predicate function
   * is provided, it will only account for items that passes the predicate
   */
  count(): number;
  count(predicate: (value: T, x: number, y: number) => boolean): number;
  count(predicate?: (value: T, x: number, y: number) => boolean): number {
    if (!predicate) {
      return this.#data.length;
    }

    let total = 0;
    for (const [value, x, y] of this.entries()) {
      if (predicate(value, x, y)) {
        total++;
      }
    }

    return total;
  }

  /**
   * Transpose the matrix in place.
   * Only square matrices are supported.
   */
  transpose() {
    if (this.#width !== this.#height) {
      throw new Error("Can only transpose square matrices");
    }

    const newData = new Array(this.#data.length);
    for (let y = 0; y < this.#height; y++) {
      for (let x = 0; x < this.#width; x++) {
        newData[this.#index(y, x)] = this.get(x, y);
      }
    }

    this.#data = newData;
    return this;
  }

  /**
   * Flips the matrix vertically in place,
   * i.e. rows are reversed.
   */
  flipVertical(): this {
    const N = this.#width;
    const aux = new Array(this.#data.length);

    for (let i = 0; i < this.#height; i++) {
      for (let j = 0; j < this.#width; j++) {
        aux[i * N + j] = this.#data[(this.#height - 1 - i) * N + j];
      }
    }

    this.#data = aux;
    return this;
  }

  /**
   * Flips the matrix horizontally in place,
   * i.e. columns are reversed.
   */
  flipHorizontal(): this {
    const N = this.#width;
    const aux = new Array(this.#data.length);

    for (let i = 0; i < this.#height; i++) {
      for (let j = 0; j < this.#width; j++) {
        aux[i * N + j] = this.#data[i * N + this.#width - 1 - j];
      }
    }

    this.#data = aux;
    return this;
  }

  /**
   * Rotates the matrix n * 90 degrees clockwise in place.
   */
  rotateCW(): this;
  rotateCW(times: number): this;
  rotateCW(times = 1): this {
    if (!this.isSquare()) {
      throw new Error("Can only rotate square matrices");
    }

    times %= 4;
    if (times === 0) {
      return this;
    }

    const N = this.#width;
    const aux = new Array(this.#data.length);

    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        let ri: number;
        let rj: number;

        if (times === 1) {
          ri = j;
          rj = N - 1 - i;
        } else if (times === 2) {
          ri = N - 1 - i;
          rj = N - 1 - j;
        } else {
          ri = N - 1 - j;
          rj = i;
        }

        aux[ri * N + rj] = this.#data[i * N + j];
      }
    }
    this.#data = aux;
    return this;
  }

  /**
   * Rotates the matrix n * 90 degrees counter-clockwise in place.
   */
  rotateCCW(): this;
  rotateCCW(times: number): this;
  rotateCCW(times = 1): this {
    return this.rotateCW(4 - (times % 4));
  }

  /**
   * Returns true if the matrix is square, i.e. width === height
   */
  isSquare() {
    return this.#width === this.#height;
  }

  /**
   * Returns true iff the two array2Ds are structurally equavalent.
   */
  equals(other: Array2D<T>) {
    if (this === other) {
      return true;
    }

    if (this.#data.length !== other.#data.length) {
      return false;
    }

    for (let i = 0; i < this.#data.length; i++) {
      if (this.#data[i] !== other.#data[i]) {
        return false;
      }
    }

    return true;
  }

  /**
   * Returns a new Array2D that is a cropped version of the original.
   * If the crop is out of bounds, an error is thrown.
   */
  crop(x: number, y: number, width: number, height: number): Array2D<T> {
    const xEnd = x + width;
    const yEnd = y + height;
    if (x < 0 || xEnd > this.#width || y < 0 || yEnd > this.#height) {
      throw new Error("Out of bounds");
    }

    const cropped = new Array2D<T>(width, height);

    for (let ny = y; ny < yEnd; ny++) {
      for (let nx = x; nx < xEnd; nx++) {
        cropped.set(nx - x, ny - y, this.get(nx, ny));
      }
    }

    return cropped;
  }

  /**
   * Returns a new shallow copy of the Array2D.
   * The underlying array is new, but the data contained is by reference.
   */
  clone(): Array2D<T> {
    return new Array2D(this.#width, this.#data.slice());
  }

  toString() {
    const rows = new Array(this.#height);
    for (let y = 0; y < this.#height; y++) {
      rows[y] = Array.from(this.row(y));
    }

    return rows.map((row) => row.join("")).join("\n");
  }

  /**
   * Returns an iterator over the elements of the array.
   * The order is row-major.
   */
  *[Symbol.iterator]() {
    for (const [value, index] of this.#data.entries()) {
    }
  }

  /**
   * Returns an iterator over the elements of the array.
   */
  *values() {
    yield* this.#data;
  }

  /**
   * Returns an iterator over the elements and coordinates of the array.
   */
  *entries(): Generator<[T, number, number]> {
    for (const [index, value] of this.#data.entries()) {
      const [x, y] = this.#deindex(index);
      yield [value, x, y];
    }
  }

  trim(): Array2D<T>;
  trim(size: number): Array2D<T>;
  trim(horizontal: number, vertical: number): Array2D<T>;
  trim(left: number, top: number, right: number, bottom: number): Array2D<T>;
  trim(left = 1, top = 1, right?: number, bottom?: number) {
    right ??= left;
    bottom ??= top;

    const x = left;
    const y = top;
    const w = this.#width - left - right;
    const h = this.#height - top - bottom;

    // console.log({ x, y, w, h });

    return this.crop(x, y, w, h);
  }

  /**
   * Pastes the given data into the array at the given coordinates.
   * Pastes the data in place.
   *
   * Throws if any part of the array is out of bounds
   */
  paste(x: number, y: number, data: Array2D<T>) {
    if (x + data.width > this.#width || y + data.height > this.#height) {
      throw new Error("Out of bounds");
    }

    for (let dy = 0; dy < data.height; dy++) {
      for (let dx = 0; dx < data.width; dx++) {
        this.set(x + dx, y + dy, data.get(dx, dy));
      }
    }

    return this;
  }

  find(predicate: (value: T) => boolean): T | undefined {
    return this.#data.find(predicate);
  }

  findCoordinates(
    predicate: (value: T) => boolean
  ): [number, number] | undefined {
    for (const [i, value] of this.#data.entries()) {
      if (predicate(value)) {
        return this.#deindex(i);
      }
    }
  }

  *findAllCoordinates(
    predicate: (value: T) => boolean
  ): Generator<[number, number]> {
    for (const [i, value] of this.#data.entries()) {
      if (predicate(value)) {
        yield this.#deindex(i);
      }
    }
  }

  forEach(callback: (value: T, x: number, y: number) => void) {
    for (const [value, x, y] of this.entries()) {
      callback(value, x, y);
    }
  }

  map<U>(callback: (value: T, x: number, y: number) => U): Array2D<U> {
    const newData = this.#data.map((value, i) => {
      const [x, y] = this.#deindex(i);
      return callback(value, x, y);
    });

    return new Array2D(this.#width, newData);
  }

  reduce<S>(
    callback: (acc: S, value: T, x: number, y: number) => S,
    initialState: S
  ): S {
    let acc = initialState;
    for (const [value, x, y] of this.entries()) {
      acc = callback(acc, value, x, y);
    }
    return acc;
  }

  min(this: Array2D<number>): [T, number, number];
  min(by: (value: T) => number): [T, number, number];
  min(by?: (value: T) => number): [T, number, number] {
    if (this.#data.length === 0) {
      throw new Error("Cannot find the minimum of an empty array");
    }

    let min: T | undefined = undefined;
    let minX = 0;
    let minY = 0;
    let minVal = Infinity;

    for (const [value, x, y] of this.entries()) {
      const val = by ? by(value) : (value as unknown as number);
      if (val < minVal) {
        min = value;
        minX = x;
        minY = y;
        minVal = val;
      }
    }

    return [min!, minX, minY];
  }

  max(this: Array2D<number>): [T, number, number];
  max(by: (value: T) => number): [T, number, number];
  max(by?: (value: T) => number): [T, number, number] {
    if (this.#data.length === 0) {
      throw new Error("Cannot find the maximum of an empty array");
    }

    let max: T | undefined = undefined;
    let maxX = 0;
    let maxY = 0;
    let maxVal = -Infinity;

    for (const [value, x, y] of this.entries()) {
      const val = by ? by(value) : (value as unknown as number);
      if (val > maxVal) {
        max = value;
        maxX = x;
        maxY = y;
        maxVal = val;
      }
    }

    return [max!, maxX, maxY];
  }
}
