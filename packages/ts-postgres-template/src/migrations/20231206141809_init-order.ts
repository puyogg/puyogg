import type { Sql } from 'postgres';

export const description = 'Optional migration description.';

export const up = async (sql: Sql) => {
  await sql.begin(async (sql) => {
    await sql`CREATE TABLE "order" (
      id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
      customer_id uuid NOT NULL,
      item text NOT NULL,
      quantity int NOT NULL,
      created_at timestamptz NOT NULL DEFAULT NOW(),
      updated_at timestamptz NOT NULL DEFAULT NOW(),
      FOREIGN KEY (customer_id) REFERENCES customer(id) ON DELETE CASCADE
    )`;

    await sql`
      CREATE TRIGGER order_updated_at
      BEFORE UPDATE ON "order"
      FOR EACH ROW EXECUTE PROCEDURE on_update_timestamp()
    `;
  });
};

// If your change isn't supported by Postgres transactions
export const down = async (sql: Sql) => {
  await sql`DROP TABLE order`;
};
