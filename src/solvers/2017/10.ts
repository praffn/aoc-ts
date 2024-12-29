import { createSolverWithString } from "../../solution";
import { knot, knothash } from "./knothash";

export default createSolverWithString(async (input) => {
  const instructions = input.split(",").map((n) => Number.parseInt(n, 10));
  const ring = Array.from({ length: 256 }, (_, i) => i);

  knot(ring, instructions);

  return {
    first: ring[0] * ring[1],
    second: knothash(input),
  };
});
