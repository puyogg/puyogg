import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE TABLE IF NOT EXISTS character (
      char_id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      jp_name TEXT NOT NULL,
      link_name TEXT NOT NULL,
      main_color TEXT,
      side_color TEXT,
      type1 TEXT,
      type2 TEXT,
      voice_trans TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    )`;

    await sql`CREATE INDEX ON character (name)`;
    await sql`CREATE INDEX ON character (jp_name)`;

    await sql`
      CREATE TRIGGER character_updated_at
      BEFORE UPDATE ON character
      FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp()
    `;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`DROP TABLE character`;
};
