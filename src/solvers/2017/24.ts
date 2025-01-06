import { createSolver } from "../../solution";

type Piece = {
  a: number;
  b: number;
};

function* generateBridge(
  pieces: Array<Piece>,
  currentBridge: Array<Piece> = [],
  lastConnector = 0
): Generator<Array<Piece>> {
  const availablePieces = pieces.filter((p) => {
    return lastConnector === p.a || lastConnector === p.b;
  });

  if (availablePieces.length === 0) {
    return yield currentBridge;
  }

  for (const piece of availablePieces) {
    const newBridge = [...currentBridge, piece];
    const newLastConnector = piece.a === lastConnector ? piece.b : piece.a;
    yield* generateBridge(
      pieces.filter((p) => p !== piece),
      newBridge,
      newLastConnector
    );
  }
}

export default createSolver(async (input) => {
  const pieces: Array<Piece> = [];
  for await (const line of input) {
    const [a, b] = line.split("/").map((n) => Number.parseInt(n));
    pieces.push({ a, b });
  }

  let maxStrength = 0;
  let maxLength = 0;
  let maxStrengthLongest = 0;
  for (const bridge of generateBridge(pieces)) {
    const strength = bridge.reduce((acc, piece) => {
      return acc + piece.a + piece.b;
    }, 0);

    maxStrength = Math.max(maxStrength, strength);

    if (bridge.length >= maxLength) {
      maxLength = bridge.length;
      maxStrengthLongest = Math.max(maxStrengthLongest, strength);
    }
  }

  return {
    first: maxStrength,
    second: maxStrengthLongest,
  };
});
