import { newApi } from './new-ts-api.js';

(async () => {
  if (!process.argv[2]) {
    throw new Error('Missing packageName as positional argument');
  }

  await newApi(process.argv[2]);
})().catch((e) => console.error(e));
