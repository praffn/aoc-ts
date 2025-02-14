import { ComparePriorityQueue } from "../../lib/collections/compare-priority-queue";
import { zip } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

/*
 * I struggled with this.
 * Thanks to:
 * - eddmann
 *   For the general logic of state transitions:
 *   https://github.com/eddmann/advent-of-code/blob/master/2021/python/src/day23/solution-1.py
 * - mesoptier
 *   For the idea of encoding the state into a number:
 *   https://www.reddit.com/r/adventofcode/comments/rmnozs/comment/hpqo1i2
 */

//#region State

// Amber = 0, Bronze = 1, Copper = 2, Desert = 3
type Amphipod = 0 | 1 | 2 | 3;
const Empty = Symbol("Empty");
type Empty = typeof Empty;

type State = {
  hallway: Array<Amphipod | Empty>;
  rooms: Array<Array<Amphipod>>;
};

/**
 * Returns the amount of energy required to move an amphipod one step
 */
function getEnergyCost(amphipod: Amphipod) {
  return 10 ** amphipod;
}

/**
 * Returns the x position (in the hallway) to the room of the same type as the
 * amphipod.
 */
function roomX(amphipod: Amphipod): number {
  return 2 + amphipod * 2;
}

/**
 * Returns true if every room is filled with only the correct amphipods for the
 * room type.
 */
function isComplete(state: State, perRoom: number) {
  return state.rooms.every((room, roomIndex) => {
    return (
      room.length === perRoom &&
      room.every((amphipod) => amphipod === roomIndex)
    );
  });
}

/**
 * Encodes a space in the state into a number
 * Empty = 0
 * Amphipod = Amphipod + 1
 */
function encodeSpace(space: Amphipod | Empty) {
  if (space === Empty || space === undefined) return 0n;
  return BigInt(space + 1);
}

/**
 * Encodes an entire state into a unique number.
 * This is much faster than any string/json encoding.
 */
function encodeState(state: State, roomSize: number) {
  let encoded = 0n;

  for (let i = state.rooms.length - 1; i >= 0; i--) {
    for (let j = roomSize - 1; j >= 0; j--) {
      encoded = encoded * 5n + encodeSpace(state.rooms[i][j]);
    }
  }

  for (let i = state.hallway.length - 1; i >= 0; i--) {
    encoded = encoded * 5n + encodeSpace(state.hallway[i]);
  }

  return encoded;
}

//#endregion

//#region Parsing

function cToAmphipod(c: string): Amphipod | null {
  switch (c) {
    case "A":
      return 0;
    case "B":
      return 1;
    case "C":
      return 2;
    case "D":
      return 3;
    default:
      return null;
  }
}

function parse(input: Array<string>): State {
  const hallway = input[1]
    .slice(1, -1)
    .split("")
    .map((c) => cToAmphipod(c) ?? Empty);
  const topRooms = input[2]
    .split("")
    .filter((c) => c !== "#" && c !== " ")
    .map((c) => cToAmphipod(c)!);
  const bottomRooms = input[3]
    .split("")
    .filter((c) => c !== "#" && c !== " ")
    .map((c) => cToAmphipod(c)!);

  const rooms = Array.from(zip(topRooms, bottomRooms));

  return { hallway, rooms };
}

/**
 * Returns a new state where the rooms are unfolded, ie. the following amphipods
 * have been inserted into the middle of every room:
 *
 *     D  C  B  A
 *     D  B  A  C
 */
function unfold(initialState: State) {
  const unfoldedRooms = [
    initialState.rooms[0].toSpliced(1, 0, 3, 3),
    initialState.rooms[1].toSpliced(1, 0, 2, 1),
    initialState.rooms[2].toSpliced(1, 0, 1, 0),
    initialState.rooms[3].toSpliced(1, 0, 0, 2),
  ];

  return { hallway: initialState.hallway, rooms: unfoldedRooms };
}

//#endregion

type Transition = [cost: number, state: State];

/**
 * Returns an iterator over all possible transition moves from hallway to room.
 */
