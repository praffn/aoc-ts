import { createSolver } from "../../solution";

const reg = /(mul\((\d+),(\d+)\))|(don't\(\))|(do\(\))/g;

// class Parser {
//   input: string;
//   pos = 0;
//   enabled = true;

//   constructor(input: string) {
//     this.input = input;
//   }

//   isEOF() {
//     return this.pos >= this.input.length
//   }

//   parse() {
//     while (!this.isEOF()) {
//       const c = this.input[this.pos];
//       if (c === "m") {
//         this.parseMul();
//       } else {
//         this.pos++;
//       }
//     }

//   }

//   parseMul() {

//   }
// }

export default createSolver(async (input) => {
  let first = 0;
  let second = 0;
  let enabled = true;

  for await (const line of input) {
    const matches = line.matchAll(reg);
    for (const match of matches) {
      switch (match[0]) {
        case "don't()":
          enabled = false;
          break;
        case "do()":
          enabled = true;
          break;
        default:
          const a = Number.parseInt(match[2], 10);
          const b = Number.parseInt(match[3], 10);
          const result = a * b;

          first += result;
          if (enabled) {
            second += result;
          }
      }
    }
  }

  return {
    first,
    second,
  };
});
