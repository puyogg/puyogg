import { afterEach, describe, expect, test } from 'vitest';

describe('Order', () => {
  afterEach(async ({ sql, models }) => {
    await sql`DELETE FROM ${sql(models.customerModel.tableName)}`;
  });

  test('automatically updates updated_at timestamp', async ({ models }) => {
    const customer = await models.customerModel.create({
      firstName: 'Yotarou',
      lastName: 'Tran',
      age: 24,
    });

    const updatedCustomer = await models.customerModel.updateOne(customer.id, {
      firstName: 'Ryoma',
    });

    expect(updatedCustomer?.updatedAt).toBeDefined();
    expect(updatedCustomer?.updatedAt.valueOf()).toBeGreaterThan(customer.updatedAt.valueOf());
  });
});
