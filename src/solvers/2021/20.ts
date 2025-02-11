import { StructuralSet } from "../../lib/collections/structural-set";
import { minMax, range } from "../../lib/iter";
import { key, makeVec2, type Vec2 } from "../../lib/linalg/vec2";
import { createSolverWithString } from "../../solution";

type Algorithm = Array<boolean>;

type Image = {
  min: Vec2;
  max: Vec2;
  pixels: StructuralSet<Vec2>;
};

/**
 * Parses the input returning a pair containing the algorithm and the input
 * image. The input image is represented as a set of *on* pixel coordinates and
 * a bounding box. The algorithm is a 512 element array of booleans.
 */
function parse(input: string): [algorithm: Algorithm, input: Image] {
  const [algorithmString, inputImage] = input.split("\n\n");

  const algorithm = algorithmString.split("").map((c) => c === "#");

  const pixels = new StructuralSet(key);

  const inputImageLines = inputImage.split("\n");
  for (let y = 0; y < inputImageLines.length; y++) {
    for (let x = 0; x < inputImageLines[y].length; x++) {
      if (inputImageLines[y][x] === "#") {
        pixels.add(makeVec2(x, y));
      }
    }
  }

  const [minX, maxX] = minMax(pixels, (p) => p.x);
  const [minY, maxY] = minMax(pixels, (p) => p.y);
  const image: Image = {
    min: makeVec2(minX, minY),
    max: makeVec2(maxX, maxY),
    pixels,
  };

  return [algorithm, image];
}

/**
 * `kernel` return a 9-bit number representing the top to bottom, left to right
 * order of the 3x3 grid of pixels centered at (x, y). The bits are set to 1 if
 * the corresponding pixel is on, and 0 if it is off. This is reversed if `on`
 * is false.
 */
function kernel(
  pixels: StructuralSet<Vec2>,
  x: number,
  y: number,
  on: boolean
): number {
  let result = 0;
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      result <<= 1;

      if (pixels.has(makeVec2(x + dx, y + dy)) === on) {
        result |= 1;
      }
    }
  }

  return result;
}

/**
 * Enhances the image using the given algorithm. The image is expanded by 2
 * pixels in each direction. The `on` parameter determines whether the algorithm
 * is considers the provided pixels to be on or off.
 */
function enhance(image: Image, algorithm: Algorithm, on: boolean): Image {
  const newPixels = new StructuralSet(key);
  const newMin = makeVec2(image.min.x - 2, image.min.y - 2);
  const newMax = makeVec2(image.max.x + 2, image.max.y + 2);

  for (let y = newMin.y; y <= newMax.y; y++) {
    for (let x = newMin.x; x <= newMax.x; x++) {
      const k = kernel(image.pixels, x, y, on);
      if (algorithm[k] !== on) {
        newPixels.add(makeVec2(x, y));
      }
    }
  }

  return {
    min: newMin,
    max: newMax,
    pixels: newPixels,
  };
}

export default createSolverWithString(async (inputString) => {
  let [algorithm, input] = parse(inputString);

  let first = -1;
  for (const i of range(50)) {
    if (i === 2) {
      first = input.pixels.size;
    }
    input = enhance(input, algorithm, i % 2 === 0);
  }
  return {
    first,
    second: input.pixels.size,
  };
});
