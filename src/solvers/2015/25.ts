import { createSolverWithString } from "../../solution";

function modularExponentiation(
  base: number,
  exponent: number,
  modulus: number
) {
  if (modulus === 1) return 0;
  var result = 1;
  base = base % modulus;
  while (exponent > 0) {
    if (exponent % 2 === 1)
      //odd number
      result = (result * base) % modulus;
    exponent = exponent >> 1; //divide by 2
    base = (base * base) % modulus;
  }
  return result;
}

export default createSolverWithString(async (input) => {
  const parts = input.split(" ");
  const row = Number.parseInt(parts[16], 10);
  const col = Number.parseInt(parts[18], 10);

  const firstCode = 20151125;
  const base = 252533;
  const mod = 33554393;

  const exp = ((row + col - 2) * (row + col - 1)) / 2 + col - 1;
  const first = (firstCode * modularExponentiation(base, exp, mod)) % mod;

  return {
    first,
    second: "Merry Christmas!",
  };
});
