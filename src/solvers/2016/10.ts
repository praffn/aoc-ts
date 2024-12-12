import { getOrRun } from "../../lib/dicts";
import { createSolver } from "../../solution";

interface Receiver {
  receive(value: number): void;
}

class Bot implements Receiver {
  values: Array<number> = [];
  low?: Receiver;
  high?: Receiver;

  constructor() {}

  receive(value: number) {
    this.values.push(value);
    this.distribute();
  }

  distribute() {
    if (this.values.length === 2) {
      this.low?.receive(Math.min(...this.values));
      this.high?.receive(Math.max(...this.values));
    }
  }
}

class Output implements Receiver {
  values: Array<number> = [];

  constructor() {}

  receive(value: number) {
    this.values.push(value);
  }
}

export default createSolver(async (input) => {
  const bots = new Map<number, Bot>();
  const outputs = new Map<number, Output>();

  const botGetter = (key: number) => getOrRun(bots, key, () => new Bot());
  const outputGetter = (key: number) =>
    getOrRun(outputs, key, () => new Output());

  for await (const line of input) {
    const parts = line.split(" ");
    if (parts[0] === "value") {
      const value = Number.parseInt(parts[1], 10);
      const botNumber = Number.parseInt(parts[5], 10);
      botGetter(botNumber).receive(value);
    } else {
      const botNumber = Number.parseInt(parts[1], 10);
      const lowType = parts[5];
      const lowId = Number.parseInt(parts[6], 10);
      const highType = parts[10];
      const highId = Number.parseInt(parts[11], 10);

      const lowGetter = lowType === "bot" ? botGetter : outputGetter;
      const highGetter = highType === "bot" ? botGetter : outputGetter;

      const lowReceiver = lowGetter(lowId);
      const highReceiver = highGetter(highId);

      const bot = botGetter(botNumber);
      bot.low = lowReceiver;
      bot.high = highReceiver;
      bot.distribute();
    }
  }

  let botNumber = -1;
  for (const [number, bot] of bots) {
    if (bot.values.includes(61) && bot.values.includes(17)) {
      botNumber = number;
      break;
    }
  }

  let outputValue = 1;
  for (let i = 0; i < 3; i++) {
    outputValue *= outputs.get(i)!.values[0];
  }

  return {
    first: botNumber,
    second: outputValue,
  };
});
