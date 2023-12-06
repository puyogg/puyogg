import type { Sql } from 'postgres';
import { Models, connectTestDb } from '../db.js';
import { setupTestDb } from '../test-utils/setup-test-db.js';
import { afterAll, beforeAll, afterEach, describe, expect, test } from 'vitest';

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
  });

  test('automatically updates updated_at timestamp', async () => {
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
