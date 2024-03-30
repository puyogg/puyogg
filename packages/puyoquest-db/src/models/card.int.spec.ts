import assert from 'node:assert';
import { CharacterCreate } from './character.js';
import { Card, CardCreate, CardModel } from './card.js';
import { afterAll, afterEach, beforeEach, describe, expect, test } from 'vitest';
import { CharacterModel } from './character.js';

describe('Card', () => {
  let characterModel: CharacterModel;
  let cardModel: CardModel;

  const CHARACTER_SEED = {
    ARLE: {
      charId: '2012',
      name: 'Arle',
      jpName: 'アルル',
      linkName: 'https://puyonexus.com/wiki/PPQ:Arle',
      mainColor: 'Blue',
      sideColor: null,
      type1: 'Attack',
      type2: 'Single',
      voiceTrans: 'V2012',
    },
    SANTA_RINGO: {
      charId: '3212',
      name: 'Santa Ringo',
      jpName: 'サンタりんご',
      linkName: 'https://puyonexus.com/wiki/PPQ:Santa_Ringo',
      mainColor: 'Green',
      sideColor: 'Red',
      type1: 'Balance',
      type2: 'Single',
      voiceTrans: 'V1018',
    },
    CARBUNCLE: {
      charId: '4035',
      name: 'Carbuncle',
      jpName: 'カーバンクル',
      linkName: 'https://puyonexus.com/wiki/PPQ:Carbuncle',
      mainColor: 'Yellow',
      sideColor: null,
      type1: 'HP',
      type2: 'Single',
    },
  } as const satisfies Record<string, CharacterCreate>;

  const CARD_SEED = {
    ARLE_7: {
      cardId: '201207',
      charId: '2012',
      rarity: '7',
      name: 'Arle',
      nameNormalized: 'arle'.normalize('NFKD'),
      jpName: 'アルル',
      jpNameNormalized: 'アルル'.normalize('NFKD'),
      linkName: 'https://puyonexus.com/wiki/PPQ:Arle/★7',
      linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Arle/★7'),
      cardType: 'character',
      mainColor: 'Blue',
    },
    SANTA_RINGO_6: {
      cardId: '321206',
      charId: '3212',
      rarity: '6',
      rarityModifier: '6-1',
      name: 'Santa Ringo',
      nameNormalized: 'santa ringo'.normalize('NFKD'),
      jpName: 'サンタりんご',
      jpNameNormalized: 'サンタりんご'.normalize('NFKD'),
      linkName: 'https://puyonexus.com/wiki/PPQ:Santa_Ringo/★6',
      linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Santa_Ringo/★6'),
      cardType: 'character',
      mainColor: 'Green',
      sideColor: 'Red',
    },
    SNOWGLOBE_6: {
      cardId: '352906',
      charId: '3212',
      rarity: '6',
      rarityModifier: '6-1',
      name: 'Snowglobe (Green)',
      nameNormalized: 'Snowglobe (Green)'.toLowerCase().normalize('NFKD'),
      jpName: 'スノードーム（緑）',
      jpNameNormalized: 'スノードーム（緑）'.normalize('NFKD'),
      linkName: 'https://puyonexus.com/wiki/PPQ:Santa_Ringo/Materials/★6-1',
      linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Santa_Ringo/Materials/★6-1'),
      cardType: 'material',
      mainColor: 'Green',
      sideColor: 'Red',
    },
    SANTA_RINGO_6S: {
      cardId: '321216',
      charId: '3212',
      rarity: '6',
      rarityModifier: '6-2',
      name: 'Santa Ringo',
      nameNormalized: 'santa ringo'.normalize('NFKD'),
      jpName: 'サンタりんご',
      jpNameNormalized: 'サンタりんご'.normalize('NFKD'),
      linkName: 'https://puyonexus.com/wiki/PPQ:Santa_Ringo/★6-2',
      linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Santa_Ringo/★6-2'),
      cardType: 'character',
      mainColor: 'Green',
      sideColor: 'Red',
    },
    CARBUNCLE_6: {
      cardId: '403506',
      charId: '4035',
      rarity: '6',
      rarityModifier: null,
      name: 'Carbuncle',
      nameNormalized: 'carbuncle'.normalize('NFKD'),
      jpName: 'カーバンクル',
      jpNameNormalized: 'カーバンクル'.normalize('NFKD'),
      linkName: 'https://puyonexus.com/wiki/PPQ:Carbuncle/★6',
      linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Carbuncle/★6'),
      cardType: 'character',
      mainColor: 'Yellow',
    },
    CARBUNCLE_7: {
      cardId: '403507',
      charId: '4035',
      rarity: '7',
      rarityModifier: null,
      name: 'Carbuncle',
      nameNormalized: 'carbuncle'.normalize('NFKD'),
      jpName: 'カーバンクル',
      jpNameNormalized: 'カーバンクル'.normalize('NFKD'),
      linkName: 'https://puyonexus.com/wiki/PPQ:Carbuncle/★7',
      linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Carbuncle/★7'),
      cardType: 'character',
      mainColor: 'Yellow',
    },
  } as const satisfies Record<string, CardCreate>;

  beforeEach(async ({ sql, models }) => {
    characterModel = models.characterModel;
    cardModel = models.cardModel;

    await sql`DELETE FROM ${sql(models.characterModel.tableName)}`;
    await sql`DELETE FROM ${sql(models.cardModel.tableName)}`;

    await Promise.all(Object.values(CHARACTER_SEED).map((char) => characterModel.create(char)));
    await Promise.all(Object.values(CARD_SEED).map((card) => cardModel.create(card)));
  });

  test('created a valid card', async () => {
    const card = await cardModel.findOne('201207');

    expect(() => {
      Card.parse(card);
    }).not.toThrow();
  });

  test('automatically updates updated_at timestamp', async () => {
    const card = await cardModel.findOne('201207');
    const updatedCard = await cardModel.updateOne(card!.cardId, { name: 'Sonic' });

    expect(updatedCard).toEqual(
      expect.objectContaining({
        ...CARD_SEED.ARLE_7,
        name: 'Sonic',
      }),
    );

    expect(updatedCard?.updatedAt).toBeDefined();
    expect(updatedCard?.updatedAt.valueOf()).toBeGreaterThan(card!.updatedAt.valueOf());
  });

  test('getByCharIdAndRarity - normal characters', async () => {
    const card = await cardModel.getByCharIdAndRarity({
      charId: '2012',
      rarity: '7',
    });

    expect(card).toBeDefined();
    expect(card).toEqual(expect.objectContaining(CARD_SEED.ARLE_7));
  });

  test('getByCharIdAndRarity - with rarity modifier', async () => {
    const card = await cardModel.getByCharIdAndRarity({
      charId: '3212',
      rarity: '6',
      rarityModifier: '6-2',
    });

    expect(card).toBeDefined();
    expect(card).toEqual(expect.objectContaining(CARD_SEED.SANTA_RINGO_6S));
  });

  test('upsert', async () => {
    const santaRingoUpsert: CardCreate = structuredClone(CARD_SEED.SANTA_RINGO_6S);
    Object.entries(santaRingoUpsert).forEach(([key, value]) => {
      if (key === 'charId') return;
      if (typeof value === 'string') {
        Reflect.set(santaRingoUpsert, key, value + '-UPDATED');
      }
    });

    const upsertedCard = await cardModel.upsert(santaRingoUpsert);
    expect(upsertedCard).toEqual(expect.objectContaining(santaRingoUpsert));
  });

  test('listByCharId - character only', async () => {
    const cards = await cardModel.listByCharId({ charId: '3212' });

    expect(cards).toHaveLength(2);
    expect(cards).toContainEqual(expect.objectContaining(CARD_SEED.SANTA_RINGO_6));
    expect(cards).toContainEqual(expect.objectContaining(CARD_SEED.SANTA_RINGO_6S));
  });

  test('listByCharId - include materials', async () => {
    const cards = await cardModel.listByCharId({ charId: '3212', includeMaterials: true });

    expect(cards).toHaveLength(3);
    expect(cards).toContainEqual(expect.objectContaining(CARD_SEED.SANTA_RINGO_6));
    expect(cards).toContainEqual(expect.objectContaining(CARD_SEED.SANTA_RINGO_6S));
  });

  test('listByIds', async () => {
    const cards = await cardModel.listByIds([
      CARD_SEED.SNOWGLOBE_6.cardId,
      CARD_SEED.SANTA_RINGO_6S.cardId,
      CARD_SEED.ARLE_7.cardId,
    ]);

    expect(cards).toHaveLength(3);
    expect(cards).toContainEqual(expect.objectContaining(CARD_SEED.SNOWGLOBE_6));
    expect(cards).toContainEqual(expect.objectContaining(CARD_SEED.SANTA_RINGO_6S));
    expect(cards).toContainEqual(expect.objectContaining(CARD_SEED.ARLE_7));
  });

  describe('listAllCardIds', () => {
    test('include and exclude charIds', async () => {
      const result = await cardModel.listAllCardIds({
        includeCharIds: [
          CHARACTER_SEED.ARLE.charId,
          CHARACTER_SEED.SANTA_RINGO.charId,
          CHARACTER_SEED.CARBUNCLE.charId,
        ],
        excludeCharIds: [CHARACTER_SEED.CARBUNCLE.charId],
      });

      assert(result.success);
      const cardIds = result.data;

      const expectedCardIds = [
        CARD_SEED.ARLE_7.cardId,
        CARD_SEED.SANTA_RINGO_6.cardId,
        CARD_SEED.SANTA_RINGO_6S.cardId,
        CARD_SEED.SNOWGLOBE_6.cardId,
      ];

      expect(cardIds).toHaveLength(expectedCardIds.length);
      expectedCardIds.forEach((expectedCardId) => {
        expect(cardIds).toContain(expectedCardId);
      });
    });

    test('include charIds', async () => {
      const result = await cardModel.listAllCardIds({
        includeCharIds: [CHARACTER_SEED.SANTA_RINGO.charId],
      });

      assert(result.success);
      const cardIds = result.data;

      const expectedCardIds = [
        CARD_SEED.SANTA_RINGO_6.cardId,
        CARD_SEED.SANTA_RINGO_6S.cardId,
        CARD_SEED.SNOWGLOBE_6.cardId,
      ];

      expect(cardIds).toHaveLength(expectedCardIds.length);
      expectedCardIds.forEach((expectedCardId) => {
        expect(cardIds).toContain(expectedCardId);
      });
    });

    test('exclude charIds', async () => {
      const result = await cardModel.listAllCardIds({
        excludeCharIds: [CHARACTER_SEED.SANTA_RINGO.charId],
      });

      assert(result.success);
      const cardIds = result.data;

      const expectedCardIds = [
        CARD_SEED.ARLE_7.cardId,
        CARD_SEED.CARBUNCLE_6.cardId,
        CARD_SEED.CARBUNCLE_7.cardId,
      ];

      expect(cardIds).toHaveLength(expectedCardIds.length);
      expectedCardIds.forEach((expectedCardId) => {
        expect(cardIds).toContain(expectedCardId);
      });
    });

    test('return error for empty include/exclude', async () => {
      const result = await cardModel.listAllCardIds({ includeCharIds: [] });

      assert(result.success === false);
      expect(result.error.message).toEqual('No values passed to includeCharIds or excludeCharIds');
    });
  });

  test('listRarestCards', async () => {
    const cards = await cardModel.listRarestCards([
      CHARACTER_SEED.SANTA_RINGO.charId,
      CHARACTER_SEED.CARBUNCLE.charId,
    ]);

    const expectedCards = [CARD_SEED.SANTA_RINGO_6S, CARD_SEED.CARBUNCLE_7].map((partialCard) =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      expect.objectContaining(partialCard),
    );

    expect(expectedCards).toHaveLength(cards.length);
    expect(cards).toEqual(expect.arrayContaining(expectedCards));
  });
});
