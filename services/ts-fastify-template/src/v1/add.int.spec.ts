import { describe, expect, test } from 'vitest';

describe('/v1/add', () => {
  test('3 + 6', async ({ app }) => {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/add',
      body: {
        a: 3,
        b: 6,
      },
    });

    expect(res.json()).toEqual(9);
  });
});
