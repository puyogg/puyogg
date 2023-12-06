import { describe, beforeAll, afterAll, expect, test } from 'vitest';
import { app, initApp } from '../app.js';

describe('/v1/add', () => {
  beforeAll(async () => {
    await initApp();
  });

  afterAll(async () => {
    await app.close();
  });

  test('3 + 6', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/add',
      body: {
        a: 3,
        b: 6,
      },
    });

    expect(res.body).toEqual('9');
  });
});
