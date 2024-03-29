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

  async getByCharIdAndRarity(params: {
    charId: Card['charId'];
    rarity: Card['rarity'];
    rarityModifier?: Card['rarityModifier'];
    cardType?: Card['cardType'];
  }): Promise<Card | undefined> {
    const { charId, rarity, rarityModifier = null, cardType = 'character' } = params;

    if (rarityModifier) {
      const cards = await this.sql<Card[]>`
        SELECT *
        FROM ${this.sql(this.tableName)}
        WHERE
          char_id = ${charId} AND
          rarity = ${rarity} AND
          rarity_modifier = ${rarityModifier} AND
          card_type = ${cardType}
      `;

      return cards.at(0);
    }

    const cards = await this.sql<Card[]>`
      SELECT *
      FROM ${this.sql(this.tableName)}
      WHERE
        char_id = ${charId} AND
        rarity = ${rarity} AND
        (rarity_modifier != '6-2' OR rarity_modifier IS NULL) AND
        card_type = ${cardType}
    `;

    return cards.at(0);
  }

  async upsert(params: CardCreate): Promise<Card> {
    const [card] = await this.sql<Card[]>`
      INSERT INTO ${this.sql(this.tableName)}
      ${this.sql(params)}
      ON CONFLICT (card_id)
      DO UPDATE SET
        char_id = EXCLUDED.char_id,
        rarity = EXCLUDED.rarity,
        rarity_modifier = EXCLUDED.rarity_modifier,
        name = EXCLUDED.name,
        name_normalized = EXCLUDED.name_normalized,
        jp_name = EXCLUDED.jp_name,
        jp_name_normalized = EXCLUDED.jp_name_normalized,
        link_name = EXCLUDED.link_name,
        link_name_normalized = EXCLUDED.link_name_normalized,
        card_type = EXCLUDED.card_type,
        main_color = EXCLUDED.main_color,
        side_color = EXCLUDED.side_color
      RETURNING *
    `;

    return card;
  }

  async listByCharId(params: {
    charId: Card['charId'];
    includeMaterials?: boolean;
  }): Promise<Card[]> {
    const { charId, includeMaterials } = params;

    const cards = await this.sql<Card[]>`
      SELECT *
      FROM ${this.sql(this.tableName)}
      ${
        includeMaterials
          ? this.sql`WHERE char_id = ${charId}`
          : this.sql`WHERE char_id = ${charId} AND card_type = 'character'`
      }
    `;

    return cards;
  }

  async listByIds(cardIds: string[]): Promise<Card[]> {
    return this.sql<Card[]>`
      SELECT *
      FROM ${this.sql(this.tableName)}
      WHERE card_id IN ${this.sql(cardIds)}
    `;
  }

  async listAllCardIds(
    params:
      | {
          includeCharIds: string[];
          excludeCharIds: string[];
        }
      | {
          includeCharIds: string[];
        }
      | {
          excludeCharIds: string[];
        },
  ): Promise<Result<string[]>> {
    const { includeCharIds = [], excludeCharIds = [] } = params as Record<string, string[]>;

    let where: PendingQuery<(object | undefined)[]>;

    if (includeCharIds.length && excludeCharIds.length) {
      where = this.sql`WHERE char_id IN ${this.sql(includeCharIds)} AND NOT char_id IN ${this.sql(
        excludeCharIds,
      )}`;
    } else if (includeCharIds.length) {
      where = this.sql`WHERE char_id IN ${this.sql(includeCharIds)}`;
    } else if (excludeCharIds.length) {
      where = this.sql`WHERE NOT char_id IN ${this.sql(excludeCharIds)}`;
    } else {
      return {
        success: false,
        error: new Error('No values passed to includeCharIds or excludeCharIds'),
      };
    }

    const cardIdObjs = await this.sql<Pick<Card, 'cardId'>[]>`
      SELECT card_id
      FROM ${this.sql(this.tableName)}
      ${where}
    `;
    const cardIds = cardIdObjs.map((c) => c.cardId);

    return { success: true, data: cardIds };
  }
}
