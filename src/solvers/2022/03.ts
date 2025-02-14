import { chunk, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

const ordA = "A".charCodeAt(0);
const orda = "a".charCodeAt(0);
const ordz = "z".charCodeAt(0);
/**
 * Returns the priority of the given rucksack item
 */
function getPriority(ord: number): number {
  if (ord >= orda && ord <= ordz) {
    return ord - orda + 1;
  }
  return ord - ordA + 27;
}

// instead of characters we represent rucksack items as numbers to make
// calculation ever so slightly faster
type Rucksack = Array<number>;

function parse(input: Array<string>): Array<Rucksack> {
  return input.map((line) => {
    return line.split("").map((c) => c.charCodeAt(0));
  });
}

function solveFirst(rucksacks: Array<Rucksack>): number {
  let total = 0;

  // lets go through each rucksack
  for (const rucksack of rucksacks) {
    // split down the middle and turn each side into a set
    const middleIndex = rucksack.length / 2;
    const left = new Set(rucksack.slice(0, middleIndex));
    const right = new Set(rucksack.slice(middleIndex));
    // find intersection, i.e. items that are both in left and right
    const intersection = left.intersection(right);

    // sum up the priority of the items in the intersection
    total += sum(intersection.values().map(getPriority));
  }

  return total;
}

function solveSecond(rucksacks: Array<Rucksack>): number {
  let total = 0;

  // lets go through each triplet of rucksacks
  for (const [a, b, c] of chunk(rucksacks, 3)) {
    // find their intersection
    const intersection = new Set(a)
      .intersection(new Set(b))
      .intersection(new Set(c));

    // sum up the priority of the items in the intersection
    total += sum(intersection.values().map(getPriority));
  }

  return total;
}

export default createSolverWithLineArray(async (input) => {
  const rucksacks = parse(input);

  return {
    first: solveFirst(rucksacks),
    second: solveSecond(rucksacks),
  };
});
