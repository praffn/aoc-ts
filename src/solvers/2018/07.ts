import { getOrSet } from "../../lib/dicts";
import { min } from "../../lib/iter";
import { PriorityQueue } from "../../lib/pq";
import { createSolver } from "../../solution";

const STEP_DURATION = 60;
const WORKERS = 5;

function topologicalLexicographicSort(
  adj: Map<string, Set<string>>,
  inDegree: Map<string, number>
): string {
  // Classic topological then lexicographic traversal of the graph.
  // In essence, we start with all zero in degree nodes, and add them sorted
  // lexicographically to the result. Then for each of these nodes we decrease
  // the in degree of their dependents. If any in degree is reduced to 0 it is
  // added to the priority queue. Rinse repeat, until queue is empty

  const inDegreeCopy = new Map(inDegree);
  const pq = new PriorityQueue<string>();

  for (const node of adj.keys()) {
    if (!inDegreeCopy.has(node)) {
      pq.enqueue(node, node.charCodeAt(0));
    }
  }

  const result: Array<string> = [];

  while (!pq.isEmpty()) {
    const c = pq.dequeue();
    result.push(c);

    for (const dependents of adj.get(c) ?? []) {
      const newInDegree = inDegreeCopy.get(dependents)! - 1;
      if (newInDegree === 0) {
        pq.enqueue(dependents, dependents.charCodeAt(0));
      }
      inDegreeCopy.set(dependents, newInDegree);
    }
  }

  return result.join("");
}

function computeTimeToComplete(
  dependencyGraph: Map<string, Set<string>>,
  inDegree: Map<string, number>,
  workers: number,
  stepDuration: number
) {
  // We keep a map of tasks (nodes) to the time spent on completing them.
  // At max we can have `workers` tasks running at the same time.
  // We start by adding all zero in degree tasks to the priority queue.
  // Then we iterate over the tasks, adding them to the active tasks map
  // We then figure out which active tasks has the lowest remaining duration
  // add that to the total running time, and subtract it from all other active
  // tasks. We remove the completed tasks from the active tasks map and add
  // their dependents to the available tasks queue. Rinse repeat until no tasks

  const taskDurations = new Map<string, number>();
  const availableTasks = new PriorityQueue<string>();
  const activeTasks: Map<string, number> = new Map();

  let totalTime = 0;

  dependencyGraph.forEach((_, task) => {
    taskDurations.set(task, task.charCodeAt(0) - 64 + stepDuration);
    if ((inDegree.get(task) ?? 0) === 0) {
      availableTasks.enqueue(task, task.charCodeAt(0));
    }
  });

  while (activeTasks.size > 0 || availableTasks.size() > 0) {
    while (availableTasks.size() > 0 && activeTasks.size < workers) {
      const nextTask = availableTasks.dequeue();
      activeTasks.set(nextTask, taskDurations.get(nextTask)!);
    }

    const minDuration = min(activeTasks.values())!;
    totalTime += minDuration;

    activeTasks.forEach((timeLeft, task) => {
      if (timeLeft === minDuration) {
        activeTasks.delete(task);

        for (const dependent of dependencyGraph.get(task) ?? []) {
          const newInDegree = (inDegree.get(dependent) ?? 0) - 1;
          inDegree.set(dependent, newInDegree);
          if (newInDegree === 0) {
            availableTasks.enqueue(dependent, dependent.charCodeAt(0));
          }
        }
      } else {
        activeTasks.set(task, timeLeft - minDuration);
      }
    });
  }

  return totalTime;
}

export default createSolver(async (input) => {
  const adj = new Map<string, Set<string>>();
  const inDegree = new Map<string, number>();

  for await (const line of input) {
    const parts = line.split(" ");
    const from = parts[1];
    const to = parts[7];
    getOrSet(adj, from, () => new Set()).add(to);
    getOrSet(adj, to, () => new Set());
    inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
  }

  return {
    first: topologicalLexicographicSort(adj, inDegree),
    second: computeTimeToComplete(adj, inDegree, WORKERS, STEP_DURATION),
  };
});
