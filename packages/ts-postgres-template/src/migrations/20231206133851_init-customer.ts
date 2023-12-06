import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    await sql`CREATE TABLE customer (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      first_name text NOT NULL,
      last_name text NOT NULL,
      age int NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW(),
      updated_at timestamptz NOT NULL DEFAULT NOW()
    )`;

    await sql`
      CREATE TRIGGER customer_updated_at
      BEFORE UPDATE ON customer
      FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp()
    `;
  });
};

export const down = async (sql: Sql) => {
  await sql`DROP TABLE customer`;
};
