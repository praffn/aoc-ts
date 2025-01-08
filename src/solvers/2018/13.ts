import {
  makeVec2,
  type Vec2,
  directions,
  add,
  equals,
} from "../../lib/linalg/vec2";
import { createSolverWithLineArray } from "../../solution";

type Cart = {
  position: Vec2;
  direction: Vec2;
  intersectionCount: number;
};

const cartMap: Record<string, [Vec2, string]> = {
  ">": [directions.east, "-"],
  "<": [directions.west, "-"],
  "^": [directions.north, "|"],
  v: [directions.south, "|"],
};

function turnLeft(direction: Vec2): Vec2 {
  return makeVec2(direction.y, -direction.x);
}

function turnRight(direction: Vec2): Vec2 {
  return makeVec2(-direction.y, direction.x);
}

function step(track: Array<Array<string>>, carts: Set<Cart>): Array<Vec2> {
  // Carts move first by lowest y, then lowest x
  const sortedCarts = [...carts].sort((a, b) => {
    if (a.position.y === b.position.y) {
      return a.position.x - b.position.x;
    }

    return a.position.y - b.position.y;
  });

  const crashes: Array<Vec2> = [];

  for (const cart of sortedCarts) {
    const nextPosition = add(cart.position, cart.direction);
    const nextTrack = track[nextPosition.y][nextPosition.x];

    // So this cart has moved, lets check if it crashed into any other cart
    for (const otherCart of carts) {
      if (otherCart === cart) {
        continue;
      }

      if (equals(otherCart.position, nextPosition)) {
        // it crashed. Lets remove it and the cart it crashed with
        carts.delete(cart);
        carts.delete(otherCart);
        crashes.push(nextPosition);
      }
    }

    if (nextTrack === "+") {
      // Intersection -- turn left, straight, or right
      cart.direction =
        cart.intersectionCount % 3 === 0
          ? turnLeft(cart.direction)
          : cart.intersectionCount % 3 === 1
          ? cart.direction
          : turnRight(cart.direction);
      cart.intersectionCount++;
    } else if (nextTrack === "/") {
      cart.direction =
        cart.direction.x === 0
          ? turnRight(cart.direction)
          : turnLeft(cart.direction);
    } else if (nextTrack === "\\") {
      cart.direction =
        cart.direction.x === 0
          ? turnLeft(cart.direction)
          : turnRight(cart.direction);
    }

    cart.position = nextPosition;
  }

  return crashes;
}

export default createSolverWithLineArray(async (input) => {
  const track = input.map((line) => line.split(""));
  const carts = new Set<Cart>();

  for (let y = 0; y < track.length; y++) {
    for (let x = 0; x < track[y].length; x++) {
      const c = track[y][x];
      if (c in cartMap) {
        carts.add({
          position: makeVec2(x, y),
          direction: cartMap[c][0],
          intersectionCount: 0,
        });
        track[y][x] = cartMap[c][1];
      }
    }
  }

  let allChrashes: Array<Vec2> = [];
  while (true) {
    allChrashes.push(...step(track, carts));
    if (carts.size === 1) {
      break;
    }
  }

  const lastCart = [...carts][0];

  return {
    first: `${allChrashes[0].x},${allChrashes[0].y}`,
    second: `${lastCart.position.x},${lastCart.position.y}`,
  };
});
