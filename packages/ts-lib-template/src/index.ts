import { newLib } from './new-ts-lib.js';

(async (): Promise<void> => {
  if (!process.argv[2]) {
    throw new Error('Missing packageName as positional argument');
  }

  await newLib(process.argv[2]);
})().catch((e) => console.error(e));
