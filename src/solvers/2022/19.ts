import { Queue } from "../../lib/collections/queue";
import { numericProduct, sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

// Thanks to NickyMeuleman for the inspiration
// https://nickymeuleman.netlify.app/blog/aoc2022-day19/

/**
 * A blue print is represented as 4-element array of "costs" for each type of
 * robot: 0: ore, 1: clay, 2: obsidian, 3: geode.
 * Each cost is also a 4-element array of the cost of each resource:
 * 0: ore, 1: clay, 2: obsidian, 3: geode.
 */
type Blueprint = Array<Array<number>>;

/**
 * The state used throughout the simulation.
 */
type State = {
  inventory: Array<number>;
  robots: Array<number>;
  timeElapsed: number;
};

function createInitialState(): State {
  // we start each simultation with a single ore robot
  return {
    inventory: [0, 0, 0, 0],
    robots: [1, 0, 0, 0],
    timeElapsed: 0,
  };
}
/**
 * Parse a string into a blueprint
 */
function parseBlueprint(line: string): Blueprint {
  const numbers = line.match(/\d+/g)!.map(Number);
  const oreRobot = [numbers[1], 0, 0, 0];
  const clayRobot = [numbers[2], 0, 0, 0];
  const obsidianRobot = [numbers[3], numbers[4], 0, 0];
  const geodeRobot = [numbers[5], 0, numbers[6], 0];

  return [oreRobot, clayRobot, obsidianRobot, geodeRobot];
}

/**
 * Returns the maximum amount that should be created for each type of robot.
 * As we're always looking for the maximum geodes, we dont have a max for it
 */
function getMaxRobots(blueprint: Blueprint): Array<number> {
  return [
    Math.max(...blueprint.map((r) => r[0])),
    Math.max(...blueprint.map((r) => r[1])),
    Math.max(...blueprint.map((r) => r[2])),
    Infinity,
  ];
}

/**
 * Runs the simultation for a given blueprint and maximum time, returning the
 * maximum possible amount of geodes that can be created.
 */
function getMaxGeodes(blueprint: number[][], maxTime: number): number {
  const maxRobots = getMaxRobots(blueprint);
  let maxGeodes = 0;

  // setup classic bfs
  const queue = new Queue<State>();
  queue.enqueue(createInitialState());

  while (!queue.isEmpty()) {
    const { inventory, robots, timeElapsed } = queue.dequeue();

    // lets go through each type of robot
    // for (const i of range(blueprint.length)) {
    for (let i = 0; i < 4; i++) {
      if (robots[i] === maxRobots[i]) {
        // if we already have the max amount of this robot we can skip
        continue;
      }

      // now lets figure out the costs
      const costs = blueprint[i];
      // and the wait time until we can afford to build this robot
      const waitTime = Math.max(
        // we're gonna go through each material (except geodes)
        ...[0, 1, 2].map((i) => {
          if (costs[i] <= inventory[i]) {
            // we already have enough of this material, no need to wait
            return 0;
          }

          if (robots[i] === 0) {
            // we don't even have the type of robot that would collect this
            // material, so waiting would be pointless
            return maxTime + 1;
          }

          // otherwise we have wait until our current robots for this type have
          // had time to collect enough of this material
          return Math.floor(
            (costs[i] - inventory[i] + robots[i] - 1) / robots[i]
          );
        })
      );

      // now update the time elapsed -- it also take 1 unit of time to build the
      // robot after we've collected all the materials
      const newTimeElapsed = timeElapsed + waitTime + 1;
      if (newTimeElapsed >= maxTime) {
        // damn, we're out of time
        continue;
      }

      // ok we know which robot to build, how long time it will take and how
      // many resources we will have left after building it. Lets update state:

      // update inventory to add the resources we've collected in the wait time,
      // and subtract the resources we've used to build
      const newInventory = inventory.map(
        (amount, idx) => amount + robots[idx] * (waitTime + 1) - costs[idx]
      );

      // update bots, adding the bot we've just built
      const newBots = robots.with(i, robots[i] + 1);

      // extra optimization: if we theoretically can't get more geodes than we
      // already have, we can skip this state
      const remainingTime = maxTime - newTimeElapsed;
      if (
        ((remainingTime - 1) * remainingTime) / 2 +
          newInventory[3] +
          remainingTime * newBots[3] <
        maxGeodes
      ) {
        continue;
      }

      // lets go again
      queue.enqueue({
        inventory: newInventory,
        robots: newBots,
        timeElapsed: newTimeElapsed,
      });
    }

    // update max geodes
    const geodes = inventory[3] + robots[3] * (maxTime - timeElapsed);
    maxGeodes = Math.max(geodes, maxGeodes);
  }

  return maxGeodes;
}

export default createSolverWithLineArray(async (input) => {
  const blueprints = input.map(parseBlueprint);

  const first = sum(blueprints.map((b, i) => getMaxGeodes(b, 24) * (i + 1)));
  const second = numericProduct(
    blueprints.slice(0, 3).map((b) => getMaxGeodes(b, 32))
  );

  return {
    first,
    second,
  };
});
