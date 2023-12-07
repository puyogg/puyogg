import { describe, expect, test } from 'vitest';
import { Customer, CustomerCreate, OrderCreate } from '@puyogg/ts-postgres-template';

describe('POST /v1/order', () => {
  test('creates an order', async ({ app }) => {
    const customerRes = await app.inject({
      method: 'POST',
      url: '/v1/customer',
      body: {
        firstName: 'Yotarou',
        lastName: 'Tran',
        age: 24,
      } as CustomerCreate,
    });

    const customer = customerRes.json<Customer>();

    const res = await app.inject({
      method: 'POST',
      url: '/v1/order',
      body: {
        customerId: customer.id,
        item: 'MyItem',
        quantity: 2,
      } as OrderCreate,
    });

    expect(res.json()).toEqual(
      expect.objectContaining<OrderCreate>({
        customerId: customer.id,
        item: 'MyItem',
        quantity: 2,
      }),
    );
  });
});
