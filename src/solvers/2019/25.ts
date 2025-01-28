import * as readline from "node:readline/promises";
import { Queue } from "../../lib/collections/queue";
import { powerSet } from "../../lib/iter";
import { createSolverWithString } from "../../solution";
import { HALT_TERMINATED, IntcodeCPU } from "./intcode";

type Room = {
  name: string;
  doors: Record<string, Room>;
};

const reverseDirection: Record<string, string> = {
  north: "south",
  south: "north",
  east: "west",
  west: "east",
};

/**
 * Runs all the input instructions (each ending with a newline) and returns
 * the output and the halt reason.
 */
function runAndOutput(
  cpu: IntcodeCPU,
  ...instructions: Array<string>
): [output: string, haltReason: string] {
  if (instructions.length > 0) {
    cpu.writeInputString(instructions.join("\n") + "\n");
  }
  const haltReason = cpu.run();
  const output = consumeOutput(cpu);

  return [output, haltReason];
}

/**
 * Consumes all currently generated output and returns it as a string.
 */
function consumeOutput(cpu: IntcodeCPU) {
  return Array.from(
    cpu.output.dequeueIterator().map((c) => String.fromCharCode(c))
  ).join("");
}

/**
 * Returns the room name, doors, items and whether the room is the final room.
 */
function parseRoom(output: string): {
  name: string;
  doors: Array<string>;
  items: Array<string>;
  isFinal: boolean;
} {
  let name = "<UNKNOWN>";
  let didParseName = false;
  let isFinal = false;
  const doors: Array<string> = [];
  const items: Array<string> = [];

  let parseState: "name" | "doors" | "items" = "name";

  for (const line of output.split("\n")) {
    if (line === "" || line[0] === "") {
      continue;
    }

    if (line.startsWith("=")) {
      if (didParseName) {
        isFinal = true;
        continue;
      }
      name = line.slice(3, -3);
      didParseName = true;
      continue;
    }

    if (line === "Doors here lead:") {
      parseState = "doors";
      continue;
    }
    if (line === "Items here:") {
      parseState = "items";
      continue;
    }

    if (line.startsWith("-")) {
      const value = line.slice(2);
      if (parseState === "doors") {
        doors.push(value);
      } else if (parseState === "items") {
        items.push(value);
      }
    }
  }

  return { name, doors, items, isFinal };
}

/**
 * Returns an array of directions to get from room `from` to room `to`.
 */
function findPath(from: Room, to: Room): Array<string> {
  const visited = new Set<string>();
  const queue = new Queue<[Room, Array<string>]>();
  queue.enqueue([from, []]);

  while (!queue.isEmpty()) {
    const [room, path] = queue.dequeue()!;

    if (room.name === to.name) {
      return path;
    }

    if (visited.has(room.name)) {
      continue;
    }
    visited.add(room.name);

    for (const [direction, nextRoom] of Object.entries(room.doors)) {
      queue.enqueue([nextRoom, [...path, direction]]);
    }
  }

  throw new Error("No path found");
}

/**
 * Returns and array of items currently held by the CPU.
 */
function getCurrentlyHeldItems(cpu: IntcodeCPU): Array<string> {
  const items = new Array<string>();

  const [output] = runAndOutput(cpu, "inv");
  for (const line of output.split("\n")) {
    if (line.startsWith("-")) {
      items.push(line.slice(2));
    }
  }

  return items;
}

// Items that are bad to take.
// I have hardcoded some initial ones since they are annoying to detect
const badItems = new Set(["infinite loop", "giant electromagnet"]);

/**
 * Attempts to take the item.
 * It will clone the CPU state and try to take the item. If the CPU terminates,
 * we add the item to the bad items set and return the original CPU state.
 *
 * Otherwise we return the new CPU state.
 */
function tryTakeItem(cpu: IntcodeCPU, item: string): IntcodeCPU {
  if (badItems.has(item)) {
    return cpu;
  }
  const clone = cpu.clone();
  const [, haltReason] = runAndOutput(clone, `take ${item}`);

  if (haltReason === HALT_TERMINATED) {
    badItems.add(item);
    return cpu;
  }

  return clone;
}

