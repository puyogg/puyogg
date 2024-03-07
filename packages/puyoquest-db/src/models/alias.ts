import { z } from 'zod';
import { Model } from '../types/model.js';
import { Sql } from 'postgres';

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
}
