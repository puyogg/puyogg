import { Alias } from './alias.js';
import { afterEach, describe, expect, test } from 'vitest';

describe('Alias', () => {
  afterEach(async ({ sql, models }) => {
    await sql`DELETE FROM ${sql(models.aliasModel.tableName)}`;
  });

  test('creates a valid alias', async ({ models }) => {
    const { characterModel, aliasModel } = models;

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
      .then((a) => a.charId);

    const alias = await aliasModel.create({
      alias: 'Sonic',
      charId,
      internal: false,
      cardType: 'character',
    });

    expect(() => {
      Alias.parse(alias);
    }).not.toThrow();
  });
});
