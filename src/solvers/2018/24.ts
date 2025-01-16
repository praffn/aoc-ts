import { createSolverWithLineArray } from "../../solution";
import { sum } from "../../lib/iter";

type Group = {
  allegiance: string;
  unitCount: number;
  hp: number;
  damage: number;
  damageType: string;
  immunities: Set<string>;
  weaknesses: Set<string>;
  initiative: number;
};

function effectivePower(group: Group): number {
  return group.unitCount * group.damage;
}

function calculateDamage(attacker: Group, defender: Group) {
  if (defender.immunities.has(attacker.damageType)) {
    return 0;
  }

  let damage = effectivePower(attacker);

  if (defender.weaknesses.has(attacker.damageType)) {
    damage *= 2;
  }

  return damage;
}

//#region Parsing
const re =
  /(?<unitCount>\d+) units each with (?<hp>\d+) hit points(?:\s\((?<weakImmunity>.+)\))? with an attack that does (?<damage>\d+) (?<damageType>\w+) damage at initiative (?<initiative>\d+)/;

function parseGroup(line: string, allegiance: string): Group {
  const match = line.match(re);

  if (!match) {
    throw new Error(`Failed to parse line: ${line}`);
  }

  const { unitCount, hp, weakImmunity, damage, damageType, initiative } =
    match.groups!;

  parseWeaknessesAndImmunities(weakImmunity);

  return {
    allegiance,
    unitCount: +unitCount,
    hp: +hp,
    damage: +damage,
    damageType,
    initiative: +initiative,
    ...parseWeaknessesAndImmunities(weakImmunity),
  };
}

function parseWeaknessesAndImmunities(weakImmunity = "") {
  let [weaknessesStr, immunitiesStr] = weakImmunity.split("; ");
  if (weaknessesStr.startsWith("immune")) {
    [weaknessesStr, immunitiesStr] = [immunitiesStr, weaknessesStr];
  }

  const weaknesses = new Set(weaknessesStr?.slice(8).split(", "));
  const immunities = new Set(immunitiesStr?.slice(10).split(", "));

  return { weaknesses, immunities };
}

function parseArmy(input: Array<string>) {
  const allegiance = input[0].replace(":", "");
  return input.slice(1).map((line) => parseGroup(line, allegiance));
}

function parse(input: Array<string>) {
  const splitIndex = input.indexOf("");
  const first = input.slice(0, splitIndex);
  const second = input.slice(splitIndex + 1);

  const firstArmy = parseArmy(first);
  const secondArmy = parseArmy(second);

  return [...firstArmy, ...secondArmy];
}
//#endregion

//#region Sorting
function sortByInitiative(a: Group, b: Group) {
  return b.initiative - a.initiative;
}

function sortByEffectivePower(a: Group, b: Group) {
  const aPower = effectivePower(a);
  const bPower = effectivePower(b);

  if (aPower !== bPower) {
    return bPower - aPower;
  }

  return sortByInitiative(a, b);
}

function sortByDamage(attacker: Group) {
  return (a: Group, b: Group) => {
    const damageToA = calculateDamage(attacker, a);
    const damageToB = calculateDamage(attacker, b);

    if (damageToA !== damageToB) {
      return damageToB - damageToA;
    }

    return sortByEffectivePower(a, b) || sortByInitiative(a, b);
  };
}
//#endregion

//#region Simulation

/**
 * Returns a map of attacking groups to defending groups
 * Sorting is handled internally
 */
function selectTargets(groups: Array<Group>): Map<Group, Group> {
  const sortedGroups = groups.sort(sortByEffectivePower);
  const targetMap = new Map<Group, Group>();
  const hasBeenTargeted = new Set<Group>();

  for (const group of sortedGroups) {
    if (group.unitCount === 0) {
      continue;
    }

    const enemyGroups = groups
      .filter((potentialTarget) => {
        return (
          potentialTarget.unitCount > 0 &&
          potentialTarget.allegiance !== group.allegiance &&
          !hasBeenTargeted.has(potentialTarget)
        );
      })
      .sort(sortByDamage(group));

    if (enemyGroups.length === 0) {
      continue;
    }

    const target = enemyGroups[0];
    const potentialDamage = calculateDamage(group, target);
    if (potentialDamage === 0) {
      continue;
    }
    targetMap.set(group, target);
    hasBeenTargeted.add(target);
  }

  return targetMap;
}

/**
 * Performs attacks and returns true if any unit died.
 * If no unit died we can assume that the game is in a stalemate
 */
function performAttacks(groups: Array<Group>, targetMap: Map<Group, Group>) {
  groups.sort(sortByInitiative);
  let unitKilled = false;
  for (const group of groups) {
    if (group.unitCount === 0) {
      continue;
    }

    const target = targetMap.get(group);
    if (!target) {
      continue;
    }

    const damage = calculateDamage(group, target);

    if (damage === 0) {
      continue;
    }

    const unitsKilled = Math.min(
      Math.floor(damage / target.hp),
      target.unitCount
    );

    if (unitsKilled > 0) {
      unitKilled = true;
    }

    target.unitCount -= unitsKilled;
  }

  return unitKilled;
}

/**
 * Performs one round of target selection and attacks
 * Returns true if the game is in a stalemate
 */
function fight(groups: Array<Group>) {
  const targetMap = selectTargets(groups);
  return performAttacks(groups, targetMap);
}

/**
 * Returns true if only one allegiance has any units left
 */
function hasOnlySingleAliveAllegiance(
  groups: Array<Group>,
  allegiance?: string
) {
  const aliveSet = new Set(
    groups.filter((g) => g.unitCount > 0).map((g) => g.allegiance)
  );

  if (allegiance) {
    return aliveSet.size === 1 && aliveSet.has(allegiance);
  }

  return aliveSet.size === 1;
}

//#endregion

function countUnits(groups: Array<Group>) {
  return sum(groups.map((g) => g.unitCount));
}

function solveFirst(groups: Array<Group>) {
  // Just simulate entire fight and return count of alive units
  const copy = groups.slice().map((g) => ({ ...g }));
  while (!hasOnlySingleAliveAllegiance(copy)) {
    fight(copy);
  }

  return countUnits(copy);
}

function solveSecond(groups: Array<Group>) {
  // No fancy binary search here, since problem is not necessarily monotonic
  // Instead we brute force by incrementing the damage boost until we win

  const TEAM_THAT_SHOULD_WIN = "Immune System";
  let damageBoost = 1;

  while (true) {
    // Create a copy of the groups and apply the damage boost
    const groupsCopy = groups.map((g) => ({
      ...g,
      damage:
        g.allegiance === TEAM_THAT_SHOULD_WIN
          ? g.damage + damageBoost
          : g.damage,
    }));

    // Simulate the entire battle
    while (!hasOnlySingleAliveAllegiance(groupsCopy)) {
      if (!fight(groupsCopy)) {
        break;
      }
    }

    // If the immune system won, return the count of alive units
    if (hasOnlySingleAliveAllegiance(groupsCopy, TEAM_THAT_SHOULD_WIN)) {
      return countUnits(groupsCopy);
    }

    // No cigar, increment the damage boost and try again
    damageBoost++;
  }
}

export default createSolverWithLineArray(async (input) => {
  const groups = parse(input);

  return {
    first: solveFirst(groups),
    second: solveSecond(groups),
  };
});
