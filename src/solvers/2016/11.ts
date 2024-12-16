import { chain, combinations } from "../../lib/iter";
import { createSolver } from "../../solution";

type Item = {
  element: string;
  type: "generator" | "microchip";
};

type Floor = Array<Item>;

function isSafeFloor(floor: Floor) {
  // empty floors are always safe
  if (floor.length === 0) {
    return true;
  }

  // floors with only a single type of item are always safe
  const types = new Set(floor.map((item) => item.type));
  if (types.size === 1) {
    return true;
  }

  // floors with generators and microchips are safe if all microchips have a
  // corresponding generator
  const generators = floor.filter((item) => item.type === "generator");
  const microchips = floor.filter((item) => item.type === "microchip");
  for (const microchip of microchips) {
    if (
      !generators.some((generator) => generator.element === microchip.element)
    ) {
      return false;
    }
  }

  return true;
}

type State = {
  currentFloorNumber: number;
  floors: Array<Floor>;
  moves: number;
};

// Thanks for the enormous help https://eddmann.com/posts/advent-of-code-2016-day-11-radioisotope-thermoelectric-generators/
function* nextStates(currentState: State): Iterable<State> {
  const { currentFloorNumber, floors, moves } = currentState;

  const possibleMoves = chain(
    combinations(floors[currentFloorNumber], 2),
    combinations(floors[currentFloorNumber], 1)
  );

  for (const move of possibleMoves) {
    for (const direction of [-1, 1]) {
      const nextFloorNumber = currentFloorNumber + direction;
      if (nextFloorNumber < 0 || nextFloorNumber >= floors.length) {
        continue;
      }

      const nextFloors = [...floors];
      nextFloors[currentFloorNumber] = nextFloors[currentFloorNumber].filter(
        (item) => {
          return !move.includes(item);
        }
      );
      nextFloors[nextFloorNumber] = [...nextFloors[nextFloorNumber], ...move];

      if (
        isSafeFloor(nextFloors[currentFloorNumber]) &&
        isSafeFloor(nextFloors[nextFloorNumber])
      ) {
        yield {
          currentFloorNumber: nextFloorNumber,
          floors: nextFloors,
          moves: moves + 1,
        };
      }
    }
  }
}

// Returns true if all floors except the last one are empty
function isFinished(floors: Array<Floor>) {
  return floors.slice(0, -1).every((floor) => floor.length === 0);
}

// Returns a "quasi-unique" key for a state.
// To unique states are considered _equivalent_ if they have the same number of
// generators and microchips on each floor. This way we can avoid visiting
// states that are equivalent to ones we have already visited.
function stateKey(state: State) {
  const floorKeys = state.floors.map((floor) => {
    let generators = 0;
    let microchips = 0;
    for (const item of floor) {
      if (item.type === "generator") {
        generators++;
      } else {
        microchips++;
      }
    }
    return `g:${generators},m:${microchips}`;
  });

  return `${state.currentFloorNumber}|${floorKeys.join(",")}`;
}

function minMoves(floors: Array<Floor>) {
  const seen = new Set<string>();
  const queue = [{ currentFloorNumber: 0, floors, moves: 0 }];

  while (queue.length > 0) {
    const currentState = queue.shift()!;
    if (isFinished(currentState.floors)) {
      return currentState.moves;
    }

    for (const nextState of nextStates(currentState)) {
      const key = stateKey(nextState);
      if (!seen.has(key)) {
        seen.add(key);
        queue.push(nextState);
      } else {
      }
    }
  }

  return -1;
}

const floorRegex =
  /(?:(?<microchip>[^\s]+)-compatible)|(?:(?<generator>[^\s]+) generator)/g;

export default createSolver(async (input) => {
  const floors: Array<Floor> = [];

  for await (const line of input) {
    const floor: Floor = [];
    for (const match of line.matchAll(floorRegex)) {
      if (match.groups?.microchip) {
        floor.push({
          element: match.groups.microchip,
          type: "microchip",
        });
      }
      if (match.groups?.generator) {
        floor.push({
          element: match.groups.generator,
          type: "generator",
        });
      }
    }
    floors.push(floor);
  }

  const first = minMoves(floors);

  // add the extra items
  floors[0].push(
    { element: "elerium", type: "generator" },
    {
      element: "elerium",
      type: "microchip",
    },
    {
      element: "dilithium",
      type: "generator",
    },
    {
      element: "dilithium",
      type: "microchip",
    }
  );

  const second = minMoves(floors);

  return {
    first,
    second,
  };
});
