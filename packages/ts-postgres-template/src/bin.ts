import { newTsDb } from './new-ts-db.js';

(async (): Promise<void> => {
  if (!process.argv[2]) {
    throw new Error('Missing packageName as positional argument');
  }

  await newTsDb(process.argv[2]);
})().catch((e) => console.error(e));
