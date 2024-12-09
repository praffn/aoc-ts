import { combinations } from "../../lib/iter";
import { createSolver, createSolverWithLineArray } from "../../solution";

interface Vec2 {
  x: number;
  y: number;
}

export default createSolverWithLineArray(async (input) => {
  const map = input.map((line) => line.split(""));
  const height = map.length;
  const width = map[0].length;

  function isValidCoords(x: number, y: number) {
    return x >= 0 && x < width && y >= 0 && y < height;
  }

  const antennas = new Map<string, Array<Vec2>>();

  for (let y = 0; y < map.length; y++) {
    for (let x = 0; x < map[y].length; x++) {
      if (map[y][x] === ".") {
        continue;
      }

      antennas.set(map[y][x], (antennas.get(map[y][x]) || []).concat({ x, y }));
    }
  }

  const antinodesPart1 = new Set<string>();
  const antinodesPart2 = new Set<string>();

  const lines: Array<[slope: number, intercept: number]> = [];

  for (const [_, positions] of antennas) {
    for (const [a, b] of combinations(positions, 2)) {
      const diff = { x: b.x - a.x, y: b.y - a.y };

      const antinode1 = { x: a.x - diff.x, y: a.y - diff.y };
      const antinode2 = { x: b.x + diff.x, y: b.y + diff.y };

      if (isValidCoords(antinode1.x, antinode1.y)) {
        antinodesPart1.add(`${antinode1.x},${antinode1.y}`);
      }

      if (isValidCoords(antinode2.x, antinode2.y)) {
        antinodesPart1.add(`${antinode2.x},${antinode2.y}`);
      }

      for (let f = -width; f <= width; f++) {
        const x = a.x + diff.x * f;
        const y = a.y + diff.y * f;
        if (isValidCoords(x, y)) {
          antinodesPart2.add(`${x},${y}`);
        }
      }
    }
  }

  return {
    first: antinodesPart1.size,
    second: antinodesPart2.size,
  };
});
