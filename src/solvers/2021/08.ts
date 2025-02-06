import { createSolverWithLineArray } from "../../solution";

/**
 * Returns a pair where the first item is the sum of all the output numbers,
 * and the second item is the count of occurrences of 1, 4, 7 and 8 in the
 * output digits.
 */
function solve(input: Array<string>): [number, number] {
  let outputSum = 0;
  let count1478 = 0;

  // We loop through each <signals> | <output> line
  for (const line of input) {
    const [signals, outputs] = line.split(" | ").map((l) => l.split(" "));
    // create map, that maps the length of the signal to the set of signals
    const map = new Map(signals.map((s) => [s.length, new Set(s)]));

    let tmp = "";
    for (const output of outputs) {
      const a = new Set(output);
      const b = a.intersection(map.get(4)!);
      const c = a.intersection(map.get(2)!);

      switch (a.size) {
        // 1, 4, 7 and 8 are easy, because the numbers of segments they have
        // are unique to them.
        case 2:
          tmp += "1";
          count1478++;
          break;
        case 3:
          tmp += "7";
          count1478++;
          break;
        case 4:
          tmp += "4";
          count1478++;
          break;
        case 7:
          tmp += "8";
          count1478++;
          break;
        // Now we get to the harder part
        // 2, 3 and 5 each have 5 segments
        // 0, 6 and 9 each have 6 segments
        // We can intersect them with segments that compose 4 and 1 to figure
        // out which number it is.
        case 5:
          if (b.size === 2) {
            tmp += "2";
          } else if (c.size === 1) {
            tmp += "5";
          } else {
            tmp += "3";
          }
          break;
        case 6:
          if (b.size === 4) {
            tmp += "9";
          } else if (c.size === 1) {
            tmp += "6";
          } else {
            tmp += "0";
          }
          break;
      }
    }

    outputSum += Number.parseInt(tmp, 10);
  }

  return [outputSum, count1478];
}

export default createSolverWithLineArray(async (input) => {
  const [outputSum, count1478] = solve(input);

  return {
    first: count1478,
    second: outputSum,
  };
});
