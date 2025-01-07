import { createSolverWithString } from "../../solution";

type Node = {
  children: Node[];
  metadata: Uint8Array;
};

// Builds the tree recursively
function parseTree(data: Uint8Array, index = 0): [Node, number] {
  const childCount = data[index];
  const metadataCount = data[index + 1];
  index += 2;

  const children: Array<Node> = [];
  for (let j = 0; j < childCount; j++) {
    const [child, newIndex] = parseTree(data, index);
    children.push(child);
    index = newIndex;
  }

  // const metadata = data.slice(index, index + metadataCount);
  const metadata = data.subarray(index, index + metadataCount);
  index += metadataCount;

  const node = { children, metadata };

  return [node, index];
}

function sumMetadata(node: Node): number {
  const subSum = node.metadata.reduce((acc, m) => acc + m, 0);
  const childSum = node.children.reduce(
    (acc, child) => acc + sumMetadata(child),
    0
  );

  return subSum + childSum;
}

function getValue(node: Node): number {
  if (node.children.length === 0) {
    return node.metadata.reduce((acc, m) => acc + m, 0);
  }

  let value = 0;
  for (const m of node.metadata) {
    if (m === 0 || m > node.children.length) {
      continue;
    }

    value += getValue(node.children[m - 1]);
  }

  return value;
}

export default createSolverWithString(async (input) => {
  const bytes = new Uint8Array(input.split(" ").map((n) => Number.parseInt(n)));
  const [tree] = parseTree(bytes);

  return {
    first: sumMetadata(tree),
    second: getValue(tree),
  };
});
