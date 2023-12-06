import { describe, beforeAll, afterAll, expect, test } from 'vitest';
import { app, initApp } from '../app.js';

describe('/v1/hello', () => {
  beforeAll(async () => {
    await initApp();
  });

  afterAll(async () => {
    await app.close();
  });

  test('return hello', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/v1/hello',
    });

    expect(res.body).toEqual('Hello, world!');
  });
});
