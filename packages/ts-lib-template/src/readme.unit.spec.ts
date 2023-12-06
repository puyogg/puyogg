import { expect, test } from 'vitest';
import { readme } from './readme.js';

test('creates readme string with checklist and header', async () => {
  const result = await readme('MyPackage');
  expect(result).toMatchSnapshot();
});
