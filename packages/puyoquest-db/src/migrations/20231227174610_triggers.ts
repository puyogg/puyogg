import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE OR REPLACE FUNCTION on_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';`;

    await sql`SET timezone = 'UTC'`;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`DROP FUNCTION on_update_timestamp`;
};
