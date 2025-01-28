import { range } from "../../lib/iter";
import { createSolver } from "../../solution";

export default createSolver(async (input) => {
  let maxID = -1;
  const occupied = new Set<number>();

  for await (const line of input) {
    // turn into binary number
    const id = Number.parseInt(
      line
        .replaceAll("F", "0")
        .replaceAll("B", "1")
        .replaceAll("L", "0")
        .replaceAll("R", "1"),
      2
    );

    occupied.add(id);
    maxID = Math.max(maxID, id);
  }

  let mySeat = -1;
  for (const id of range(1 << 11)) {
    if (!occupied.has(id)) {
      if (occupied.has(id - 1) && occupied.has(id + 1)) {
        mySeat = id;
        break;
      }
    }
  }

  return {
    first: maxID,
    second: mySeat,
  };
});
