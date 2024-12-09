import { min } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

interface Spell {
  readonly name: string;
  readonly cost: number;
  readonly damage: number;
  readonly heal: number;
  readonly manaRegen: number;
  readonly armor: number;
  readonly duration: number;
}

const SPELLS: Array<Spell> = [
  {
    name: "Magic Missile",
    cost: 53,
    damage: 4,
    heal: 0,
    manaRegen: 0,
    armor: 0,
    duration: 1,
  },
  {
    name: "Drain",
    cost: 73,
    damage: 2,
    heal: 2,
    manaRegen: 0,
    armor: 0,
    duration: 1,
  },
  {
    name: "Shield",
    cost: 113,
    damage: 0,
    heal: 0,
    manaRegen: 0,
    armor: 7,
    duration: 6,
  },
  {
    name: "Poison",
    cost: 173,
    damage: 3,
    heal: 0,
    manaRegen: 0,
    armor: 0,
    duration: 6,
  },
  {
    name: "Recharge",
    cost: 229,
    damage: 0,
    heal: 0,
    manaRegen: 101,
    armor: 0,
    duration: 5,
  },
];

interface SimulationState {
  readonly turn: number;
  readonly wizardHp: number;
  readonly wizardMana: number;
  readonly bossHp: number;
  readonly bossDamage: number;
  readonly activeSpells: ReadonlyArray<Spell>;
  readonly manaSpent: number;
}

function createSimulator(hardmode: boolean) {
  let minManaSpent = Infinity;

  return function* simulate(
    state: Readonly<SimulationState>
  ): Generator<number> {
    if (state.manaSpent >= minManaSpent) {
      return;
    }

    const wizardTurn = state.turn % 2 === 0;

    if (wizardTurn && hardmode && state.wizardHp === 1) {
      // wizard died due to hardmode hp loss
      return;
    }

    // Apply effects
    let {
      mana: currentMana,
      damage: poisonDamage,
      armor,
    } = state.activeSpells.reduce(
      (acc, spell) => {
        return {
          mana: acc.mana + spell.manaRegen,
          damage: acc.damage + spell.damage,
          armor: acc.armor + spell.armor,
        };
      },
      { mana: state.wizardMana, damage: 0, armor: 0 }
    );

    const currentBossHp = state.bossHp - poisonDamage;

    if (currentBossHp <= 0) {
      minManaSpent = state.manaSpent;
      return yield state.manaSpent;
    }

    const activeSpells = state.activeSpells
      .map((spell) => ({ ...spell, duration: spell.duration - 1 }))
      .filter((spell) => spell.duration > 0);

    if (wizardTurn) {
      const castableSpells = SPELLS.filter(
        (s) =>
          s.cost <= state.wizardMana &&
          !activeSpells.some((spell) => spell.name === s.name)
      );

      if (castableSpells.length === 0) {
        return;
      }

      for (const spell of castableSpells) {
        const newActiveSpells = activeSpells.slice();
        const newManaSpent = state.manaSpent + spell.cost;

        let newWizardMana = currentMana - spell.cost;
        let newWizardHp = state.wizardHp - (hardmode ? 1 : 0);
        let newBossHp = currentBossHp;
        if (spell.duration === 1) {
          newWizardMana += spell.manaRegen;
          newWizardHp += spell.heal;
          newBossHp -= spell.damage;

          if (newBossHp <= 0) {
            // boss died to spell
            minManaSpent = newManaSpent;
            return yield newManaSpent;
          }
        } else {
          newActiveSpells.push(spell);
        }

        yield* simulate({
          turn: state.turn + 1,
          wizardHp: newWizardHp,
          wizardMana: newWizardMana,
          bossHp: newBossHp,
          bossDamage: state.bossDamage,
          activeSpells: newActiveSpells,
          manaSpent: newManaSpent,
        });
      }
    } else {
      const damage = Math.max(1, state.bossDamage - armor);
      const newWizardHp = state.wizardHp - damage;

      if (newWizardHp <= 0) {
        // wizard died
        return;
      }

      yield* simulate({
        turn: state.turn + 1,
        wizardHp: newWizardHp,
        wizardMana: currentMana,
        bossHp: currentBossHp,
        bossDamage: state.bossDamage,
        activeSpells: activeSpells.slice(),
        manaSpent: state.manaSpent,
      });
    }
  };
}

export default createSolverWithLineArray(async (input) => {
  const [bossHp, bossDamage] = input.map((l) =>
    Number.parseInt(l.split(": ")[1], 10)
  );

  const initialState = {
    turn: 0,
    wizardHp: 50,
    wizardMana: 500,
    bossHp,
    bossDamage,
    activeSpells: [],
    manaSpent: 0,
  };

  const simulatePart1 = createSimulator(false);
  const simulatePart2 = createSimulator(true);

  return {
    first: min(simulatePart1(initialState), -1),
    second: min(simulatePart2(initialState), -1),
  };
});