function* hallwayTransitions(
  state: State,
  roomSize: number
): Generator<Transition> {
  const { hallway, rooms } = state;

  // Lets go through each x position in the hallway
  for (let hallPosition = 0; hallPosition < hallway.length; hallPosition++) {
    const amphipod = hallway[hallPosition];
    // if the space is empty, we can't move anything
    if (amphipod === Empty) continue;

    // how many amphipods are in the room
    const roomOccupancy = rooms[amphipod].length;
    // if full we can't move anything
    if (roomOccupancy === roomSize) continue;
    // if the room contains an amphipod that is not of that room type we cannot
    // move there (we would block the room)
    if (
      roomOccupancy > 0 &&
      rooms[amphipod].some((other) => other !== amphipod)
    )
      continue;

    // now lets try moving the amphipod towards the room
    let currentPosition = hallPosition;
    const targetPosition = roomX(amphipod);
    // our direction
    const step = targetPosition > hallPosition ? 1 : -1;
    let energyUsed = 0;
    let blocked = false;

    while (currentPosition !== targetPosition) {
      currentPosition += step;
      energyUsed += getEnergyCost(amphipod);
      // if another amphipod is in the way we can't move
      if (hallway[currentPosition] !== Empty) {
        blocked = true;
        break;
      }
    }
    if (blocked) continue;

    // lets also add the energy spent moving into the room
    energyUsed += (roomSize - roomOccupancy) * getEnergyCost(amphipod);

    const newHallway = [...hallway];
    newHallway[hallPosition] = Empty;

    const newRooms = rooms.map((room) => [...room]);
    newRooms[amphipod] = [amphipod, ...newRooms[amphipod]];

    yield [energyUsed, { hallway: newHallway, rooms: newRooms }];
  }
}

/**
 * Returns an iterator over all possible transition moves from room to hallway.
 */
function* roomTransitions(
  state: State,
  roomSize: number
): Generator<Transition> {
  const { hallway, rooms } = state;

  // lets go through each room
  for (let roomIndex = 0; roomIndex < rooms.length; roomIndex++) {
    const room = rooms[roomIndex];
    // if the room is empty we can't move anything
    if (room.length === 0) continue;

    // the index of the room is the type of amphipod, lets just cast it
    const amphipodType = roomIndex as Amphipod;

    // if all amphipods in the room are correctly placed we can't move anything
    if (room.every((amphipod) => amphipod === amphipodType)) {
      continue;
    }

    // the steps required to move an amphipod out of the room
    const steps = roomSize - room.length + 1;

    // we can move to several positions in the hallway, so we will
    // try them all (except positions with room entrances (2, 4, 6, 8))
    const nextMoves: Array<[x: number, steps: number]> = [];

    // Move left in the hallway
    let leftSteps = steps;
    let currentPosition = roomX(amphipodType) - 1;
    while (currentPosition >= 0) {
      // if there is an amphipod in the way we can't move
      if (hallway[currentPosition] !== Empty) break;
      leftSteps++;
      if (![2, 4, 6, 8].includes(currentPosition)) {
        // valid position, lets add it to the list of possible moves
        nextMoves.push([currentPosition, leftSteps]);
      }
      currentPosition--;
    }

    // Move right in the hallway
    // (same as above but in the other direction)
    let rightSteps = steps;
    currentPosition = roomX(amphipodType) + 1;
    while (currentPosition < hallway.length) {
      if (hallway[currentPosition] !== Empty) break;
      rightSteps++;
      if (![2, 4, 6, 8].includes(currentPosition)) {
        nextMoves.push([currentPosition, rightSteps]);
      }
      currentPosition++;
    }

    // we gathered a list of valid moves
    // lets turn them into state transitions
    for (const [hallPosition, steps] of nextMoves) {
      // deep clone the state
      const newHallway = [...hallway];
      const newRooms = rooms.map((room) => [...room]);

      // and move the amphipod at the front of the room to the hallway position
      const amphipod = newRooms[roomIndex].shift() as Amphipod;
      newHallway[hallPosition] = amphipod;

      yield [
        steps * getEnergyCost(amphipod),
        { hallway: newHallway, rooms: newRooms },
      ];
    }
  }
}

function* nextMoves(state: State, perRoom: number) {
  yield* hallwayTransitions(state, perRoom);
  yield* roomTransitions(state, perRoom);
}

/**
 * Solves the puzzle with the given initial state.
 * Returns the least amount of energy required to organise the amphipods.
 */
function solve(initialState: State) {
  // Classic dijkstra setup
  const roomSize = initialState.rooms[0].length;
  const seen = new Map<bigint, number>();

  const queue = new ComparePriorityQueue<[number, State]>(([a], [b]) => {
    return a - b;
  });
  queue.enqueue([0, initialState]);

  while (!queue.isEmpty()) {
    const [currentCost, state] = queue.dequeue();

    if (isComplete(state, roomSize)) {
      return currentCost;
    }

    for (const [moveEnergy, newState] of nextMoves(state, roomSize)) {
      const encoded = encodeState(newState, roomSize);
      const newCost = currentCost + moveEnergy;

      if (!seen.has(encoded) || newCost < seen.get(encoded)!) {
        seen.set(encoded, newCost);
        queue.enqueue([newCost, newState]);
      }
    }
  }

  throw new Error("No solution found");
}

export default createSolverWithLineArray(async (input) => {
  const initialState = parse(input);

  return {
    first: solve(initialState),
    second: solve(unfold(initialState)),
  };
});
