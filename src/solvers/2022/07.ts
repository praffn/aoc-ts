import { accumulate, min, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

function parseFileSystem(input: Array<string>) {
  const dirs = new Map<string, number>();
  let current = ["/"];

  for (const line of input) {
    if (line.startsWith("$")) {
      const [, command, arg] = line.split(" ");
      if (command === "ls") {
        continue;
      }

      switch (arg) {
        case "/":
          current = ["/"];
          break;
        case "..":
          current.pop();
          break;
        default:
          current.push(`${arg}/`);
          break;
      }
      continue;
    }

    const [dirOrSize] = line.split(" ");
    if (dirOrSize === "dir") {
      continue;
    }

    for (const path of accumulate(current)) {
      dirs.set(path, (dirs.get(path) ?? 0) + +dirOrSize);
    }
  }

  return dirs;
}

export default createSolverWithLineArray(async (input) => {
  const dirs = parseFileSystem(input);

  return {
    first: sum(dirs.values().filter((size) => size <= 100_000)),
    second: min(
      dirs.values().filter((size) => size >= dirs.get("/")! - 40_000_000),
      -1
    ),
  };
});
