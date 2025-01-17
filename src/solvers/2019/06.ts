import { sum } from "../../lib/iter";
import { createSolverWithLineArray } from "../../solution";

type Planet = {
  name: string;
  orbits?: Planet;
};

function parseOrbits(input: Array<string>) {
  const orbitMap = new Map<string, Planet>();

  for (const line of input) {
    const [parent, child] = line.split(")");
    if (!orbitMap.has(parent)) {
      orbitMap.set(parent, { name: parent });
    }

    if (!orbitMap.has(child)) {
      orbitMap.set(child, { name: child });
    }

    orbitMap.get(child)!.orbits = orbitMap.get(parent);
  }

  return orbitMap;
}

function countOrbits(planet: Planet): number {
  if (!planet.orbits) {
    return 0;
  }

  return 1 + countOrbits(planet.orbits);
}

/**
 * Get all parents of a planet, i.e. the planet that the planet orbits, and all
 * the indirect roots. Return an array of the planet names in order.
 */
function getPlanetsToRoot(planet: Planet): Array<string> {
  const orbits: Array<string> = [];
  let current = planet;
  while (current.orbits) {
    orbits.push(current.orbits.name);
    current = current.orbits;
  }

  return orbits;
}

/**
 * Get the number of transfers between two planets. This is done by finding the
 * first common parent of the two planets, and then calculating the distance
 * from the two planets to the common parent.
 */
function getTransferCount(
  from: string,
  to: string,
  orbitMap: Map<string, Planet>
) {
  const fromPlanet = orbitMap.get(from)!;
  const toPlanet = orbitMap.get(to)!;

  const fromParents = getPlanetsToRoot(fromPlanet);
  const toParents = getPlanetsToRoot(toPlanet);

  const [firstCommonParent] = new Set(fromParents).intersection(
    new Set(toParents)
  );

  const fromDistanceToCommon = fromParents.indexOf(firstCommonParent);
  const toDistanceToCommon = toParents.indexOf(firstCommonParent);

  return fromDistanceToCommon + toDistanceToCommon;
}

export default createSolverWithLineArray(async (input) => {
  const orbitMap = parseOrbits(input);

  return {
    first: sum(orbitMap.values().map(countOrbits)),
    second: getTransferCount("YOU", "SAN", orbitMap),
  };
});
