import test from "node:test";
import { createLineReaderFromString } from "../../line-reader";
import solver from "./07";

test("2018.07", async (t) => {
  const input = `Step A must be finished before step N can begin.
Step P must be finished before step R can begin.
Step O must be finished before step T can begin.
Step J must be finished before step U can begin.
Step M must be finished before step X can begin.
Step E must be finished before step X can begin.
Step N must be finished before step T can begin.
Step W must be finished before step G can begin.
Step Z must be finished before step D can begin.
Step F must be finished before step Q can begin.
Step U must be finished before step L can begin.
Step I must be finished before step X can begin.
Step X must be finished before step Y can begin.
Step D must be finished before step Y can begin.
Step S must be finished before step K can begin.
Step C must be finished before step G can begin.
Step K must be finished before step V can begin.
Step B must be finished before step R can begin.
Step Q must be finished before step L can begin.
Step T must be finished before step H can begin.
Step H must be finished before step G can begin.
Step V must be finished before step L can begin.
Step L must be finished before step R can begin.
Step G must be finished before step Y can begin.
Step R must be finished before step Y can begin.
Step G must be finished before step R can begin.
Step X must be finished before step V can begin.
Step V must be finished before step Y can begin.
Step Z must be finished before step U can begin.
Step U must be finished before step R can begin.
Step J must be finished before step Y can begin.
Step Z must be finished before step C can begin.
Step O must be finished before step L can begin.
Step C must be finished before step H can begin.
Step V must be finished before step G can begin.
Step F must be finished before step K can begin.
Step Q must be finished before step G can begin.
Step S must be finished before step Q can begin.
Step M must be finished before step G can begin.
Step T must be finished before step L can begin.
Step C must be finished before step Q can begin.
Step T must be finished before step V can begin.
Step W must be finished before step Z can begin.
Step C must be finished before step K can begin.
Step I must be finished before step C can begin.
Step X must be finished before step Q can begin.
Step F must be finished before step X can begin.
Step J must be finished before step S can begin.
Step I must be finished before step K can begin.
Step U must be finished before step Q can begin.
Step I must be finished before step Q can begin.
Step N must be finished before step H can begin.
Step A must be finished before step T can begin.
Step T must be finished before step G can begin.
Step D must be finished before step T can begin.
Step A must be finished before step X can begin.
Step D must be finished before step G can begin.
Step C must be finished before step T can begin.
Step W must be finished before step Q can begin.
Step W must be finished before step K can begin.
Step V must be finished before step R can begin.
Step H must be finished before step R can begin.
Step F must be finished before step H can begin.
Step F must be finished before step V can begin.
Step U must be finished before step T can begin.
Step K must be finished before step H can begin.
Step B must be finished before step T can begin.
Step H must be finished before step Y can begin.
Step J must be finished before step Z can begin.
Step B must be finished before step Y can begin.
Step I must be finished before step V can begin.
Step W must be finished before step V can begin.
Step Q must be finished before step R can begin.
Step I must be finished before step S can begin.
Step E must be finished before step H can begin.
Step J must be finished before step B can begin.
Step S must be finished before step G can begin.
Step E must be finished before step S can begin.
Step N must be finished before step I can begin.
Step Z must be finished before step F can begin.
Step E must be finished before step I can begin.
Step S must be finished before step B can begin.
Step D must be finished before step L can begin.
Step Q must be finished before step T can begin.
Step Q must be finished before step H can begin.
Step K must be finished before step Y can begin.
Step M must be finished before step U can begin.
Step U must be finished before step K can begin.
Step W must be finished before step I can begin.
Step J must be finished before step W can begin.
Step K must be finished before step T can begin.
Step P must be finished before step Y can begin.
Step L must be finished before step G can begin.
Step K must be finished before step B can begin.
Step I must be finished before step Y can begin.
Step U must be finished before step B can begin.
Step P must be finished before step O can begin.
Step O must be finished before step W can begin.
Step O must be finished before step J can begin.
Step A must be finished before step J can begin.
Step F must be finished before step G can begin.`;

  const lineReader = createLineReaderFromString(input);
  const result = await solver(lineReader);

  t.assert.equal(result.first, "AEMNPOJWISZCDFUKBXQTHVLGRY");
  t.assert.equal(result.second, 1081);
});
