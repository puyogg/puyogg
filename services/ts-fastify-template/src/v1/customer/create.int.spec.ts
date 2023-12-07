import { describe, expect, test } from 'vitest';
import type { CustomerCreate } from '@puyogg/ts-postgres-template';

describe('POST /v1/customer', () => {
  test('creates a customer', async ({ app }) => {
    const res = await app.inject({
      method: 'POST',
      url: '/v1/customer',
      body: {
        firstName: 'Yotarou',
        lastName: 'Tran',
        age: 24,
      } as CustomerCreate,
    });

    expect(res.json()).toEqual(
      expect.objectContaining<CustomerCreate>({
        firstName: 'Yotarou',
        lastName: 'Tran',
        age: 24,
      }),
    );
  });
});
