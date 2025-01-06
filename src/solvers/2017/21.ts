import { createSolver } from "../../solution";

type Matrix<T> = Array<Array<T>>;

function transpose<T>(matrix: Matrix<T>): Matrix<T> {
  const result: Matrix<T> = [];

  for (let i = 0; i < matrix[0].length; i++) {
    result.push([]);
    for (let j = 0; j < matrix.length; j++) {
      result[i].push(matrix[j][i]);
    }
  }

  return result;
}

function flipY<T>(m: Matrix<T>): Matrix<T> {
  return m.toReversed();
}

function expand<T>(m: Matrix<T>): Array<Matrix<T>> {
  const results = [m];
  m = transpose(m);
  results.push(m);
  m = flipY(m); // rot 90
  results.push(m);
  m = transpose(m);
  results.push(m);
  m = flipY(m); // rot 180
  results.push(m);
  m = transpose(m);
  results.push(m);
  m = flipY(m); // rot 270
  results.push(m);
  m = transpose(m);
  results.push(m);

  return results;
}

function key<T>(m: Matrix<T>): string {
  return m.map((row) => row.join("")).join("/");
}

function submatrix<T>(
  m: Matrix<T>,
  x: number,
  y: number,
  size: number
): Matrix<T> {
  const result: Matrix<T> = [];

  for (let i = 0; i < size; i++) {
    result.push([]);
    for (let j = 0; j < size; j++) {
      result[i].push(m[y + i][x + j]);
    }
  }

  return result;
}

function setRegion<T>(m: Matrix<T>, x: number, y: number, region: Matrix<T>) {
  for (let i = 0; i < region.length; i++) {
    for (let j = 0; j < region.length; j++) {
      m[y + i][x + j] = region[i][j];
    }
  }
}

function newMatrix<T>(size: number, value: T): Matrix<T> {
  const result: Matrix<T> = [];

  for (let i = 0; i < size; i++) {
    result.push([]);
    for (let j = 0; j < size; j++) {
      result[i].push(value);
    }
  }

  return result;
}

function matrixFromString(s: string): Matrix<number> {
  return s
    .split("/")
    .map((row) => row.split("").map((c) => (c === "#" ? 1 : 0)));
}

function iterate(
  program: Matrix<number>,
  rules2: Map<string, Matrix<number>>,
  rules3: Map<string, Matrix<number>>,
  iterations: number
): Matrix<number> {
  for (let i = 0; i < iterations; i++) {
    const size = program.length % 2 === 0 ? 2 : 3;
    const newSize = program.length + program.length / size;
    const newProgram = newMatrix(newSize, 0);
    const ruleSet = size === 2 ? rules2 : rules3;

    const numRegions = program.length / size;

    for (let y = 0; y < numRegions; y++) {
      for (let x = 0; x < numRegions; x++) {
        const region = submatrix(program, x * size, y * size, size);
        const newRegion = ruleSet.get(key(region))!;
        setRegion(newProgram, x * (size + 1), y * (size + 1), newRegion);
      }
    }

    program = newProgram;
  }

  return program;
}

function count(m: Matrix<number>) {
  return m.flat().filter((c) => c === 1).length;
}

function addRule(
  line: string,
  rules2: Map<string, Matrix<number>>,
  rules3: Map<string, Matrix<number>>
) {
  const [_rule, _pattern] = line.split(" => ");
  const rule = matrixFromString(_rule);
  const pattern = matrixFromString(_pattern);

  const rules = expand(rule);

  if (rule.length === 2) {
    for (const r of rules) {
      rules2.set(key(r), pattern);
    }
  } else {
    for (const r of rules) {
      rules3.set(key(r), pattern);
    }
  }
}

export default createSolver(async (input) => {
  const rules2: Map<string, Matrix<number>> = new Map();
  const rules3: Map<string, Matrix<number>> = new Map();

  for await (const line of input) {
    addRule(line, rules2, rules3);
  }

  let program = matrixFromString(".#./..#/###");

  // iterate 5 times
  program = iterate(program, rules2, rules3, 5);
  const first = count(program);
  // do it 13 more times for a total of 18
  program = iterate(program, rules2, rules3, 13);
  const second = count(program);

  return {
    first: first,
    second: second,
  };
});
