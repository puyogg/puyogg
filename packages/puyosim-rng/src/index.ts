import { TsuRNG } from './rng';

/**
 * Generates the 3 color, 4 color, and 5 color Puyo pools based on the inputted chain seed.
 * @param seed 32-bit unsigned integer. You can get unsigned ints in JS using 'x >>> 0'
 * @param codes Codes for Puyo Colors: red, green, blue, yellow, purple. Default: [R:1, G:2, B:3, Y:4, P:5].
 * @returns Tuple with the three pools: 3 color, 4 color, 5 color
 */
export function generatePuyoPools(
  seed: number,
  codes = [1, 2, 3, 4, 5],
): [number[], number[], number[]] {
  const RNG = new TsuRNG(seed);

  // Initialize pools
  const pool1: number[] = Array<number>(256);
  const pool2: number[] = Array<number>(256);
  const pool3: number[] = Array<number>(256);
  for (let i = 0; i < 256; i++) {
    pool1[i] = codes[i % 3]; // 3 Color
    pool2[i] = codes[i % 4]; // 4 Color
    pool3[i] = codes[i % 5]; // 5 Color
  }

  // Shuffle
  for (const pool of [pool1, pool2, pool3]) {
    for (let i = 255; i >= 0; i--) {
      const ind = RNG.next(); // Number between 0 and 255
      const tmp = pool[ind];
      pool[ind] = pool[i];
      pool[i] = tmp;
    }
  }

  // Overwrite initial pairs in higher color pools
  for (let i = 0; i < 4; i++) {
    pool2[i] = pool1[i];
    pool3[i] = pool1[i];
  }
  for (let i = 4; i < 8; i++) {
    pool3[i] = pool2[i];
  }

  return [pool1, pool2, pool3];
}
