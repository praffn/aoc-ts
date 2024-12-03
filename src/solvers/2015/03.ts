import { createSolverWithString } from "../../solution";

function deliverPresents(directions: string): Map<string, number> {
  const giftMap = new Map<string, number>();

  let x = 0;
  let y = 0;

  giftMap.set("0,0", 1);

  for (const direction of directions) {
    switch (direction) {
      case "^":
        y++;
        break;
      case "v":
        y--;
        break;
      case ">":
        x++;
        break;
      case "<":
        x--;
        break;
    }

    const key = `${x},${y}`;
    giftMap.set(key, (giftMap.get(key) ?? 0) + 1);
  }

  return giftMap;
}

function deliverPresentsWithRobot(directions: string): Map<string, number> {
  const giftMap = new Map<string, number>();

  let santa = { x: 0, y: 0 };
  let robot = { x: 0, y: 0 };

  giftMap.set("0,0", 2);

  for (let i = 0; i < directions.length; i++) {
    const actor = i % 2 === 0 ? santa : robot;

    switch (directions[i]) {
      case "^":
        actor.y++;
        break;
      case "v":
        actor.y--;
        break;
      case ">":
        actor.x++;
        break;
      case "<":
        actor.x--;
        break;
    }

    const key = `${actor.x},${actor.y}`;
    giftMap.set(key, (giftMap.get(key) ?? 0) + 1);
  }

  return giftMap;
}

export default createSolverWithString(async (input) => {
  const onlySanta = deliverPresents(input);
  const santaAndRobot = deliverPresentsWithRobot(input);

  const first = onlySanta.size;
  const second = santaAndRobot.size;

  return {
    first,
    second,
  };
});
