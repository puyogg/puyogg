import { randomUUID } from 'crypto';
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { Models, connect } from '../db.js';
import { Sql } from 'postgres';
import { adminDbName } from './global-setup.js';

const dbName = `test_${randomUUID().replaceAll('-', '')}`;

const { sql, models } = connect({ database: dbName });

beforeAll(async () => {
  const { sql: adminSql } = connect({ database: adminDbName });

  await adminSql`DROP DATABASE IF EXISTS ${adminSql(dbName)}`;
  await adminSql`CREATE DATABASE ${adminSql(dbName)} TEMPLATE ${adminSql(
    process.env.POSTGRES_DBNAME ?? 'ppqdb',
  )}`;

  await adminSql.end();
});

afterAll(async () => {
  await sql.end();

  const { sql: adminSql } = connect({ database: adminDbName });

  await adminSql`DROP DATABASE IF EXISTS ${adminSql(dbName)}`;
  await adminSql.end();
});

declare module 'vitest' {
  export interface TestContext {
    sql: Sql;
    models: Models;
  }
}

beforeEach((context) => {
  context.sql = sql;
  context.models = models;
});

afterEach((context) => {
  context.sql = sql;
  context.models = models;
});
