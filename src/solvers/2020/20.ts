import { Array2D } from "../../lib/collections/array2d";
import { numericProduct, range, zip } from "../../lib/iter";
import { createSolverWithString } from "../../solution";

// Code here is heavily inspired by Seth Geoghegan's solution:
//    https://sethgeoghegan.com/advent-of-code-2020

/**
 * Returns the set of all edges of a tile, including reversed edges.
 */
function computeAllEdges(data: Array2D<string>) {
  const edges = new Set<string>();
  // Top
  edges.add([...data.row(0)].join(""));
  // Right
  edges.add([...data.column(-1)].join(""));
  // Bottom
  edges.add([...data.row(-1)].join(""));
  // Left
  edges.add([...data.column(0)].join(""));

  for (const edge of edges) {
    edges.add([...edge].reverse().join(""));
  }

  return edges;
}

type Side = "top" | "right" | "bottom" | "left";
const SIDES: Record<Side, number> = {
  top: 0,
  right: 1,
  bottom: 2,
  left: 3,
};

/*
 * Ok assume we have a tile where we label the edges like so:
 *         A
 *       #####
 *     D #   # B
 *       #####
 *         C
 *
 * If we flip it horizontally, A and C will be in reverse, while B and D will
 * be intact, but on other sides of the tile. We can relabel A and C to E and G:
 *         A                          E
 *       #####                      #####
 *     D #   # B     ---FLIP-->   B #   # D
 *       #####                      #####
 *         C                          G
 *
 * We can do the same for vertical flips and rotations. Let's define an
 * "EDGE_STATE" to be the four edges of a tile in a given rotation followed
 * by the four edges of the tile after flipping. The above example would thus
 * be: A, B, C, D, E, D, G, B.
 *
 * We can rotate the original tile 3 times before ending back at the original
 * tile, which means any rotation and flipping can be represented by 4 of these
 * states. Keeping track of rotations and whether a tile is flipped, allows us
 * to then easily determine which edge is up, down, left or right.
 */

const EDGE_LABELS = ["a", "b", "c", "d", "e", "f", "g", "h"];
const EDGE_STATES = [
  ["a", "b", "c", "d", "e", "d", "g", "b"], // 0°
  ["h", "a", "f", "c", "d", "c", "b", "a"], // 90°
  ["g", "h", "e", "f", "c", "f", "a", "h"], // 180°
  ["b", "g", "d", "e", "f", "e", "h", "g"], // 270°
];

class Tile {
  id: number;
  // The actual tile data
  data: Array2D<string>;
  // The set of the tile's edges
  allEdges: Set<string> = new Set();
  // A map from an edge label to the actual edge, e.g. 'h' -> '#...##.#'
  edgeMap: Map<string, string> = new Map();

  // Whether the tile is flipped
  #flipped = false;
  // How many rotations (mod 4) the tile has undergone
  #rotations = 0;

  constructor(id: number, data: Array<string>) {
    this.id = id;
    this.data = new Array2D(data.map((l) => l.split("")));
    this.allEdges = computeAllEdges(this.data);
    this.edgeMap = new Map(zip(EDGE_LABELS, this.allEdges));
  }

