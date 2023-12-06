import { describe, expect, test } from 'vitest';
import { generatePuyoPools } from '.';

describe('generator', () => {
  test(`doesn't throw`, () => {
    const [threeColor, fourColor, fiveColor] = generatePuyoPools(65535);

    expect(threeColor).toHaveLength(256);
    expect(fourColor).toHaveLength(256);
    expect(fiveColor).toHaveLength(256);
  });
});
