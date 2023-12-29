import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql``;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`SELECT 1`;
};
