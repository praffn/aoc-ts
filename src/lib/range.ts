/**
 * Represents an exclusive range of numbers, i.e. [start, end)
 */
export class Range {
  #start: number;
  #end: number;

  constructor(start: number, end: number) {
    this.#start = start;
    this.#end = end;
  }

  /**
   * Returns a new Range that is inclusive of the end value, i.e. [start, end]
   */
  static inclusive(start: number, end: number): Range {
    return new Range(start, end + 1);
  }

  /**
   * Returns the total number of values in the range
   */
  length(): number {
    return this.#end - this.#start + 1;
  }

  /**
   * Returns true if the given value is within the range
   */
  contains(value: number): boolean {
    return value >= this.#start && value < this.#end;
  }

  /**
   * Returns true if the given range overlaps with this range
   */
  overlaps(other: Range): boolean {
    return this.contains(other.#start) || other.contains(this.#start);
  }

  /**
   * Returns true if the given range is fully contained within this range
   */
  fullyContains(other: Range): boolean {
    return this.contains(other.#start) && this.contains(other.#end - 1);
  }

  *[Symbol.iterator]() {
    for (let i = this.#start; i < this.#end; i++) {
      yield i;
    }
  }
}
