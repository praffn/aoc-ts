import { product } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

interface Item {
  cost: number;
  damage: number;
  armor: number;
}

const weapons: Array<Item> = [
  { cost: 8, damage: 4, armor: 0 },
  { cost: 10, damage: 5, armor: 0 },
  { cost: 25, damage: 6, armor: 0 },
  { cost: 40, damage: 7, armor: 0 },
  { cost: 74, damage: 8, armor: 0 },
];

const armor: Array<Item> = [
  { cost: 0, damage: 0, armor: 0 }, // <-- "optional" armor
  { cost: 13, damage: 0, armor: 1 },
  { cost: 31, damage: 0, armor: 2 },
  { cost: 53, damage: 0, armor: 3 },
  { cost: 75, damage: 0, armor: 4 },
  { cost: 102, damage: 0, armor: 5 },
];

const rings: Array<Item> = [
  { cost: 0, damage: 0, armor: 0 }, // <-- "optional" ring
  { cost: 25, damage: 1, armor: 0 },
  { cost: 50, damage: 2, armor: 0 },
  { cost: 100, damage: 3, armor: 0 },
  { cost: 20, damage: 0, armor: 1 },
  { cost: 40, damage: 0, armor: 2 },
  { cost: 80, damage: 0, armor: 3 },
];

interface Unit {
  hp: number;
  damage: number;
  armor: number;
}

function calculateMoves(attacker: Unit, defender: Unit) {
  return Math.ceil(defender.hp / Math.max(attacker.damage - defender.armor, 1));
}

function playerWins(player: Unit, boss: Unit): boolean {
  return calculateMoves(player, boss) <= calculateMoves(boss, player);
}

export default createSolverWithLineArray(async (input) => {
  const values = input.map((line) => Number.parseInt(line.split(": ")[1], 10));
  let boss: Unit = { hp: values[0], damage: values[1], armor: values[2] };

  let leastGoldForWin = Infinity;
  let maxGoldForLoss = -Infinity;

  for (const combination of product(weapons, armor, rings, rings)) {
    const [weapon, armorItem, ring1, ring2] = combination;

    // duplicate rings are not allowed
    if (ring1 === ring2) {
      continue;
    }

    const cost = weapon.cost + armorItem.cost + ring1.cost + ring2.cost;

    const player: Unit = {
      hp: 100,
      damage: weapon.damage + ring1.damage + ring2.damage,
      armor: armorItem.armor + ring1.armor + ring2.armor,
    };

    if (playerWins(player, boss)) {
      leastGoldForWin = Math.min(leastGoldForWin, cost);
    } else {
      maxGoldForLoss = Math.max(maxGoldForLoss, cost);
    }
  }

  return {
    first: leastGoldForWin,
    second: maxGoldForLoss,
  };
});
