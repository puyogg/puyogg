import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE TABLE IF NOT EXISTS cron_last_updated (
      task TEXT PRIMARY KEY,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    await sql`
      CREATE TRIGGER cron_last_updated_updated_at
      BEFORE UPDATE ON cron_last_updated
      FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp()
    `;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`DROP TABLE IF EXISTS cron_last_updated`;
};