/**
 * Explore will visit all rooms and collect all (good) items.
 * It will not attempt to enter the last room, but will instead stop
 * at the last room before the last room, with all items collected.
 */
function explore(cpu: IntcodeCPU) {
  // Represents the room we're (and the CPU state is) currently in
  let currentRoom: Room = { name: "<START>", doors: {} };
  let finalRoom: Room | undefined;

  // A stack of rooms to visit
  const unexplored = [currentRoom];
  let lastStep = "";

  while (unexplored.length > 0) {
    // Pop the next room to visit
    const targetRoom = unexplored.pop()!;
    // Lets figure out how we get there
    const path = findPath(currentRoom, targetRoom);

    // Now lets move the CPU state to that room, making sure that that we get
    // the output of the last movement instruction
    let [output] = runAndOutput(cpu);
    for (const step of path) {
      [output] = runAndOutput(cpu, step);
      currentRoom = currentRoom.doors[step];
    }

    // We're in the room, now lets parse the output and get the room intel
    const { name, doors, items, isFinal } = parseRoom(output);

    // If this is the final room, move back to the previous room
    if (isFinal) {
      lastStep = path.at(-1)!;
      currentRoom = currentRoom.doors[reverseDirection[lastStep]];
      finalRoom = currentRoom;
      continue;
    }

    // Otherwise lets update the room
    currentRoom.name = name;

    // Lets go through all the parsed doors. If we haven't seen them before,
    // we'll create a new room and add it to the unexplored stack
    for (const door of doors) {
      if (door in currentRoom.doors) {
        continue;
      }
      const newRoom: Room = {
        name: `Unexplored room ${door} of ${currentRoom.name}`,
        doors: {},
      };
      newRoom.doors[reverseDirection[door]] = currentRoom;
      currentRoom.doors[door] = newRoom;
      unexplored.push(newRoom);
    }

    // Also, lets try to take all the items in the room
    for (const item of items) {
      cpu = tryTakeItem(cpu, item);
    }
  }

  if (!finalRoom) {
    throw new Error("No final room found");
  }

  // Alright, we've explored all rooms and collected all items.
  // Lets move to the final room and try to solve the puzzle
  const path = findPath(currentRoom, finalRoom!);
  runAndOutput(cpu, ...path);

  // We're at the final room. Get our final held items and try to "drop" every
  // combination of items until we find the one that will get us through
  const currentlyHeldItems = getCurrentlyHeldItems(cpu);
  for (const itemSubset of powerSet(currentlyHeldItems)) {
    const clone = cpu.clone();
    const instructions = itemSubset.map((item) => `drop ${item}`);
    const [o, halt] = runAndOutput(clone, ...instructions, lastStep);
    if (halt === HALT_TERMINATED) {
      // PROGRAM TERMINATED!!! WE DID IT!!!
      // The only numeric value in output should be the solution
      return o.match(/(\d+)/)![1];
    }
  }

  throw new Error("No solution found");
}

export default createSolverWithString(async (input, extra) => {
  const cpu = new IntcodeCPU(input);

  if (extra) {
    console.log('Welcome to the interactive mode. Type ".help" for help.');
    await play(cpu.clone());
  }

  return {
    first: explore(cpu),
    second: "Merry Christmas! 🎅🚀",
  };
});

/**
 * Interactive mode for fun
 */
async function play(cpu: IntcodeCPU) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  outer: while (true) {
    cpu.run();
    console.log(consumeOutput(cpu));
    const input = await rl.question("> ");
    switch (input) {
      case ".exit":
        break outer;
      case ".reset":
        cpu.reset();
        continue outer;
      case ".help":
        console.log("north|south|east|west to move (if possible)");
        console.log("take <item> to take an item");
        console.log("drop <item> to drop an item");
        console.log("inv to show inventory");
        console.log();
        console.log("Special commands:");
        console.log(".exit to exit");
        console.log(".reset to reset");
        console.log(".help to show this message");
        continue outer;
      default:
        cpu.writeInputString(input + "\n");
    }
  }

  rl.close();
}
