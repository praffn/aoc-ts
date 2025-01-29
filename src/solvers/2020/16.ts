import { minBy, numericProduct, range, sum } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

//#region Types & Data

type InclusiveRange = {
  min: number;
  max: number;
};

/**
 * Returns true if the given value is in the range
 */
function rangeContains(range: InclusiveRange, n: number) {
  return range.min <= n && n <= range.max;
}

type Rule = {
  name: string;
  ranges: Array<InclusiveRange>;
};

/**
 * Returns true if the value passes the given rule
 */
function passes(n: number, rule: Rule) {
  return rule.ranges.some((range) => rangeContains(range, n));
}

/**
 * Returns true if the value passes all the rules
 */
function passesAll(n: number, rules: Array<Rule>) {
  return rules.some((rule) => passes(n, rule));
}

//#endregion

//#region Parsing

const re = /([\w\s]+): (\d+)-(\d+) or (\d+)-(\d+)/;
function parseRules(ruleSet: string): Array<Rule> {
  const rules: Array<Rule> = [];

  for (const line of ruleSet.split("\n")) {
    const [, name, min1, max1, min2, max2] = line.match(re)!;
    const range1 = {
      min: Number.parseInt(min1),
      max: Number.parseInt(max1),
    };
    const range2 = {
      min: Number.parseInt(min2),
      max: Number.parseInt(max2),
    };
    rules.push({
      name,
      ranges: [range1, range2],
    });
  }

  return rules;
}

function parseTicket(line: string): Array<number> {
  return line.split(",").map((n) => Number.parseInt(n));
}

function parse(input: string): {
  rules: Array<Rule>;
  myTicket: Array<number>;
  nearbyTickets: Array<Array<number>>;
} {
  const [ruleSet, myTicketRaw, nearbyTicketsRaw] = input.split("\n\n");

  const rules = parseRules(ruleSet);

  const myTicket = parseTicket(myTicketRaw.split("\n")[1]);
  const nearbyTickets = nearbyTicketsRaw.split("\n").slice(1).map(parseTicket);

  return { rules, myTicket, nearbyTickets };
}

//#endregion

//#region Solving

/**
 * Returns a new array with tickets that passes validation.
 * Also returns the error rate, i.e. the sum of all invalid numbers.
 */
function filterInvalidTickets(
  tickets: Array<Array<number>>,
  rules: Array<Rule>
): { validTickets: Array<Array<number>>; errorRate: number } {
  const invalidNumbers: Array<number> = [];
  const validTickets: Array<Array<number>> = [];

  outer: for (const ticket of tickets) {
    for (const n of ticket) {
      if (!passesAll(n, rules)) {
        invalidNumbers.push(n);
        continue outer;
      }
    }
    validTickets.push(ticket);
  }

  return {
    validTickets,
    errorRate: sum(invalidNumbers),
  };
}

/**
 * Given an array of valid tickets, identityFields will return a mapping from
 * field name to index.
 */
function identityFields(
  tickets: Array<Array<number>>,
  rules: Array<Rule>
): Map<string, number> {
  const fieldCount = tickets[0].length;
  // fieldCandidates is a map from a field to the possible indices it could be.
  // initially, all fields are possible for all indices, but we will begin
  // pruning them as we go.
  const fieldCandidates = new Map(
    rules.map((rule) => [rule.name, new Set(range(fieldCount))])
  );

  // We're gonna loop through each ticket of course
  for (const ticket of tickets) {
    // And then for each ticket, we enumerate the fields
    for (const [i, n] of ticket.entries()) {
      // Ok we now have field i with value n.
      // Now lets try ALL rules. If it does not pass a rule, we can remove i
      // from the candidate indices for that rule.
      for (const rule of rules) {
        if (!passes(n, rule)) {
          fieldCandidates.get(rule.name)!.delete(i);
        }
      }
    }
  }

  // If our input is valid we should now have a candidate map where at least
  // one rule has exactly one candidate index. That means that we can remove
  // that index from all other rules, rinse repeat
  const fieldMap = new Map<string, number>();
  while (fieldCandidates.size > 0) {
    // lets get the first field with only one candidate
    const [name, indices] = minBy(fieldCandidates, ([_, set]) => set.size)!;
    const value = [...indices][0];
    // remove it from the candidates
    fieldCandidates.delete(name);
    // and add it to the fieldMap
    fieldMap.set(name, value);
    // and remove it from all other candidates
    for (const [_, set] of fieldCandidates) {
      set.delete(value);
    }
  }

  return fieldMap;
}

//#endregion

export default createSolverWithString(async (input) => {
  const { rules, myTicket, nearbyTickets } = parse(input);

  const { validTickets, errorRate } = filterInvalidTickets(
    nearbyTickets,
    rules
  );

  const fieldMap = identityFields(validTickets, rules);

  const departureFields = fieldMap
    .entries()
    // only look for fields that start with "departure"
    .filter(([name]) => name.startsWith("departure"))
    // and map it to the relevant index in my ticket
    .map(([_, index]) => myTicket[index]);

  return {
    first: errorRate,
    second: numericProduct(departureFields),
  };
});