  /**
   * Applies the rotations and flips to a copy of the data
   * and returns the result
   */
  apply() {
    const copy = this.data.clone();
    copy.rotateCW(this.#rotations);
    if (this.#flipped) {
      copy.flipHorizontal();
    }

    return copy;
  }

  /**
   * Toggle whether flipped or not
   */
  flip() {
    this.#flipped = !this.#flipped;
  }

  /**
   * Increments the number of rotations
   */
  rotate() {
    this.#rotations = (this.#rotations + 1) % 4;
  }

  /**
   * Returns the set of edges shared with the given tile
   */
  sharedEdges(other: Tile) {
    return this.allEdges.intersection(other.allEdges);
  }

  /**
   * Returns true if the tile has the given edge
   */
  hasEdge(edge: string) {
    return this.allEdges.has(edge);
  }

  /**
   * Returns true if the two tiles are neighbors,
   * i.e. they share at least one edge
   */
  isNeighborOf(other: Tile) {
    return this !== other && this.sharedEdges(other).size > 0;
  }

  /**
   * Returns the edges for the given label (see EDGE_LABELS)
   */
  edgeFor(label: string) {
    return this.edgeMap.get(label)!;
  }

  /**
   * Returns the edge at the given side, taking current rotation and flip
   * state into account
   */
  edgeAt(side: Side) {
    const edgeIndex = this.#flipped ? SIDES[side] + 4 : SIDES[side];
    return this.edgeFor(EDGE_STATES[this.#rotations][edgeIndex]);
  }

  /**
   * Rotates and flips the tile until the given side of the tile matches the
   * given edge. Returns true if successful, false otherwise.
   */
  arrange(side: Side, edge: string) {
    if (!this.hasEdge(edge)) {
      return false;
    }

    for (const i of range(8)) {
      if (this.edgeAt(side) === edge) {
        return true;
      }

      i === 3 ? this.flip() : this.rotate();
    }
  }

  toString() {
    return this.data.toString();
  }
}

class Image {
  size: number;
  tiles: Array<Tile>;
  // An adjacency list of all tiles to their respective neighbors
  neighbors: Map<Tile, Array<Tile>>;

  placed: Set<Tile> = new Set();
  image: Array2D<string>;

  constructor(tiles: Array<Tile>) {
    this.size = Math.sqrt(tiles.length);
    this.image = new Array2D(this.size * 8);
    this.tiles = tiles;
    this.neighbors = new Map(
      tiles.map((tile) => [tile, tiles.filter((t) => tile.isNeighborOf(t))])
    );
  }

  /**
   * Iterator over all the corner tiles, i.e. the tiles that have exactly two
   * neighboring tiles.
   */
  corners() {
    return this.neighbors
      .entries()
      .filter(([, neighbors]) => neighbors.length === 2)
      .map(([tile]) => tile);
  }

  /**
   * Reassembles the image such that all tiles are rotated, flipped and placed
   * correctly. Returns the final image.
   */
  reassemble() {
    // Lets pick the first corner tile
    const corner = this.corners().next().value!;
    // We can determine the orientation of the corner tile by looking at its
    // two neighbors
    const [n1, n2] = this.neighbors.get(corner)!.map((t) => {
      return t.sharedEdges(corner);
    });

    // Lets rotate and flip until the corner tile is in the correct orientation
    for (const i of range(8)) {
      if (n1.has(corner.edgeAt("right")) && n2.has(corner.edgeAt("bottom"))) {
        break;
      }
      i === 3 ? corner.flip() : corner.rotate();
    }

    // now its correct, place it in the final image, and continue assembling
    this.placeTile(corner, 0, 0);
    this.assembleImage(corner, 0, 0);

    return this.image;
  }

  placeTile(tile: Tile, x: number, y: number) {
    const data = tile.apply().trim();
    this.placed.add(tile);
    this.image.paste(x * 8, y * 8, data);
  }

  /**
   * **SHOULD ONLY BE CALLED BY reassemble()**
   * Recursively assembles the image by placing tiles next to each other
   */
  assembleImage(tile: Tile, x: number, y: number) {
    if (x >= this.size || y >= this.size) {
      // done case
      return;
    }

    // `tile` is a tile that has just been placed, so now we need to find
    // a neighbor to place next to it. We loop through all neighbors, skipping
    // already placed tiles.
    for (const t of this.neighbors.get(tile)!) {
      if (this.placed.has(t)) {
        continue;
      }

      // Now check arrange the tile such that it can be put next to the last
      // placed tile. Recurse with this newly placed tile
      if (t.hasEdge(tile.edgeAt("right"))) {
        t.arrange("left", tile.edgeAt("right"));
        this.placeTile(t, x + 1, y);
        this.assembleImage(t, x + 1, y);
      } else if (t.hasEdge(tile.edgeAt("bottom"))) {
        t.arrange("top", tile.edgeAt("bottom"));
        this.placeTile(t, x, y + 1);
        this.assembleImage(t, x, y + 1);
      }
    }
  }
}

/**
 * Returns an array of `Tile` instances from the input string
 */
function parseTiles(input: string) {
  const rawTiles = input.split("\n\n");
  const tiles: Array<Tile> = [];

  for (const rawTile of rawTiles) {
    const lines = rawTile.split("\n");
    const id = parseInt(lines[0].slice(5, -1));
    const data = lines.slice(1);
    tiles.push(new Tile(id, data));
  }

  return tiles;
}

/**
 * Tries to find the given pattern in the image and returns the number of
 * occurrences times the number of tiles in the pattern.
 * If the pattern is not found, the image will be rotated and flipped until the
 * pattern is found (or rotations/flips exhausted)
 */
function scanImage(image: Array2D<string>, pattern: string) {
  // First lets turn the pattern string into just an array of coordinates
  // to check for. Space characters are ignored, and '#' characters are
  // turned into [x, y] pairs.
  const patternCoords = pattern
    .split("\n")
    .map((line, y) => {
      return line
        .split("")
        .map((c, x) => {
          return c === "#" ? ([x, y] as const) : null;
        })
        .filter((c) => c !== null);
    })
    .flat();

  // Now lets find the maxX and maxY of the pattern. We cannot check for the
  // pattern if it would go out of bounds.
  const maxX = patternCoords.reduce((m, [x]) => Math.max(m, x), 0);
  const maxY = patternCoords.reduce((m, [, y]) => Math.max(m, y), 0);

  // We need to rotate and flip the image until we find the pattern
  for (const i of range(8)) {
    // Now we can scan from x = 0 -> width - maxX and y = 0 -> height - maxY
    // At each coordinate we start iterating over the pattern coordinates and
    // see if they match the image.
    let found = 0;
    for (let y = 0; y < image.height - maxY; y++) {
      outer: for (let x = 0; x < image.width - maxX; x++) {
        for (const [dx, dy] of patternCoords) {
          if (image.get(x + dx, y + dy) !== "#") {
            continue outer;
          }
        }

        found++;
      }
    }

    // If any match was found, return the number of matches and we're done!
    if (found > 0) {
      return found * patternCoords.length;
    }

    i === 3 ? image.flipHorizontal() : image.rotateCW();
  }

  // rip, no matches
  return -1;
}

/**
 * Returns the water roughness (solution to part 2)
 * Water roughness is the total number of '#' characters minus the '#'
 * characters that combose the sea monster(s)
 */
function findWaterRoughness(image: Array2D<string>) {
  const monster = `                  # 
#    ##    ##    ###
 #  #  #  #  #  #   `;

  const totalNonEmptyTiles = image.count((c) => c === "#");
  const totalMonsterTiles = scanImage(image, monster);

  return totalNonEmptyTiles - totalMonsterTiles;
}

export default createSolverWithString(async (input) => {
  const tiles = parseTiles(input);
  const image = new Image(tiles);
  const finalImage = image.reassemble();

  return {
    first: numericProduct(image.corners().map((t) => t.id)),
    second: findWaterRoughness(finalImage),
  };
});
