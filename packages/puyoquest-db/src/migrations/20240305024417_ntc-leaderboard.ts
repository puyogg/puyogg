import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE TABLE IF NOT EXISTS ntc_leaderboard (
      server_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      correct INTEGER NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      PRIMARY KEY(server_id, user_id)
    )`;

    await sql`
      CREATE TRIGGER ntc_leaderboard_updated_at
      BEFORE UPDATE ON ntc_leaderboard
      FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp()
    `;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`DROP TABLE IF EXISTS ntc_leaderboard`;
};
