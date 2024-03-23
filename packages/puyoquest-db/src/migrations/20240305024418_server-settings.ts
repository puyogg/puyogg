import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE TABLE IF NOT EXISTS server_settings (
      server_id TEXT PRIMARY KEY,
      leaderboard_channel TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`;

    await sql`
      CREATE TRIGGER server_settings_updated_at
      BEFORE UPDATE ON server_settings
      FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp()
    `;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`DROP TABLE IF EXISTS server_settings`;
};
