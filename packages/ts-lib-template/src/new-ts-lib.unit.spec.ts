import { expect, test, vi } from 'vitest';
import { newLib } from './new-ts-lib.js';

vi.mock('./new-ts-lib.js');

const mockNewLib = vi.mocked(newLib);

test('example mock', async () => {
  // Force a fn with a void return type to return a string
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
  mockNewLib.mockReturnValue('mocked' as any);

  const result = await newLib('MyPackage');
  expect(result).toEqual('mocked');

  mockNewLib.mockReset();
});
