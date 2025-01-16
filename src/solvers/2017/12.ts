import { UndirectedGraph } from "../../lib/graph/undirected-graph";
import { createSolver } from "../../solution";

export default createSolver(async (input) => {
  const graph = new UndirectedGraph<string>();

  for await (const line of input) {
    const [id, ids] = line.split(" <-> ");
    for (const otherId of ids.split(", ")) {
      graph.addEdge(id, otherId);
    }
  }

  const connectedComponents = Array.from(graph.connectedComponents());
  const componentWith0 = connectedComponents.find((component) =>
    component.has("0")
  )!;

  return {
    first: componentWith0.size,
    second: connectedComponents.length,
  };
});
