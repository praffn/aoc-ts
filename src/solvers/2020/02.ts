import { counter } from "../../lib/iter";
import { createSolver } from "../../solution";

const re = /(\d+)-(\d+) (\w): (\w+)/;
function getValidity(line: string): [boolean, boolean] {
  const [, fromS, toS, char, password] = line.match(re)!;
  const from = +fromS;
  const to = +toS;
  const charCount = counter(password).get(char) ?? 0;

  const firstPolicy = charCount >= from && charCount <= to;

  const secondPolicy =
    (password.at(from - 1) === char && password.at(to - 1) !== char) ||
    (password.at(from - 1) !== char && password.at(to - 1) === char);

  return [firstPolicy, secondPolicy];
}

export default createSolver(async (input) => {
  let first = 0;
  let second = 0;

  for await (const line of input) {
    const [passesPolicy1, passesPolicy2] = getValidity(line);
    if (passesPolicy1) {
      first++;
    }

    if (passesPolicy2) {
      second++;
    }
  }

  return {
    first,
    second,
  };
});
