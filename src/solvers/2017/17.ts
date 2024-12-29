import { createSolverWithNumber } from "../../solution";

export default createSolverWithNumber(async (stepSize) => {
  const lock = [0];
  let position = 0;
  for (let i = 1; i < 2017 + 1; i++) {
    position = (position + stepSize) % lock.length;
    lock.splice(position + 1, 0, i);
    position++;
  }

  const first = lock[(position + 1) % lock.length];

  position = 0;
  let second = 0;
  for (let i = 1; i < 50_000_000 + 1; i++) {
    position = (position + stepSize) % i;
    if (position === 0) {
      second = i;
    }
    position++;
  }

  return {
    first,
    second,
  };
});
