import { createSolver } from "../../solution";

//#region AST
type ExprInt = {
  type: "int";
  value: number;
};

type ExrpOp = {
  type: "op";
  op: string;
  lhs: Expr;
  rhs: Expr;
};

type ExrpGroup = {
  type: "group";
  expr: Expr;
};

type Expr = ExprInt | ExrpOp | ExrpGroup;

//#endregion

//#region Parser

function isNumeric(token: string): boolean {
  return /^\d+$/.test(token);
}

const re = /\d+|[()+*]/g;
function tokenize(input: string): Array<string> {
  return input.match(re) ?? [];
}

/**
 * A simple parser for the expression grammar.
 * Parses the given input string. By default is parses with no operator
 * precedence, i.e. left-to-right. If `withPrecendence` is set to true, it will
 * parse with "reverse" operator precedence, i.e. addition before multiplication
 */
class Parser {
  #tokens: Array<string>;
  #pos = 0;
  #withPrecendence: boolean;

  constructor(input: string, withPrecendence: boolean = false) {
    this.#tokens = tokenize(input);
    this.#withPrecendence = withPrecendence;
  }

  parse() {
    if (this.#tokens.length === 0) {
      this.#error("Empty input");
    }

    return this.#expression();
  }

  #expression(): Expr {
    return this.#withPrecendence ? this.#multiplication() : this.#leftToRight();
  }

  #multiplication(): Expr {
    let left = this.#addition();
    while (this.#peek() === "*") {
      const operator = this.#consume();
      const right = this.#addition();
      left = { type: "op", op: operator, lhs: left, rhs: right };
    }

    return left;
  }

  #addition(): Expr {
    let left = this.#term();
    while (this.#peek() === "+") {
      const operator = this.#consume();
      const right = this.#term();
      left = { type: "op", op: operator, lhs: left, rhs: right };
    }

    return left;
  }

  #leftToRight(): Expr {
    let left = this.#term();
    while (this.#peek() === "+" || this.#peek() === "*") {
      const operator = this.#consume();
      const right = this.#term();
      left = { type: "op", op: operator, lhs: left, rhs: right };
    }
    return left;
  }

  #term(): Expr {
    const token = this.#peek();
    if (!token) {
      this.#error("Unexpected end of input");
    }

    if (isNumeric(token)) {
      this.#consume();
      return { type: "int", value: parseInt(token) };
    }

    if (token === "(") {
      this.#consume();
      const expr = this.#expression();
      if (this.#consume() !== ")") {
        this.#error("Expected closing parenthesis");
      }
      return { type: "group", expr };
    }

    this.#error(`Unexpected token: ${token}`);
  }

  #peek() {
    return this.#tokens[this.#pos];
  }

  #consume() {
    return this.#tokens[this.#pos++];
  }

  #error(message: string): never {
    const wrappedMesage = `Error at position ${this.#pos}: ${message}`;
    throw new Error(wrappedMesage);
  }
}

//#endregion

function evaluate(expr: Expr): number {
  switch (expr.type) {
    case "int":
      return expr.value;
    case "group":
      return evaluate(expr.expr);
    case "op": {
      const lhs = evaluate(expr.lhs);
      const rhs = evaluate(expr.rhs);
      switch (expr.op) {
        case "+":
          return lhs + rhs;
        case "*":
          return lhs * rhs;
        default:
          throw new Error(`Unknown operator: ${expr.op}`);
      }
    }
    default:
      throw new Error(`Unknown expression type`);
  }
}

function parseAndEvaluate(input: string, withPrecendence: boolean) {
  const parser = new Parser(input, withPrecendence);
  const expr = parser.parse();
  return evaluate(expr);
}

export default createSolver(async (input) => {
  let first = 0;
  let second = 0;
  for await (const line of input) {
    first += parseAndEvaluate(line, false);
    second += parseAndEvaluate(line, true);
  }

  return {
    first,
    second,
  };
});
