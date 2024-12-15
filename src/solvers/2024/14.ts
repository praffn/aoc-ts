import { numericProduct } from "../../lib/iter";
import { makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { mod } from "../../lib/math";
import { createSolver } from "../../solution";

interface Robot {
  position: Vec2;
  velocity: Vec2;
}

// Updates the new position of the robots after n steps, wrapping around the dimensions
function step(robots: Array<Robot>, dimensions: Vec2, n: number) {
  for (const robot of robots) {
    robot.position.x = mod(
      robot.position.x + robot.velocity.x * n,
      dimensions.x
    );
    robot.position.y = mod(
      robot.position.y + robot.velocity.y * n,
      dimensions.y
    );
  }
}

const robotRe = /p=(-?\d+),(-?\d+) v=(-?\d+),(-?\d+)/;

// Returns true if there are at least 31 robots in a consecutive line at y=70
// This is a heuristic to detect the message
function robotsFormConsecutiveLine(robots: Array<Robot>) {
  const minLength = 31;

  const xValues = robots
    .filter((robot) => robot.position.y === 70)
    .map((robot) => robot.position.x)
    .sort((a, b) => a - b);

  let count = 1;
  for (let i = 1; i < xValues.length; i++) {
    if (xValues[i] - xValues[i - 1] === 1) {
      count++;
    } else {
      count = 1;
    }

    if (count >= minLength) {
      return true;
    }
  }

  return false;
}

export default createSolver(async (input) => {
  const width = 101;
  const height = 103;
  const dimensions = makeVec2(width, height);
  const robots: Array<Robot> = [];
  let stepCount = 100;

  for await (const line of input) {
    const [, _px, _py, _vx, _vy] = line.match(robotRe)!;
    const [px, py, vx, vy] = [_px, _py, _vx, _vy].map((n) =>
      Number.parseInt(n)
    );

    robots.push({
      position: makeVec2(px, py),
      velocity: makeVec2(vx, vy),
    });
  }

  // we step the robots 100 times for first part
  step(robots, dimensions, stepCount);
  // and now we figure out how many robots in each quadrant. Robots at borders
  // are ignored
  const quadrants = [0, 0, 0, 0];
  const halfWidth = Math.floor(width / 2);
  const halfHeight = Math.floor(height / 2);

  for (const robot of robots) {
    if (robot.position.x < halfWidth && robot.position.y < halfHeight) {
      quadrants[0]++;
    } else if (robot.position.x > halfWidth && robot.position.y < halfHeight) {
      quadrants[1]++;
    } else if (robot.position.x < halfWidth && robot.position.y > halfHeight) {
      quadrants[2]++;
    } else if (robot.position.x > halfWidth && robot.position.y > halfHeight) {
      quadrants[3]++;
    }
    // robot is exactly on the border, ignore it
  }

  // Not lets continue stepping through the robots until they form a consecutive
  // line of at least 31 robots at y=70
  while (true) {
    stepCount++;
    step(robots, dimensions, 1);
    if (robotsFormConsecutiveLine(robots)) {
      break;
    }
  }

  return {
    first: numericProduct(quadrants),
    second: stepCount,
  };
});
