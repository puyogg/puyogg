import { connect } from '../db.js';

export const adminDbName = 'admin_db';

export async function setup() {
  const { sql } = connect();

  await sql`DROP DATABASE IF EXISTS ${sql(adminDbName)}`;
  await sql`CREATE DATABASE ${sql(adminDbName)}`;
  await sql.end();
}
