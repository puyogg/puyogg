import type { Sql } from 'postgres';
import { Models, connectTestDb } from '../db.js';
import { setupTestDb } from '../test-utils/setup-test-db.js';
import { afterAll, beforeAll, afterEach, describe, expect, test } from 'vitest';
import { Order } from './order.js';

describe('Order', () => {
  let sql: Sql;
  let models: Models;

  beforeAll(async () => {
    const dbName = await setupTestDb();
    ({ sql, models } = connectTestDb(dbName));
  });

  afterAll(async () => {
    await sql.end();
  });

  afterEach(async () => {
    await sql`DELETE FROM ${sql(models.customerModel.tableName)}`;
    await sql`TRUNCATE ${sql(models.orderModel.tableName)}`;
  });

  test('db item matches zod schema', async () => {
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

  test('automatically updates updated_at timestamp', async () => {
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

  test('cascade delete when customer is deleted', async () => {
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
});
