import { createSolverWithString } from "../../solution";

interface Block {
  id: number;
  count: number;
}

function solveFirst(input: string) {
  const disk: Array<number> = [];

  // Parse each disk mapping into an array where -1 is free space
  // E.g. 12345 -> [0, -1, -1, 1, 1, 1, -1, -1, -1, -1, 2, 2, 2, 2, 2]
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    id += i % 2;
    for (let j = 0; j < Number.parseInt(input[i], 10); j++) {
      disk.push(i % 2 === 0 ? id : -1);
    }
  }

  // Now lets have and index at the start and the end of the disk.
  // If the item at index start is -1, where gonna seek from the end index
  // for any non free space block and swap them.
  let start = 0;
  let end = disk.length - 1;
  while (start < end) {
    if (disk[start] === -1) {
      while (disk[end] === -1) {
        end--;
      }

      if (end < start) {
        break;
      }

      disk[start] = disk[end];
      disk[end] = -1;
    }
    start++;
  }

  // Return the checksum
  return disk.reduce((sum, id, index) => {
    if (id === -1) {
      return sum;
    }

    return sum + id * index;
  });
}

function solveSecond(input: string) {
  const blocks: Array<Block> = [];

  // Parse each disk mapping into a block object
  let id = 0;
  for (let i = 0; i < input.length; i++) {
    id += i % 2;
    const isFileBlock = i % 2 === 0;
    const file: Block = {
      id: isFileBlock ? id : -1,
      count: Number.parseInt(input[i], 10),
    };

    blocks.push(file);
  }

  const newDisk: Array<Block> = [];
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].id !== -1) {
      // if the current block is not a free space block
      // just add it to the new disk
      newDisk.push(blocks[i]);
      continue;
    }

    // Otherwise, we're gonna scan from the end of the disk for a block where:
    //   - The block is not a free space block
    //   - The block count is equal to or less than the current (free) block count
    // If we find a block that meets these criteria, we're gonna add it to the
    // new disk, subtract the block count from the current block count, and mark
    // the block as used by setting its id to -1.
    //
    // We can skip every other block because we know that the blocks are
    // alternating between free space and file blocks.
    for (let scan = blocks.length - 1; scan > i; scan -= 2) {
      if (blocks[scan].id === -1 || blocks[scan].count > blocks[i].count) {
        continue;
      }

      newDisk.push({ ...blocks[scan] });
      blocks[i].count -= blocks[scan].count;
      blocks[scan].id = -1;
    }

    if (blocks[i].count > 0) {
      newDisk.push(blocks[i]);
    }
  }

  // Now we just need to calculate the checksum
  let index = 0;
  let sum = 0;
  for (let i = 0; i < newDisk.length; i++) {
    if (newDisk[i].id !== -1) {
      for (let j = 0; j < newDisk[i].count; j++) {
        sum += newDisk[i].id * index++;
      }
    } else {
      index += newDisk[i].count;
    }
  }

  return sum;
}

export default createSolverWithString(async (input) => {
  return {
    first: solveFirst(input),
    second: solveSecond(input),
  };
});
