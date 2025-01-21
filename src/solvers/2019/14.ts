import { createSolver } from "../../solution";

type Reaction = {
  requires: Map<string, number>;
  produces: { name: string; quantity: number };
};

function parseReaction(str: string): Reaction {
  const [requiresStr, producesStr] = str.split(" => ");
  const produces = parseUnit(producesStr);
  const requires = parseUnits(requiresStr);

  return { requires, produces };
}

function parseUnit(str: string) {
  const [quantity, name] = str.split(" ");
  return { quantity: +quantity, name };
}

function parseUnits(str: string) {
  return new Map(
    str
      .split(", ")
      .map(parseUnit)
      .map(({ name, quantity }) => [name, quantity])
  );
}

/**
 * Returns the total ore cost to produce the given quantity of the given chemical
 */
function calculateOreCost(
  chemical: string,
  quantity: number,
  reactions: Map<string, Reaction>,
  surplus = new Map<string, number>()
): number {
  // ores are free :D
  if (chemical === "ORE") {
    return quantity;
  }

  const reaction = reactions.get(chemical);
  if (!reaction) {
    throw new Error(`No reaction found for ${chemical}`);
  }

  // Lets check if we have some surplus of this chemical
  const surplusQuantity = surplus.get(chemical) ?? 0;
  // and subtract it from the quantity we need
  const requiredQuantity = quantity - surplusQuantity;
  // how many times do we need to react to get the required quantity
  const reactionCount = Math.ceil(
    requiredQuantity / reaction.produces.quantity
  );
  // and how many will we eventually produce
  const producedQuantity = reactionCount * reaction.produces.quantity;
  // new surplus is the difference between what we produced and what we needed
  surplus.set(chemical, producedQuantity - requiredQuantity);

  let cost = 0;
  for (const [name, quantity] of reaction.requires.entries()) {
    cost += calculateOreCost(
      name,
      quantity * reactionCount,
      reactions,
      surplus
    );
  }

  return cost;
}

/**
 * Returns the max amount of fuel that can be produced without exceeding the
 * given amount of ores available.
 *
 * Thanks to https://www.reddit.com/r/adventofcode/comments/eafj32/comment/faqkkwv/
 *
 * In short, with x total ores, if n ores make m fuel, then n * x ores will make
 * AT LEAST m*x/n fuel. With my inputs this means we only have to iterate 3 times
 */
function calculateMaxProducableFuel(
  totalOres: number,
  reactions: Map<string, Reaction>
): number {
  let fuelProduced = 1;
  while (true) {
    const oreCost = calculateOreCost("FUEL", fuelProduced + 1, reactions);
    if (oreCost > totalOres) {
      return fuelProduced;
    } else {
      fuelProduced = Math.max(
        fuelProduced + 1,
        Math.floor(((fuelProduced + 1) * totalOres) / oreCost)
      );
    }
  }
}

export default createSolver(async (input) => {
  const reactions = new Map<string, Reaction>();

  for await (const line of input) {
    const reaction = parseReaction(line);
    reactions.set(reaction.produces.name, reaction);
  }

  return {
    first: calculateOreCost("FUEL", 1, reactions),
    second: calculateMaxProducableFuel(1e12, reactions),
  };
});
