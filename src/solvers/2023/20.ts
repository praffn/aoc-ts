import { Deque } from "../../lib/collections/deque";
import { DirectedGraph } from "../../lib/graph/directed-graph";
import { range } from "../../lib/iter";
import { lcm } from "../../lib/math/math";
import { createSolverWithLineArray } from "../../solution";

const LOW = Symbol("low");
const HIGH = Symbol("high");
type Pulse = typeof LOW | typeof HIGH;

/**
 * Abstract class for a module in the machine.
 */
abstract class Module {
  /**
   * Recevies a pulse from a source and returns a pulse to be propagated to any
   * destination modules. If `undefined` is returned, no pulse is propagated.
   */
  abstract receive(source: string, pulse: Pulse): Pulse | undefined;

  /**
   * Resets to module to its default state.
   */
  reset() {}
}

/**
 * A flip-flop module that flips its state on every low pulse and sends a high
 * pulse if it was off, and a low pulse if it was on. Ignores all high pulses.
 */
class FlipFlop extends Module {
  #on = false;

  override receive(source: string, pulse: Pulse): Pulse | undefined {
    if (pulse === HIGH) {
      // FlipFlop ignores all high pulses
      return;
    }

    // we flip if we receive a low pulse
    this.#on = !this.#on;
    // and send a high pulse if we were off, low pulse if we were on
    return this.#on ? HIGH : LOW;
  }

  override reset() {
    this.#on = false;
  }
}

/**
 * A conjunction module that remembers the last pulse received from each of its
 * sources (initially LOW). It sends a low pulse if all remembered pulses are
 * high, otherwise it sends a high pulse.
 */
class Conjunction extends Module {
  #memory: Map<string, Pulse>;

  constructor(sources: Array<string>) {
    super();
    this.#memory = new Map(sources.map((source) => [source, LOW]));
  }

  #allHighPulses() {
    return this.#memory.values().every((pulse) => pulse === HIGH);
  }

  override receive(source: string, pulse: Pulse): Pulse | undefined {
    // we update the memory with the new pulse
    this.#memory.set(source, pulse);
    // and send a low pulse if every pulse we remember is high, otherwise we
    // send a high pulse
    return this.#allHighPulses() ? LOW : HIGH;
  }

  override reset() {
    // reset all memory to LOW
    this.#memory.keys().forEach((source) => {
      this.#memory.set(source, LOW);
    });
  }
}

/**
 * A broadcaster module sends the pulse it receives to all its destinations.
 */
class Broadcaster extends Module {
  override receive(source: string, pulse: Pulse): Pulse | undefined {
    return pulse;
  }
}

/**
 * Entry used for the BFS queue.
 */
type QueueEntry = {
  source: string;
  destination: string;
  pulse: Pulse;
};

/**
 * A machine that consists of modules.
 */
class Machine {
  #modules: Map<string, Module>;
  #graph: DirectedGraph<string>;

  private constructor(
    modules: Map<string, Module>,
    graph: DirectedGraph<string>
  ) {
    this.#modules = modules;
    this.#graph = graph;
  }

  static parse(input: Array<string>): Machine {
    const modules = new Map<string, Module>();
    const graph = new DirectedGraph<string>();

    const uninitializedModules: Array<{
      name: string;
      type: string;
      destinations: Array<string>;
    }> = [];

    for (const line of input) {
      let [name, rawDestinations] = line.split(" -> ");
      const destinations = rawDestinations.split(", ");

      if (name === "broadcaster") {
        uninitializedModules.push({ name, type: "broadcaster", destinations });
      } else {
        const type = name[0];
        name = name.slice(1);
        uninitializedModules.push({ name, type, destinations });
      }

      for (const destination of destinations) {
        graph.addEdge(name, destination);
      }
    }

    for (const { name, type, destinations } of uninitializedModules) {
      switch (type) {
        case "broadcaster":
          modules.set(name, new Broadcaster());
          break;
        case "%":
          modules.set(name, new FlipFlop());
          break;
        case "&": {
          // const sources = new Set(graph.incomingEdges().filter())
          const sources = Array.from(
            graph.incomingEdges(name).map(([source]) => source)
          );
          modules.set(name, new Conjunction(sources));
          break;
        }
        default:
          throw new Error(`Unknown module type: ${type}`);
      }
    }

    return new Machine(modules, graph);
  }

