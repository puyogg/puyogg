import { Card } from './card.js';
import { afterEach, describe, expect, test } from 'vitest';

describe('Card', () => {
  afterEach(async ({ sql, models }) => {
    await Promise.all([
      sql`DELETE FROM ${sql(models.characterModel.tableName)}`,
      sql`DELETE FROM ${sql(models.cardModel.tableName)}`,
    ]);
  });

  test('creates a valid card', async ({ models }) => {
    const { characterModel, cardModel } = models;

    const character = await characterModel.create({
      charId: '2012',
      name: 'Arle',
      jpName: 'アルル',
      linkName: 'https://puyonexus.com/wiki/PPQ:Arle',
      mainColor: 'Blue',
      sideColor: null,
      type1: 'Attack',
      type2: 'Single',
      voiceTrans: 'V2012',
    });

    const card = await cardModel.create({
      cardId: '201207',
      charId: character.charId,
      rarity: '7',
      name: 'Arle',
      nameNormalized: 'arle',
      jpName: 'アルル',
      jpNameNormalized: 'アルル'.normalize('NFKD'),
      linkName: 'https://puyonexus.com/wiki/PPQ:Arle/★7',
      linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Arle/★7'),
      cardType: 'character',
      mainColor: 'Blue',
    });

    expect(() => {
      Card.parse(card);
    }).not.toThrow();
  });

  test('automatically updates updated_at timestamp', async ({ models }) => {
    const { characterModel, cardModel } = models;

    const charId = await characterModel
      .create({
        charId: '2012',
        name: 'Arle',
        jpName: 'アルル',
        linkName: 'https://puyonexus.com/wiki/PPQ:Arle',
        mainColor: 'Blue',
        sideColor: null,
        type1: 'Attack',
        type2: 'Single',
        voiceTrans: 'V2012',
      })
      .then((c) => c.charId);

    const card = await cardModel.create({
      cardId: '201207',
      charId,
      rarity: '7',
      name: 'Arle',
      nameNormalized: 'arle',
      jpName: 'アルル',
      jpNameNormalized: 'アルル'.normalize('NFKD'),
      linkName: 'https://puyonexus.com/wiki/PPQ:Arle/★7',
      linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Arle/★7'),
      cardType: 'character',
      mainColor: 'Blue',
    });

    const updatedCard = await cardModel.updateOne(card.cardId, { name: 'Sonic' });

    expect(updatedCard).toEqual(
      expect.objectContaining({
        cardId: '201207',
        charId,
        rarity: '7',
        rarityModifier: null,
        name: 'Sonic',
        nameNormalized: 'arle',
        jpName: 'アルル',
        jpNameNormalized: 'アルル'.normalize('NFKD'),
        linkName: 'https://puyonexus.com/wiki/PPQ:Arle/★7',
        linkNameNormalized: encodeURI('https://puyonexus.com/wiki/PPQ:Arle/★7'),
        cardType: 'character',
        mainColor: 'Blue',
        sideColor: null,
      }),
    );

    expect(updatedCard?.updatedAt).toBeDefined();
    expect(updatedCard?.updatedAt.valueOf()).toBeGreaterThan(card.updatedAt.valueOf());
  });
});
