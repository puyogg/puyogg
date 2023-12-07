import { afterEach, describe, expect, test } from 'vitest';
import { Order } from './order.js';

describe('Order', () => {
  afterEach(async ({ sql, models }) => {
    await sql`DELETE FROM ${sql(models.customerModel.tableName)}`;
    await sql`TRUNCATE ${sql(models.orderModel.tableName)}`;
  });

  test('db item matches zod schema', async ({ models }) => {
    const customer = await models.customerModel.create({
      firstName: 'Yotarou',
      lastName: 'Tran',
      age: 24,
    });
    const order = await models.orderModel.create({
      customerId: customer.id,
      item: 'MyItem1',
      quantity: 1,
    });

    const result = Order.safeParse(order);
    expect(result.success).toBe(true);
  });

  test('automatically updates updated_at timestamp', async ({ models }) => {
    const customer = await models.customerModel.create({
      firstName: 'Yotarou',
      lastName: 'Tran',
      age: 24,
    });
    const order = await models.orderModel.create({
      customerId: customer.id,
      item: 'MyItem1',
      quantity: 1,
    });

    const updatedOrder = await models.orderModel.updateOne(order.id, { quantity: 2 });

    expect(updatedOrder?.updatedAt).toBeDefined();
    expect(updatedOrder?.updatedAt.valueOf()).toBeGreaterThan(order.updatedAt.valueOf());
  });

  test('cascade delete when customer is deleted', async ({ sql, models }) => {
    const customer = await models.customerModel.create({
      firstName: 'Yotarou',
      lastName: 'Tran',
      age: 24,
    });
    await models.orderModel.create({
      customerId: customer.id,
      item: 'MyItem1',
      quantity: 1,
    });

    const ordersBefore = await sql`SELECT * FROM ${sql(models.orderModel.tableName)}`;
    expect(ordersBefore).toHaveLength(1);

    await models.customerModel.deleteOne(customer.id);

    const ordersAfter = await sql`SELECT * FROM ${sql(models.orderModel.tableName)}`;
    expect(ordersAfter).toHaveLength(0);
  });

  test('only finds orders matching quantity', async ({ models }) => {
    const customer = await models.customerModel.create({
      firstName: 'Yotarou',
      lastName: 'Tran',
      age: 24,
    });
    const order1A = await models.orderModel.create({
      customerId: customer.id,
      item: 'A',
      quantity: 1,
    });

    const order1B = await models.orderModel.create({
      customerId: customer.id,
      item: 'B',
      quantity: 1,
    });

    const order2 = await models.orderModel.create({
      customerId: customer.id,
      item: 'Z',
      quantity: 2,
    });

    const orders = await models.orderModel.findByQuantity(1);
    expect(orders).toHaveLength(2);
    expect(orders).toEqual(expect.arrayContaining([{ id: order1A.id }, { id: order1B.id }]));
    expect(orders).not.toContainEqual({ id: order2.id });
  });
});
