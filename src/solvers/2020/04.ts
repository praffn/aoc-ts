import { chunkWhile } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type CandidatePassport = Record<string, string | undefined>;

function parseCandidatePassports(
  input: Array<string>
): Array<CandidatePassport> {
  const candidatePassports: Array<CandidatePassport> = [];

  for (const descriptors of chunkWhile(input, (line) => line !== "")) {
    const candidatePassport: CandidatePassport = {};
    for (const line of descriptors) {
      for (const pair of line.split(" ")) {
        const [key, value] = pair.split(":");
        candidatePassport[key] = value;
      }
    }
    candidatePassports.push(candidatePassport);
  }

  return candidatePassports;
}

function isValidYear(
  value: string | undefined,
  min: number,
  max: number
): boolean {
  if (!value) {
    return false;
  }

  if (value.length !== 4) {
    return false;
  }

  const year = Number.parseInt(value, 10);

  return year >= min && year <= max;
}

function isValidHeight(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  if (value.endsWith("cm")) {
    const height = Number.parseInt(value.slice(0, -2), 10);
    return height >= 150 && height <= 193;
  } else {
    const height = Number.parseInt(value.slice(0, -2), 10);
    return height >= 59 && height <= 76;
  }
}

const hexRe = /^#[0-9a-f]{6}$/;
function isValidHexColor(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return hexRe.test(value);
}

const validEyeColors = new Set([
  "amb",
  "blu",
  "brn",
  "gry",
  "grn",
  "hzl",
  "oth",
]);
function isValidEyeColor(value: string | undefined): boolean {
  return validEyeColors.has(value!);
}

function isValidPID(value: string | undefined): boolean {
  if (!value) {
    return false;
  }

  return value.length === 9 && !Number.isNaN(Number.parseInt(value, 10));
}

const requiredFields = [
  "byr", // Birth Year
  "iyr", // Issue Year
  "eyr", // Expiration Year
  "hgt", // Height
  "hcl", // Hair Color
  "ecl", // Eye Color
  "pid", // Passport ID
];
function hasRequiredFields(candidatePassport: CandidatePassport): boolean {
  return requiredFields.every((field) => field in candidatePassport);
}

function isValidPassport(candidatePassport: CandidatePassport): boolean {
  return (
    isValidYear(candidatePassport.byr, 1920, 2002) &&
    isValidYear(candidatePassport.iyr, 2010, 2020) &&
    isValidYear(candidatePassport.eyr, 2020, 2030) &&
    isValidHeight(candidatePassport.hgt) &&
    isValidHexColor(candidatePassport.hcl) &&
    isValidEyeColor(candidatePassport.ecl) &&
    isValidPID(candidatePassport.pid)
  );
}

export default createSolverWithLineArray(async (input) => {
  const candidatePassports = parseCandidatePassports(input);

  const passportsWithRequiredFields =
    candidatePassports.filter(hasRequiredFields);
  const validPassports = passportsWithRequiredFields.filter(isValidPassport);

  return {
    first: passportsWithRequiredFields.length,
    second: validPassports.length,
  };
});
