import { slidingWindow } from "../../lib/iter";
import { createSolver } from "../../solution";

type IP = {
  unbracketed: Array<string>;
  bracketed: Array<string>;
};

function parseIP(input: string): IP {
  const unbracketed: Array<string> = [];
  const bracketed: Array<string> = [];

  while (input.includes("[")) {
    const start = input.indexOf("[");
    const end = input.indexOf("]");
    unbracketed.push(input.slice(0, start));
    bracketed.push(input.slice(start + 1, end));
    input = input.slice(end + 1);
  }

  if (input.length > 0) {
    unbracketed.push(input);
  }

  return { unbracketed, bracketed };
}

function containsABBA(s: string) {
  for (const [a, b, c, d] of slidingWindow(s, 4)) {
    if (a === d && b === c && a !== b) {
      return true;
    }
  }

  return false;
}

function findABAs(s: string) {
  const abas = new Set<string>();

  for (const [a, b, c] of slidingWindow(s, 3)) {
    if (a === c && a !== b) {
      abas.add(a + b + c);
    }
  }

  return abas;
}

function union(a: Set<string>, b: Set<string>) {
  for (const item of b) {
    a.add(item);
  }
}

function supportsTLS(ip: IP) {
  return ip.unbracketed.some(containsABBA) && !ip.bracketed.some(containsABBA);
}

function supportsSSL(ip: IP) {
  const abas = new Set<string>();
  const babs = new Set<string>();

  for (const part of ip.unbracketed) {
    union(abas, findABAs(part));
  }

  for (const part of ip.bracketed) {
    union(babs, findABAs(part));
  }

  for (const aba of abas) {
    const bab = aba[1] + aba[0] + aba[1];
    if (babs.has(bab)) {
      return true;
    }
  }

  return false;
}

export default createSolver(async (input) => {
  let ipsSupportingTLS = 0;
  let ipsSupportingSSL = 0;

  for await (const line of input) {
    const ip = parseIP(line);

    if (supportsTLS(ip)) {
      ipsSupportingTLS++;
    }

    if (supportsSSL(ip)) {
      console.log(ip);
      ipsSupportingSSL++;
    }
  }

  return {
    first: ipsSupportingTLS,
    second: ipsSupportingSSL,
  };
});
