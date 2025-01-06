import { sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

function strategyOne(sleepSchedule: Map<number, Array<number>>) {
  // first we find the guard that has the highest sleep minutes
  let maxSleep = 0;
  let sleepMinutes: Array<number> = [];
  let guardId = 0;

  for (const [guard, schedule] of sleepSchedule) {
    const totalMinutesSlept = sum(schedule);
    if (totalMinutesSlept > maxSleep) {
      maxSleep = totalMinutesSlept;
      guardId = guard;
      sleepMinutes = schedule;
    }
  }

  // then we find the minute that the guard slept the most
  let maxSleepMinute = 0;
  let minute = 0;

  for (let i = 0; i < 60; i++) {
    if (sleepMinutes[i] > maxSleepMinute) {
      maxSleepMinute = sleepMinutes[i];
      minute = i;
    }
  }

  return guardId * minute;
}

function strategyTwo(guardSleep: Map<number, Array<number>>) {
  let maxSleepMinute = 0;
  let minute = 0;
  let guardId = 0;

  for (const [guard, sleepMinutes] of guardSleep) {
    for (let i = 0; i < 60; i++) {
      if (sleepMinutes[i] > maxSleepMinute) {
        maxSleepMinute = sleepMinutes[i];
        minute = i;
        guardId = guard;
      }
    }
  }

  return guardId * minute;
}

function parseInput(input: Array<string>): Map<number, Array<number>> {
  // Make sure the input is sorted
  input.sort();

  const sleepSchedule = new Map<number, Array<number>>();
  let currentGuard = 0;
  for (let i = 0; i < input.length; i++) {
    const line = input[i];

    if (line.includes("Guard")) {
      const id = Number.parseInt(line.split(" ")[3].substring(1));
      currentGuard = id;
      continue;
    }

    const startMinute = Number.parseInt(line.substring(15, 17));
    const endMinute = Number.parseInt(input[++i].substring(15, 17));

    if (!sleepSchedule.has(currentGuard)) {
      sleepSchedule.set(currentGuard, new Array(60).fill(0));
    }

    for (let j = startMinute; j < endMinute; j++) {
      sleepSchedule.get(currentGuard)![j]++;
    }
  }

  return sleepSchedule;
}

export default createSolverWithLineArray(async (input) => {
  const sleepSchedule = parseInput(input);

  return {
    first: strategyOne(sleepSchedule),
    second: strategyTwo(sleepSchedule),
  };
});
