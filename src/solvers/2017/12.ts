import { createSolver } from "../../solution";

class UndirectedGraph {
  #adjacency = new Map<string, Set<string>>();

  addEdge(from: string, to: string) {
    if (!this.#adjacency.has(from)) {
      this.#adjacency.set(from, new Set());
    }
    if (!this.#adjacency.has(to)) {
      this.#adjacency.set(to, new Set());
    }

    this.#adjacency.get(from)!.add(to);
    this.#adjacency.get(to)!.add(from);
  }

  connectedComponents() {
    const visited = new Set<string>();
    const components: Array<Set<string>> = [];

    const dfs = (id: string, component: Set<string>) => {
      visited.add(id);
      component.add(id);
      for (const neighbor of this.#adjacency.get(id)!) {
        if (!visited.has(neighbor)) {
          dfs(neighbor, component);
        }
      }
    };

    for (const vertex of this.#adjacency.keys()) {
      if (!visited.has(vertex)) {
        const component = new Set<string>();
        dfs(vertex, component);
        components.push(component);
      }
    }

    return components;
  }
}

export default createSolver(async (input) => {
  const graph = new UndirectedGraph();

  for await (const line of input) {
    const [id, ids] = line.split(" <-> ");
    for (const otherId of ids.split(", ")) {
      graph.addEdge(id, otherId);
    }
  }

  const connectedComponents = graph.connectedComponents();
  const componentWith0 = connectedComponents.find((component) =>
    component.has("0")
  )!;

  return {
    first: componentWith0.size,
    second: connectedComponents.length,
  };
});
