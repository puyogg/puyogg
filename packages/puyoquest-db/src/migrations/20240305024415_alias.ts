import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE TABLE IF NOT EXISTS alias (
      alias TEXT PRIMARY KEY,
      char_id TEXT NOT NULL,
      internal BOOLEAN NOT NULL,
      card_type TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_characters FOREIGN KEY (char_id) REFERENCES character(char_id) ON DELETE CASCADE
    )`;

    await sql`CREATE INDEX on alias (char_id)`;

    await sql`
      CREATE TRIGGER alias_updated_at
      BEFORE UPDATE ON alias
      FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp()
    `;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`DROP TABLE IF EXISTS alias`;
};
