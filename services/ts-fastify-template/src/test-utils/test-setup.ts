import { connect, type Models, type Sql } from '@puyogg/ts-postgres-template';
import { randomUUID } from 'crypto';
import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';
import { initApp, type App } from '../app.js';
import { adminDbName } from './global-setup.js';

const dbName = `test_${randomUUID().replaceAll('-', '')}`;

let sql: Sql;
let models: Models;
let app: App;

beforeAll(async () => {
  const { sql: adminSql } = connect({ database: adminDbName });

  // Recreate test db with randomized name, "test_abcdefg123"
  await adminSql`DROP DATABASE IF EXISTS ${adminSql(dbName)}`;
  await adminSql`CREATE DATABASE ${adminSql(dbName)} TEMPLATE ${adminSql(
    process.env.POSTGRES_DBNAME ?? 'db',
  )}`;
  await adminSql.end();

  ({ sql, models, app } = await initApp(dbName));
});

afterAll(async () => {
  await sql.end();

  const { sql: adminSql } = connect({ database: adminDbName });

  // Destroy randomized test db after test file is done
  await adminSql`DROP DATABASE IF EXISTS ${adminSql(dbName)}`;
  await adminSql.end();

  await app.close();
});

// Enable type-safe usage of augmented fixtures
declare module 'vitest' {
  export interface TestContext {
    sql: Sql;
    models: Models;
    app: App;
  }
}

// Also enables the augmented context to be used in test()
beforeEach((context) => {
  context.sql = sql;
  context.models = models;
  context.app = app;
});

afterEach((context) => {
  context.sql = sql;
  context.models = models;
  context.app = app;
});
