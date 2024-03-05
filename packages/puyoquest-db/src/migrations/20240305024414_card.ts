import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE TABLE IF NOT EXISTS card (
      card_id TEXT PRIMARY KEY,
      char_id TEXT NOT NULL,
      rarity TEXT NOT NULL,
      rarity_modifier TEXT,
      name TEXT NOT NULL,
      name_normalized TEXT NOT NULL,
      jp_name TEXT,
      jp_name_normalized TEXT,
      link_name TEXT NOT NULL,
      link_name_normalized TEXT NOT NULL,
      card_type TEXT NOT NULL,
      main_color TEXT NOT NULL,
      side_color TEXT,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      CONSTRAINT fk_characters FOREIGN KEY (char_id) REFERENCES character(char_id) ON DELETE CASCADE
    )`;

    await sql`CREATE INDEX on card (char_id)`;
    await sql`CREATE INDEX on card (name_normalized)`;
    await sql`CREATE INDEX on card (jp_name_normalized)`;
    await sql`CREATE INDEX on card (link_name_normalized)`;

    await sql`
      CREATE TRIGGER card_updated_at
      BEFORE UPDATE ON card
      FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp()
    `;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`DROP TABLE IF EXISTS card`;
};