  /**
   * Propagates a pulse through the machine, yielding the next pulses and
   * destinations to propagate to.
   */
  *#propagatePulse(
    source: string,
    destination: string,
    pulse: Pulse
  ): Generator<QueueEntry> {
    if (!this.#modules.has(destination)) {
      return;
    }

    const module = this.#modules.get(destination)!;
    const destinations = this.#graph.neighbors(destination);
    const newPulse = module.receive(source, pulse);

    if (!newPulse) {
      return;
    }

    for (const newDestination of destinations) {
      yield {
        source: destination,
        destination: newDestination,
        pulse: newPulse,
      };
    }
  }

  /**
   * Pushes the button once, sending a LOW pulse to the broadcaster, propagating
   * the pulse through the machine. Returns the number of LOW and HIGH pulses
   * that were propagated.
   */
  pushButton() {
    const queue = new Deque<QueueEntry>();
    queue.pushBack({
      source: "button",
      destination: "broadcaster",
      pulse: LOW,
    });

    const pulseCounts = { [LOW]: 0, [HIGH]: 0 };

    while (!queue.isEmpty()) {
      const { source, destination, pulse } = queue.popFront()!;

      pulseCounts[pulse]++;

      for (const entry of this.#propagatePulse(source, destination, pulse)) {
        queue.pushBack(entry);
      }
    }

    return pulseCounts;
  }

  /**
   * Yields the periods of LOW pulses that are sent to the sources of the given
   * module. Thanks https://github.com/mebeim/aoc/blob/master/2023/solutions/day20.py
   */
  *findPeriods(forModule: string) {
    const periodic = new Set<string>();

    const rxSource = Array.from(
      this.#graph.incomingEdges(forModule).map(([source]) => source)
    )[0];

    for (const [source, destination] of this.#graph.edges()) {
      if (destination === rxSource) {
        periodic.add(source);
      }
    }

    let i = 1;
    while (true) {
      const queue = new Deque<QueueEntry>();
      queue.pushBack({
        source: "button",
        destination: "broadcaster",
        pulse: LOW,
      });

      while (!queue.isEmpty()) {
        const { source, destination, pulse } = queue.popFront()!;

        if (pulse === LOW) {
          if (periodic.has(destination)) {
            yield i;
          }

          periodic.delete(destination);
          if (periodic.size === 0) {
            return;
          }
        }

        for (const entry of this.#propagatePulse(source, destination, pulse)) {
          queue.pushBack(entry);
        }
      }

      i++;
    }
  }

  /**
   * Resets all modules in the machine
   */
  reset() {
    for (const module of this.#modules.values()) {
      module.reset();
    }
  }
}

/**
 * Pushes the button 1000 times and returns the product of the number of LOW
 * and HIGH pulses that were propagated. Resets the machine afterwards.
 */
function first(machine: Machine) {
  const { [LOW]: low, [HIGH]: high } = range(1000).reduce(
    (acc) => {
      const { [LOW]: low, [HIGH]: high } = machine.pushButton();
      return { [LOW]: acc[LOW] + low, [HIGH]: acc[HIGH] + high };
    },
    { [LOW]: 0, [HIGH]: 0 }
  );
  machine.reset();
  return low * high;
}

/**
 * Returns the number of cycles it takes until `rx` receives a LOW pulse.
 */
function second(machine: Machine) {
  const periods = machine.findPeriods("rx");
  return periods.reduce(lcm);
}

export default createSolverWithLineArray(async (input) => {
  const machine = Machine.parse(input);

  return {
    first: first(machine),
    second: second(machine),
  };
});
