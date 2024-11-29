import { createSolverWithLineArray } from "../../solution";

function isDigit(c: string) {
  return c >= "0" && c <= "9";
}

export default createSolverWithLineArray(async (lines) => {
  // Turn lines into a 2D map
  const schematic = lines.map((line) => line.split(""));

  const height = schematic.length;
  const width = schematic[0].length;

  let first = 0;

  // gearMap is a map of coords (e.g. 3,1) to an array of numbers that are touching that gear
  const gearMap: Map<string, Array<number>> = new Map();

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const startIndex = x;
      let endIndex = x;

      // While the character is a digit we keep moving the index (until it is no longer a digit)
      while (isDigit(schematic[y][endIndex])) {
        endIndex++;
      }

      // if endIndex was not moved it means we encountered zero digits, thus we can just continue
      if (startIndex === endIndex) {
        continue;
      }

      // Update our loop variable to the index we moved to
      x = endIndex;

      // indicesToCheck will be an array of the indices that compose a bounding box around the found number
      // we do not add out of bounds indices
      const indicesToCheck: Array<[number, number]> = [];

      if (startIndex > 0) {
        indicesToCheck.push([y, startIndex - 1]);
      }
      if (endIndex < width - 1) {
        indicesToCheck.push([y, endIndex]);
      }

      const rowCheckStart = Math.max(0, startIndex - 1);
      const rowCheckEnd = Math.min(width, endIndex + 1);

      for (let i = rowCheckStart; i < rowCheckEnd; i++) {
        if (y > 0) {
          indicesToCheck.push([y - 1, i]);
        }
        if (y < height - 1) {
          indicesToCheck.push([y + 1, i]);
        }
      }

      // Touches will be an array of everything this number is touching
      const touches = indicesToCheck.map(([y, x]) => ({
        c: schematic[y][x],
        x,
        y,
      }));
      const touchingSymbols = touches.filter(({ c }) => c !== ".");

      if (touchingSymbols.length > 0) {
        const number = Number.parseInt(
          schematic[y].slice(startIndex, endIndex).join(""),
          10
        );

        first += number;

        const touchingGears = touchingSymbols.filter(({ c }) => c === "*");
        for (const touchingGear of touchingGears) {
          const coords = `${touchingGear.x},${touchingGear.y}`;
          const currentNumbers = gearMap.get(coords) || [];
          currentNumbers.push(number);
          gearMap.set(coords, currentNumbers);
        }
      }
    }
  }

  let second = 0;

  for (const numbers of gearMap.values()) {
    if (numbers.length !== 2) {
      continue;
    }

    second += numbers[0] * numbers[1];
  }

  return { first, second };
});
