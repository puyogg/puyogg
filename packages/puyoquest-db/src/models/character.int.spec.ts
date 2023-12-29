import { afterEach, describe, expect, test } from 'vitest';

describe('Character', () => {
  afterEach(async ({ sql, models }) => {
    await sql`DELETE FROM ${sql(models.characterModel.tableName)}`;
  });

  test('automatically updates updated_at timestamp', async ({ models }) => {
    const { characterModel } = models;

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

    const updatedCharacter = await characterModel.updateOne(character.charId, {
      name: 'Sonic',
    });

    expect(updatedCharacter?.updatedAt).toBeDefined();
    expect(updatedCharacter?.updatedAt.valueOf()).toBeGreaterThan(character.updatedAt.valueOf());
  });
});
