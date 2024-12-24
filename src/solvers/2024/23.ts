import { combinations } from "../../lib/iter";
import { intersection } from "../../lib/sets";
import { createSolver } from "../../solution";

class UndirectedGraph {
  #adj = new Map<string, Set<string>>();

  addEdge(a: string, b: string) {
    if (!this.#adj.has(a)) {
      this.#adj.set(a, new Set());
    }

    if (!this.#adj.has(b)) {
      this.#adj.set(b, new Set());
    }

    this.#adj.get(a)!.add(b);
    this.#adj.get(b)!.add(a);
  }

  findCliques(k: number) {
    const cliques: Array<Array<string>> = [];

    const isClique = (candidate: Array<string>) => {
      for (const [a, b] of combinations(candidate, 2)) {
        if (!this.#adj.get(a)!.has(b)) {
          return false;
        }
      }
      return true;
    };

    function backtrack(start: Array<string>, currentClique: Array<string>) {
      if (currentClique.length === k) {
        cliques.push(currentClique);
        return;
      }

      for (const vertex of start) {
        const newClique = [...currentClique, vertex];
        if (isClique(newClique)) {
          backtrack(start.slice(start.indexOf(vertex) + 1), newClique);
        }
      }
    }

    backtrack(Array.from(this.#adj.keys()), []);

    return cliques;
  }

  findMaxClique() {
    let maxClique = new Set<string>();

    const bronKerbosch = (R: Set<string>, P: Set<string>, X: Set<string>) => {
      if (P.size === 0 && X.size === 0) {
        if (R.size > maxClique.size) {
          maxClique = new Set(R);
        }
        return;
      }

      const Pa = Array.from(P);
      const pivot = Pa[0];
      const neighbors = this.#adj.get(pivot)!;

      for (const vertex of Pa.filter((node) => !neighbors.has(node))) {
        const newR = new Set(R).add(vertex);
        const neighbors = this.#adj.get(vertex)!;
        const newP = intersection(P, neighbors);
        const newX = intersection(X, neighbors);

        bronKerbosch(newR, newP, newX);

        P.delete(vertex);
        X.add(vertex);
      }
    };

    bronKerbosch(new Set(), new Set(this.#adj.keys()), new Set());

    return maxClique;
  }
}

export default createSolver(async (input) => {
  const graph = new UndirectedGraph();

  for await (const line of input) {
    const [a, b] = line.split("-");
    graph.addEdge(a, b);
  }

  const cliques = graph.findCliques(3);

  let first = 0;
  for (const clique of cliques) {
    if (clique.some((v) => v[0] === "t")) {
      first++;
    }
  }

  const maxClique = graph.findMaxClique();
  const second = Array.from(maxClique).sort().join(",");

  return {
    first,
    second,
  };
});
