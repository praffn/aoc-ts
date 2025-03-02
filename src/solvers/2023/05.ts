import { chunk, minBy, range } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

class Range {
  readonly sourceStart: number;
  readonly destinationStart: number;
  readonly length: number;

  constructor(sourceStart: number, destinationStart: number, length: number) {
    this.sourceStart = sourceStart;
    this.destinationStart = destinationStart;
    this.length = length;
  }

  isInRange(n: number) {
    return n >= this.sourceStart && n < this.sourceStart + this.length;
  }

  map(n: number) {
    return n - this.sourceStart + this.destinationStart;
  }
}

class RangeMap {
  readonly ranges: Array<Range> = [];

  addRange(sourceStart: number, destinationStart: number, length: number) {
    this.ranges.push(new Range(sourceStart, destinationStart, length));
  }

  map(n: number) {
    for (const range of this.ranges) {
      if (range.isInRange(n)) {
        return range.map(n);
      }
    }
    return n;
  }
}

function parse(input: string): [Array<number>, Array<RangeMap>] {
  const [rawSeeds, ...rest] = input.split("\n\n");
  const seeds = rawSeeds.match(/\d+/g)!.map((n) => +n);

  const almanac: Array<RangeMap> = [];

  for (const chunk of rest) {
    const rangeMap = new RangeMap();
    const rawRanges = chunk.split("\n").slice(1);
    for (const rawRange of rawRanges) {
      const [destinationStart, sourceStart, length] = rawRange
        .match(/\d+/g)!
        .map((n) => +n);
      rangeMap.addRange(sourceStart, destinationStart, length);
    }
    almanac.push(rangeMap);
  }

  return [seeds, almanac];
}

/**
 * Runs a seed through every range map and return the final location value
 */
function resolve(seed: number, rangeMaps: Array<RangeMap>) {
  return rangeMaps.reduce((n, rangeMap) => rangeMap.map(n), seed);
}

/**
 * Runs all seeds through the range map, returning the lowest resolved location
 */
function findLowestLocation(
  seeds: Array<number>,
  rangeMaps: Array<RangeMap>
): number {
  return Math.min(...seeds.map((seed) => resolve(seed, rangeMaps)));
}

/**
 * Treats every pair of seeds as a [start, length] range, and returns the lowest
 * possible resolved location for any seed value in these ranges.
 */
function findLowestLocationWithSeedRanges(
  seeds: Array<number>,
  rangeMaps: Array<RangeMap>
) {
  // Lets turn every pair of seeds into a range
  const seedRanges = Array.from(chunk(seeds, 2)).map(([a, b]) => ({
    start: a,
    length: b,
  }));

  // Loop through each range map
  for (const rangeMap of rangeMaps) {
    // And through each seed range
    for (const seed of seedRanges) {
      const seedEnd = seed.start + seed.length;
      // And finally through each range for the current rangeMap
      for (const range of rangeMap.ranges) {
        // If the seed range is wholly contained in the range, we can just
        // update the start value to the mapped value
        if (
          seed.start >= range.sourceStart &&
          seedEnd <= range.sourceStart + range.length
        ) {
          seed.start = range.map(seed.start);
          break;
        }

        // If it's the other way around; the range is wholly contained in the
        // seed range, we need to split the seed range into three new parts:
        //              [  range  ]
        // [ new start ][ new mid ][ new end ]

        if (
          range.sourceStart >= seed.start &&
          range.sourceStart + range.length <= seedEnd
        ) {
          // lets find the length of the "new start"
          const leftLength = range.sourceStart - seed.start;
          // And add that range:
          seedRanges.push({ start: seed.start, length: leftLength });

          // Lets just add the "range" values as the "new mid"
          seedRanges.push({
            start: range.destinationStart,
            length: range.length,
          });

          seed.start = range.destinationStart;
          seed.length = range.length;
          break;
        }

        // If the first part of the seed is inside the range, but the last part
        // is not, we need to split that last part off:
        // [    range    ]
        //   [ new start ][ new end ]
        if (
          seed.start >= range.sourceStart &&
          seed.start < range.sourceStart + range.length
        ) {
          const firstHalfLength = range.sourceStart + range.length - seed.start;
          const secondHalfLength = seed.length - firstHalfLength;

          seedRanges.push({
            start: seed.start + firstHalfLength,
            length: secondHalfLength,
          });
          seed.start = seed.start + range.destinationStart - range.sourceStart;
          seed.length = firstHalfLength;
          break;
        }

        // And finally, the other way around:
        //              [    range    ]
        // [ new start ][ new end ]
        if (
          seedEnd > range.sourceStart &&
          seedEnd < range.sourceStart + range.length
        ) {
          const firstHalfLength = range.sourceStart - seed.start;
          const secondHalfLength = seed.length - firstHalfLength;

          seedRanges.push({
            start: seed.start,
            length: firstHalfLength,
          });

          seed.start = range.destinationStart;
          seed.length = secondHalfLength;
          break;
        }
      }
    }
  }

  return Math.min(...seedRanges.map((seed) => seed.start));
}

export default createSolverWithString(async (input) => {
  const [seeds, almanac] = parse(input);

  return {
    first: findLowestLocation(seeds, almanac),
    second: findLowestLocationWithSeedRanges(seeds, almanac),
  };
});
