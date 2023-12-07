import { describe, expect, test } from 'vitest';

describe('/v1/hello', () => {
  test('return hello', async ({ app }) => {
    const res = await app.inject({
      method: 'GET',
      url: '/v1/hello',
    });

    expect(res.body).toEqual('Hello, world!');
  });
});
