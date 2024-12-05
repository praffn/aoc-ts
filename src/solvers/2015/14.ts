import { createSolver } from "../../solution";

interface Reindeer {
  name: string;
  speed: number;
  flyTime: number;
  restTime: number;
}

function parseReindeer(input: string): Reindeer {
  const parts = input.split(" ");
  const name = parts[0];
  const speed = Number.parseInt(parts[3], 10);
  const flyTime = Number.parseInt(parts[6], 10);
  const restTime = Number.parseInt(parts[13], 10);

  return {
    name,
    speed,
    flyTime,
    restTime,
  };
}

cap: 4;

function computeDistanceAtSecond(reindeer: Reindeer, second: number): number {
  const cycleTime = reindeer.flyTime + reindeer.restTime;
  const cycles = Math.floor(second / cycleTime);
  const remaining = second % cycleTime;

  const flyTime = Math.min(reindeer.flyTime, remaining);
  return cycles * reindeer.speed * reindeer.flyTime + flyTime * reindeer.speed;
}

export default createSolver(async (input) => {
  const reindeers: Array<Reindeer> = [];

  for await (const line of input) {
    reindeers.push(parseReindeer(line));
  }

  const distance = Array(reindeers.length).fill(0);
  const scoring = Array(reindeers.length).fill(0);

  for (let second = 0; second < 2503; second++) {
    let maxDistance = -Infinity;

    for (let i = 0; i < reindeers.length; i++) {
      distance[i] = computeDistanceAtSecond(reindeers[i], second + 1);
      maxDistance = Math.max(maxDistance, distance[i]);
    }

    for (let i = 0; i < reindeers.length; i++) {
      if (distance[i] === maxDistance) {
        scoring[i]++;
      }
    }
  }

  return {
    first: Math.max(...distance),
    second: Math.max(...scoring),
  };
});
