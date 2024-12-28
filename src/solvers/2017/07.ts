import { counter } from "../../lib/iter";
import { createSolver } from "../../solution";

function findRoot(children: Map<string, Array<string>>): string {
  // Root must be the key that is not a child of any other key.

  const rootCandidates = new Set(children.keys());

  for (const childSet of children.values()) {
    for (const child of childSet) {
      rootCandidates.delete(child);
    }
  }

  return rootCandidates.values().next().value!;
}

function findWeight(
  weights: Map<string, number>,
  children: Map<string, Array<string>>,
  node: string
) {
  let w = weights.get(node)!;
  if (!children.has(node)) {
    return w;
  }

  for (const child of children.get(node)!) {
    w += findWeight(weights, children, child);
  }

  return w;
}

function findImbalance(
  weights: Map<string, number>,
  children: Map<string, Array<string>>,
  node: string
): number | undefined {
  if (!children.has(node)) {
    return;
  }

  const nodeChildren = children.get(node)!;
  const childWeights = nodeChildren.map((child) => {
    return findWeight(weights, children, child);
  });

  const weightCounts = counter(childWeights);
  if (weightCounts.size <= 1) {
    return;
  }
  const sortedWeightCount = Array.from(weightCounts.entries()).sort(
    (a, b) => a[1] - b[1]
  );

  const leastFrequentWeight = sortedWeightCount.at(0)![0];
  const leastFrequentIndex = childWeights.indexOf(leastFrequentWeight);

  const leastFrequentNode = nodeChildren[leastFrequentIndex];

  const furtherImbalance = findImbalance(weights, children, leastFrequentNode);
  if (furtherImbalance) {
    return furtherImbalance;
  }

  const mostFrequentWeight = sortedWeightCount.at(-1)![0];
  const imbalance = mostFrequentWeight - leastFrequentWeight;
  return weights.get(leastFrequentNode)! + imbalance;
}

const re = /(\w+) \((\d+)\)(?: -> (.+))?/;

export default createSolver(async (input) => {
  const weights = new Map<string, number>();
  const children = new Map<string, Array<string>>();

  for await (const line of input) {
    const [, name, weight, childrenStr] = line.match(re)!;
    weights.set(name, Number.parseInt(weight));

    if (childrenStr) {
      children.set(name, childrenStr.split(", "));
    }
  }

  const root = findRoot(children);

  return {
    first: root,
    second: findImbalance(weights, children, root)!,
  };
});
