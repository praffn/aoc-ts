import { mapIncrement } from "../../lib/dicts";
import { sum } from "../../lib/iter";
import { createSolver } from "../../solution";

/**
 * Returns true if all sets in the map have a size of 1.
 */
function isFlat(map: Map<unknown, Set<unknown>>) {
  return map.entries().every(([_, set]) => set.size === 1);
}

/**
 * Prunes the allergen candidates until each allergen has only one candidate.
 */
function prune(allergenCandidates: Map<string, Set<string>>) {
  while (!isFlat(allergenCandidates)) {
    for (const [allergen, candidates] of allergenCandidates.entries()) {
      if (candidates.size === 1) {
        const candidate = candidates.values().next().value!;
        for (const [
          otherAllergen,
          otherCandidates,
        ] of allergenCandidates.entries()) {
          if (otherAllergen !== allergen) {
            otherCandidates.delete(candidate);
          }
        }
      }
    }
  }
}

const re = /([^(]+) \(contains ([^)]+)\)/;
export default createSolver(async (input) => {
  // Maps each food to the number of times it appears in the input.
  const foodOccurrences = new Map<string, number>();
  // Maps each allergen to the set of ingredients that could contain it.
  const allergenCandidates = new Map<string, Set<string>>();

  for await (const line of input) {
    const [, ingredientsStr, allergensStr] = line.match(re)!;
    const ingredients = new Set(ingredientsStr.split(" "));
    const allergens = allergensStr.split(", ");

    // Increment the occurrences of each ingredient.
    for (const ingredient of ingredients) {
      mapIncrement(foodOccurrences, ingredient);
    }

    // For each allergen, intersect the ingredients that could contain it.
    // (or add them if it's the first time we see the allergen)
    for (const allergen of allergens) {
      const currentCandidates = allergenCandidates.get(allergen);
      allergenCandidates.set(
        allergen,
        currentCandidates
          ? currentCandidates.intersection(ingredients)
          : new Set(ingredients)
      );
    }
  }

  // Lets prune the allergen candidates until each allergen has only one candidate.
  prune(allergenCandidates);
  // Make it into a flat set of allergens.
  const allergens = new Set(allergenCandidates.values().flatMap((s) => s));
  // which allows use to get the non-allergens.
  const nonAllergens = new Set(foodOccurrences.keys()).difference(allergens);
  // and map non-allergens to their occurence
  const nonAllergensOccurrences = Array.from(nonAllergens).map(
    (ingredient) => foodOccurrences.get(ingredient)!
  );
  // which we can sum to get the first result.
  const nonAllergensOccurrencesTotal = sum(nonAllergensOccurrences);

  // Second part is just ordering all allergens by name, and then joining
  // their only candidate ingredient.
  const canonicalList = Array.from(allergenCandidates.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([_, candidates]) => candidates.values().next().value)
    .join(",");

  return {
    first: nonAllergensOccurrencesTotal,
    second: canonicalList,
  };
});
