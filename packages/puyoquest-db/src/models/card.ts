import { z } from 'zod';
import { Model } from '../types/model.js';
import { Sql } from 'postgres';

export const Card = z.object({
  cardId: z.string(),
  charId: z.string(),
  rarity: z.string(),
  rarityModifier: z.string().nullable(),
  name: z.string(),
  nameNormalized: z.string(),
  jpName: z.string().nullable(),
  jpNameNormalized: z.string().nullable(),
  linkName: z.string(),
  linkNameNormalized: z.string(),
  cardType: z.enum(['character', 'material']),
  mainColor: z.string(),
  sideColor: z.string().nullable(),
  updatedAt: z.date(),
});
export type Card = z.infer<typeof Card>;

export const CardCreate = Card.partial({
  rarityModifier: true,
  jpName: true,
  jpNameNormalized: true,
  sideColor: true,
  updatedAt: true,
});
export type CardCreate = z.infer<typeof CardCreate>;

export class CardModel extends Model<typeof Card, typeof CardCreate> {
  constructor(sql: Sql) {
    super(sql, 'card', Card, 'card_id');
  }
}
