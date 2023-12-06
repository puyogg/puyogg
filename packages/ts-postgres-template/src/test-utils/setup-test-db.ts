import postgres from 'postgres';
import { adminDbName } from './global-setup.js';
import { Db } from '../db.js';
import { randomUUID } from 'crypto';

const randomTestId = (): string => {
  return `test_${randomUUID().replaceAll('-', '')}`;
};

export const setupTestDb = async (name: string = randomTestId()) => {
  const { sql: adminSql } = Db({
    transform: postgres.camel,
    onnotice: () => undefined,
    host: process.env.POSTGRES_HOST ?? '0.0.0.0',
    port: parseInt(process.env.POSTGRES_PORT ?? '5432', 10),
    user: process.env.POSTGRES_USER ?? 'postgres',
    database: adminDbName,
    password: process.env.POSTGRES_PASSWORD ?? 'password',
  });

  await adminSql`DROP DATABASE IF EXISTS ${adminSql(name)}`;
  await adminSql`CREATE DATABASE ${adminSql(name)} TEMPLATE ${adminSql(
    process.env.POSTGRES_DBNAME ?? 'db',
  )}`;

  await adminSql.end();
  return name;
};
