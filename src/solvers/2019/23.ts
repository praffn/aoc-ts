import { Queue } from "../../lib/collections/queue";
import { createSolverWithString } from "../../solution";
import { IntcodeCPU } from "./intcode";

type NIC = {
  cpu: IntcodeCPU;
  receiveQueue: Queue<[number, number]>;
};

/**
 * Returns true if all NICs are idle, i.e. all receive queues are empty and
 * all CPUs are waiting for input.
 */
function systemIsIdle(nics: Array<NIC>) {
  return nics.every(({ receiveQueue }) => receiveQueue.isEmpty());
}

/**
 * Solves the problem by simulating the network of 50 NICs.
 * Returns a tuple of the first and second results.
 */
function solve(nics: Array<NIC>): [first: number, second: number] {
  let first = -1;

  const nat = { x: 0, y: 0 };
  // natTo0 is a set of y values that the NAT has sent to NIC 0
  const natTo0 = new Set<number>();

  while (true) {
    for (const { cpu, receiveQueue } of nics) {
      // Try to send pending receive
      if (receiveQueue.isEmpty()) {
        cpu.writeInput(-1);
      } else {
        cpu.writeInput(receiveQueue.dequeue());
      }
      cpu.run();

      // Then for all output we get, send it to the appropriate NIC
      while (!cpu.output.isEmpty()) {
        const destination = cpu.output.dequeue();
        const x = cpu.output.dequeue();
        const y = cpu.output.dequeue();

        if (destination === 255) {
          // NAT destination
          // Save first result

          if (first === -1) {
            first = y;
          }
          nat.x = x;
          nat.y = y;
          continue;
        }

        // If not NAT, send to the appropriate NIC
        nics[destination].receiveQueue.enqueue([x, y]);
      }
    }

    // If system is idle we should sent last NAT packet to NIC 0
    // If the NAT sends the same y value twice to NIC 0, we are done and return
    if (systemIsIdle(nics)) {
      if (natTo0.has(nat.y)) {
        return [first, nat.y];
      }
      nics[0].receiveQueue.enqueue([nat.x, nat.y]);
      natTo0.add(nat.y);
    }
  }
}

export default createSolverWithString(async (input) => {
  // create 50 NICs. Each NIC has its own IntcodeCPU and a receive queue
  const nics = Array.from({ length: 50 }, (_, i) => {
    const receiveQueue = new Queue<[number, number]>();

    const cpu = new IntcodeCPU(input);
    cpu.writeInput(i);

    return { cpu, receiveQueue };
  });

  const [first, second] = solve(nics);

  outer: return {
    first,
    second,
  };
});
