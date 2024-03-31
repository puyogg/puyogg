import { z } from 'zod';
import { Model } from '../types/model.js';
import { PendingQuery, Sql } from 'postgres';

export const Alias = z.object({
  alias: z.string(),
  charId: z.string(),
  internal: z.boolean(),
  cardType: z.enum(['character', 'material']),
  updatedAt: z.date(),
});
export type Alias = z.infer<typeof Alias>;

export const AliasCreate = Alias.partial({
  updatedAt: true,
});
export type AliasCreate = z.infer<typeof AliasCreate>;

export class AliasModel extends Model<typeof Alias, typeof AliasCreate> {
  constructor(sql: Sql) {
    super(sql, 'alias', Alias, 'alias');
  }

  async upsert(params: AliasCreate): Promise<Alias> {
    const { sql, tableName } = this;

    const [alias] = await sql<Alias[]>`
      INSERT INTO ${sql(tableName)}
      ${sql(params)}
      ON CONFLICT (alias)
      DO UPDATE SET
        char_id = EXCLUDED.char_id,
        internal = EXCLUDED.internal,
        card_type = EXCLUDED.card_type
      RETURNING *
    `;

    return alias;
  }

  async deleteByCharId(charId: string): Promise<number> {
    const { sql } = this;

    const [result] = await sql<{ count: string }[]>`
      WITH deleted AS (
        DELETE FROM ${this.sql(this.tableName)}
        WHERE char_id = ${charId}
        RETURNING *
      ) SELECT COUNT(*) FROM deleted
    `;

    return parseInt(result?.count ?? '0', 10);
  }

  async listByCharId(charId: string): Promise<Alias[]> {
    const { sql, tableName } = this;

    return sql<Alias[]>`
      SELECT *
      FROM ${sql(tableName)}
      WHERE char_id = ${charId}
    `;
  }
}
