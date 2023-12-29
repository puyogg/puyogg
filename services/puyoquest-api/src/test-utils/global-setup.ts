import { connect } from '@puyogg/puyoquest-db';

export const adminDbName = 'admin_db';

export async function setup() {
  const { sql } = connect({ host: process.env.POSTGRES_HOST_TEST });

  await sql`DROP DATABASE IF EXISTS ${sql(adminDbName)}`;
  await sql`CREATE DATABASE ${sql(adminDbName)}`;
  await sql.end();
}
