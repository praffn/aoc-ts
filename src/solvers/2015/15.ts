import { createSolver } from "../../solution";

interface Ingredient {
  name: string;
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
  calories: number;
}

function parseIngredient(input: string): Ingredient {
  const parts = input.split(" ");
  const name = parts[0].slice(0, -1);
  const capacity = Number.parseInt(parts[2], 10);
  const durability = Number.parseInt(parts[4], 10);
  const flavor = Number.parseInt(parts[6], 10);
  const texture = Number.parseInt(parts[8], 10);
  const calories = Number.parseInt(parts[10], 10);

  return {
    name,
    capacity,
    durability,
    flavor,
    texture,
    calories,
  };
}

// Thanks to Edd Mann for the idea of using a generator like this
// https://eddmann.com/posts/advent-of-code-2015-day-15-science-for-hungry-people/
function* mixtures(
  teaspoons: number,
  ingredients: number
): Generator<Array<number>> {
  if (ingredients === 1) {
    return yield [teaspoons];
  }

  for (let quantity = 0; quantity <= teaspoons; quantity++) {
    for (const mixture of mixtures(teaspoons - quantity, ingredients - 1)) {
      yield [quantity, ...mixture];
    }
  }
}

function calculateCookieScore(
  mixture: Array<number>,
  ingredients: Array<Ingredient>
): [number, number] {
  let capacity = 0;
  let durability = 0;
  let flavor = 0;
  let texture = 0;
  let calories = 0;

  for (let i = 0; i < ingredients.length; i++) {
    const ingredient = ingredients[i];
    const quantity = mixture[i];
    capacity += ingredient.capacity * quantity;
    durability += ingredient.durability * quantity;
    flavor += ingredient.flavor * quantity;
    texture += ingredient.texture * quantity;
    calories += ingredient.calories * quantity;
  }

  return [
    Math.max(0, capacity) *
      Math.max(0, durability) *
      Math.max(0, flavor) *
      Math.max(0, texture),
    calories,
  ];
}

export default createSolver(async (input) => {
  const ingredients: Array<Ingredient> = [];

  for await (const line of input) {
    const ingredient = parseIngredient(line);
    ingredients.push(ingredient);
  }

  let maxCookieScore = -Infinity;
  let maxCookieScoreWithCalories = -Infinity;

  for (const mixture of mixtures(100, ingredients.length)) {
    const [score, totalCalories] = calculateCookieScore(mixture, ingredients);
    maxCookieScore = Math.max(maxCookieScore, score);
    if (totalCalories === 500) {
      maxCookieScoreWithCalories = Math.max(maxCookieScoreWithCalories, score);
    }
  }

  return {
    first: maxCookieScore,
    second: maxCookieScoreWithCalories,
  };
});
