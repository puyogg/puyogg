const INT_SIZE = 4; // Number of bytes in an integer

/** Rotates bits left */
function _rotl(value: number, shift: number): number {
  if ((shift &= INT_SIZE * 8 - 1) == 0) {
    return value >>> 0;
  }
  return ((value << shift) | (value >> (INT_SIZE * 8 - shift))) >>> 0;
}

/**
 * https://puyonexus.com/wiki/Puyo_Puyo_Tsu/Random_Number_Generator
 */
export class TsuRNG {
  private seed: number;
  private value: number;
  private tmp = 0;
  private i = 0;

  /**
   * https://puyonexus.com/wiki/Puyo_Puyo_Tsu/Random_Number_Generator
   * @param seed 32-bit unsigned integer. To get an unsigned 32-bit int in Javascript, use num >>> 0;
   */
  constructor(seed: number) {
    this.seed = seed;
    this.value = seed;
  }

  /** Return a value between 0 and 255 */
  public next(): number {
    const i = this.i;

    if (i % 2) {
      this.tmp = 0xf1;
    } else {
      this.tmp = 0xf0;
    }

    this.tmp = (this.tmp + this.value) >>> 0;
    this.tmp = (this.tmp + 0x00ff7fe8) >>> 0;
    this.tmp = _rotl(this.tmp, 5);
    this.tmp = (this.tmp + this.value) >>> 0;
    this.tmp = (this.tmp + 1) >>> 0;

    this.i++;
    this.value = this.tmp;
    return this.value & 0xff;
  }
}
