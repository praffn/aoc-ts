import { chunk } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

//#region BitScanner

/**
 * A scanner to read any arbitrary amount of bits from an arbitrarily long
 * hex string. Reads bits from left to right, i.e. from the most significant
 * bit to the least significant bit.
 */
class BitScanner {
  #data: Uint8Array;
  #position = 0;

  get position() {
    return this.#position;
  }

  constructor(hex: string) {
    this.#data = new Uint8Array(
      chunk(hex, 2).map((n) => parseInt(n.join(""), 16))
    );
  }

  /**
   * Reads the next `nBits` bits from the data and returns them as a number.
   */
  read(nBits: number): number {
    let result = 0;
    let bitsRead = 0;

    while (bitsRead < nBits) {
      // which "bucket" of 8 bits we are currently at
      const byteIndex = Math.floor(this.#position / 8);
      // and which bit within that bucket (msb first)
      const bitOffset = 7 - (this.#position % 8);
      // how many bits we have left to read
      const remainingBits = nBits - bitsRead;

      // How many bits can we read from the current byte?
      const bitsAvailable = bitOffset + 1;
      // How many bits we will actually read from the current byte?
      const bitsToRead = Math.min(remainingBits, bitsAvailable);

      // In case we don't need to read the entire byte, we have to mask out
      // the bits we don't need.
      const mask = (1 << bitsToRead) - 1;
      // Finally, lets fetch the bits we're interested in.
      const extractedBits =
        (this.#data[byteIndex] >>> (bitOffset - bitsToRead + 1)) & mask;

      // Shift the result and append the extracted bits
      result = (result << bitsToRead) | extractedBits;

      // Update the position and the number of bits we've read so far
      this.#position += bitsToRead;
      bitsRead += bitsToRead;
    }

    return result;
  }
}

//#endregion

//#region Packet Parsing

type LiteralPacket = {
  kind: "literal";
  type: number;
  version: number;
  value: bigint;
};

type OperatorPacket = {
  kind: "operator";
  type: number;
  version: number;
  packets: Packet[];
};

type Packet = LiteralPacket | OperatorPacket;

/**
 * Returns a packet read from the bit scanner.
 */
function readPacket(bitScanner: BitScanner): Packet {
  const version = bitScanner.read(3);
  const type = bitScanner.read(3);

  if (type === 4) {
    // type 4 is a literal packet
    return readLiteralPacket(bitScanner, version, type);
  }

  // any other type is an operator packet
  return readOperatorPacket(bitScanner, version, type);
}

/**
 * Reads a literal packet from the bit scanner.
 */
function readLiteralPacket(
  bitScanner: BitScanner,
  version: number,
  type: number
): LiteralPacket {
  // we use bigint because the values can be very large
  let value = 0n;

  while (true) {
    // on every iteration we should read 1 + 4 bits
    // the first bit is 1 if we should continue iterating
    // the 4 bits after that are the actual value
    const isLastChunk = bitScanner.read(1) === 0;
    const bits = bitScanner.read(4);
    value = (value << 4n) | BigInt(bits);
    if (isLastChunk) {
      break;
    }
  }

  return {
    kind: "literal",
    type,
    version,
    value,
  };
}

/**
 * Reads an operator packet from the bit scanner.
 */
function readOperatorPacket(
  bitScanner: BitScanner,
  version: number,
  type: number
): OperatorPacket {
  const packets: Packet[] = [];
  const lengthType = bitScanner.read(1);

  if (lengthType == 0) {
    // if the length type is 0, we read a 15-bit length number that tells us
    // exactly how many bits the next subpackets will be.
    const length = bitScanner.read(15);

    // We now now that we can keep reading subpackets until we reach the
    // target position.
    const targetPosition = bitScanner.position + length;
    while (bitScanner.position < targetPosition) {
      const packet = readPacket(bitScanner);
      packets.push(packet);
    }
  } else {
    // If the length type is 1, we read an 11-bit number that tells us how
    // many subpackets we should read.
    const subPacketCount = bitScanner.read(11);
    while (packets.length < subPacketCount) {
      const packet = readPacket(bitScanner);
      packets.push(packet);
    }
  }

  return {
    kind: "operator",
    type,
    version,
    packets,
  };
}

//#endregion

//#region Evaluation

// The next few functions are just helpers for getting the min, max, sum, and
// product of an array of bigints. They are used by the `evaluate` function.

function min(ns: Array<bigint>): bigint {
  return ns.reduce((a, b) => (a < b ? a : b));
}

function max(ns: Array<bigint>): bigint {
  return ns.reduce((a, b) => (a > b ? a : b));
}

function sum(ns: Array<bigint>): bigint {
  return ns.reduce((a, b) => a + b, 0n);
}

function prod(ns: Array<bigint>): bigint {
  return ns.reduce((a, b) => a * b, 1n);
}

function eq(ns: Array<bigint>): bigint {
  return ns[0] === ns[1] ? 1n : 0n;
}

function gt(ns: Array<bigint>): bigint {
  return ns[0] > ns[1] ? 1n : 0n;
}

function lt(ns: Array<bigint>): bigint {
  return ns[0] < ns[1] ? 1n : 0n;
}

/**
 * Recursively evaluates a packet and returns the result as a bigint.
 */
function evaluate(packet: Packet): bigint {
  if (packet.kind === "literal") {
    return packet.value;
  }

  const results = packet.packets.map((p) => evaluate(p));
  switch (packet.type) {
    case 0:
      return sum(results);
    case 1:
      return prod(results);
    case 2:
      return min(results);
    case 3:
      return max(results);
    case 5:
      return gt(results);
    case 6:
      return lt(results);
    case 7:
      return eq(results);
    default:
      throw new Error(`Unknown operator type: ${packet.type}`);
  }
}

//#endregion

/**
 * Recursively sums the version numbers of all packets in the tree.
 */
function sumVersionNumbers(packet: Packet): number {
  switch (packet.kind) {
    case "literal":
      return packet.version;
    case "operator":
      return (
        packet.version +
        packet.packets.reduce((a, b) => a + sumVersionNumbers(b), 0)
      );
  }
}

export default createSolverWithString(async (input) => {
  const bitScanner = new BitScanner(input);

  const packet = readPacket(bitScanner);

  return {
    first: sumVersionNumbers(packet),
    second: evaluate(packet),
  };
});
