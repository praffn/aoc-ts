import { productRepeat, range } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

function* parseSections(input: Array<string>) {
  let current: Array<string> = [];
  for (const line of input) {
    if (line.startsWith("inp") && current.length > 0) {
      yield current;
      current = [];
    }
    current.push(line);
  }

  yield current;
}

type Section = [null, number] | [number, null];

function parse(input: Array<string>): Array<Section> {
  return Array.from(
    parseSections(input).map((section) => {
      if (section[4].endsWith("1")) {
        return [+section.at(-3)?.split(" ").at(-1)!, null];
      }
      return [null, +section[5].split(" ").at(-1)!];
    })
  );
}

function compute(inputs: Array<number>, sections: Array<Array<number | null>>) {
  let z = 0;
  let inputIndex = 0;
  const model = new Array(sections.length).fill(0);

  for (const [sectionIndex, section] of sections.entries()) {
    const [l, r] = section;
    if (l !== null) {
      model[sectionIndex] = inputs[inputIndex];
      z = z * 26 + inputs[inputIndex] + l;
      inputIndex++;
    } else if (r !== null) {
      model[sectionIndex] = (z % 26) + r;
      z = Math.floor(z / 26);
      if (!(model[sectionIndex] >= 1 && model[sectionIndex] <= 9)) {
        return null;
      }
    }
  }

  return +model.join("");
}

function solve(sections: Array<Array<number | null>>) {
  let first = -1;
  let second = -1;

  for (const inputs of productRepeat(range(9, 0, -1), 7)) {
    const m = compute(inputs, sections);
    if (m) {
      first = m;
      break;
    }
  }

  for (const inputs of productRepeat(range(1, 10), 7)) {
    const m = compute(inputs, sections);
    if (m) {
      second = m;
      break;
    }
  }

  return [first, second] as const;
}

export default createSolverWithLineArray(async (input) => {
  const sections = parse(input);

  const [first, second] = solve(sections);

  return {
    first,
    second,
  };
});
