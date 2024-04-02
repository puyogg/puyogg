import { randomUUID } from 'crypto';
import { beforeAll, afterAll, beforeEach, afterEach } from 'vitest';
import { Models, connect } from '../db.js';
import { Sql } from 'postgres';
import { adminDbName } from './global-setup.js';
import type { PendingQuery, Row } from 'postgres';

const dbName = `test_${randomUUID().replaceAll('-', '')}`;

const { sql, models } = connect({ database: dbName });

const listAllTables = (tableNames: string[]): PendingQuery<Row[]> => {
  if (tableNames.length === 1) {
    return sql`${sql(tableNames[0])}`;
  }

  return sql`${sql(tableNames[0])}, ${listAllTables(tableNames.slice(1))}`;
};

beforeAll(async () => {
  const { sql: adminSql } = connect({ database: adminDbName });

  await adminSql`DROP DATABASE IF EXISTS ${adminSql(dbName)}`;
  await adminSql`CREATE DATABASE ${adminSql(dbName)} TEMPLATE ${adminSql(
    process.env.POSTGRES_DBNAME ?? 'ppqdb',
  )}`;

  await adminSql.end();

  const tableNames = Object.values(models).map((m) => m.tableName);
  await sql`TRUNCATE ${listAllTables(tableNames)}`;
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
