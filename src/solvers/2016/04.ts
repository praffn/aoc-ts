import { createSolver } from "../../solution";

type Room = {
  name: string;
  sectorId: number;
  checksum: string;
};

const roomRegex = /([a-z-]+)-(\d+)\[([a-z]+)]/;

function parseRoom(line: string): Room {
  const match = line.match(roomRegex);
  if (!match) {
    throw new Error(`Invalid room: ${line}`);
  }

  return {
    name: match[1],
    sectorId: Number.parseInt(match[2], 10),
    checksum: match[3],
  };
}

function isValidRoom(room: Room) {
  // lets compute most common letters
  const letterCounts = new Map<string, number>();
  for (const letter of room.name) {
    if (letter === "-") {
      continue;
    }
    letterCounts.set(letter, (letterCounts.get(letter) || 0) + 1);
  }

  const letters = Array.from(letterCounts.entries()).sort((a, b) => {
    if (a[1] === b[1]) {
      return a[0].localeCompare(b[0]);
    }

    return b[1] - a[1];
  });

  const checksum = letters
    .slice(0, 5)
    .map((l) => l[0])
    .join("");

  return checksum === room.checksum;
}

function decryptRoomName(room: Room) {
  const charCodeA = 97;

  return room.name
    .split("")
    .map((c) => {
      if (c === "-") {
        return " ";
      }

      const code = c.charCodeAt(0) - charCodeA;
      const newCode = (code + room.sectorId) % 26;
      return String.fromCharCode(newCode + charCodeA);
    })
    .join("");
}

export default createSolver(async (input) => {
  let first = 0;
  let second = -1;

  for await (const line of input) {
    const room = parseRoom(line);
    if (isValidRoom(room)) {
      first += room.sectorId;
    }
    const name = decryptRoomName(room);

    if (name === "northpole object storage") {
      second = room.sectorId;
    }
  }

  return {
    first,
    second,
  };
});
