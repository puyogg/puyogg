import { Alias, AliasModel } from './alias.js';
import { beforeEach, describe, expect, test } from 'vitest';
import { CharacterCreate, CharacterModel } from './character.js';
import { Sql } from 'postgres';

const ARLE: CharacterCreate = {
  charId: '2012',
  name: 'Arle',
  jpName: 'アルル',
  linkName: 'https://puyonexus.com/wiki/PPQ:Arle',
  mainColor: 'Blue',
  sideColor: null,
  type1: 'Attack',
  type2: 'Single',
  voiceTrans: 'V2012',
};

describe('Alias', () => {
  let aliasModel: AliasModel;
  let characterModel: CharacterModel;

  const getAliasTableCount = async (sql: Sql): Promise<number> => {
    const [aliasCountResult] = await sql<{ count: string }[]>`SELECT COUNT(*) FROM ${sql(
      aliasModel.tableName,
    )}`;
    const { count } = aliasCountResult;
    return Number(count);
  };

  beforeEach(async ({ sql, models }) => {
    aliasModel = models.aliasModel;
    characterModel = models.characterModel;

    await sql`DELETE FROM ${sql(aliasModel.tableName)}`;
    await sql`DELETE FROM ${sql(characterModel.tableName)}`;
  });

  test('creates a valid alias', async ({ models }) => {
    const { characterModel, aliasModel } = models;

    const charId = await characterModel.create(ARLE).then((a) => a.charId);

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

  test('automatically updates updated_at timestamp', async ({ models }) => {
    const { characterModel, aliasModel } = models;

    const charId = await characterModel.create(ARLE).then((a) => a.charId);

    const alias = await aliasModel.create({
      alias: 'Sonic',
      charId,
      internal: false,
      cardType: 'character',
    });

    const updatedAlias = await aliasModel.updateOne(alias.alias, {
      internal: true,
    });

    expect(updatedAlias?.updatedAt).toBeDefined();
    expect(updatedAlias?.updatedAt.valueOf()).toBeGreaterThan(alias.updatedAt.valueOf());
  });

  test('upsert', async ({ sql }) => {
    const charId = await characterModel.create(ARLE).then((a) => a.charId);

    const alias = await aliasModel.upsert({
      alias: 'Sonic',
      charId,
      internal: false,
      cardType: 'character',
    });

    const upsertedAlias = await aliasModel.upsert({
      alias: 'Sonic',
      charId,
      internal: true,
      cardType: 'character',
    });

    const [aliasCountResult] = await sql<{ count: string }[]>`SELECT COUNT(*) FROM ${sql(
      aliasModel.tableName,
    )}`;
    const { count } = aliasCountResult;

    expect(count).toEqual('1');
    expect(upsertedAlias).toEqual(
      expect.objectContaining({
        alias: 'Sonic',
        charId,
        internal: true,
        cardType: 'character',
      }),
    );
    expect(upsertedAlias.updatedAt.valueOf()).toBeGreaterThan(alias.updatedAt.valueOf());
  });

  test('delete', async ({ sql }) => {
    const charId = await characterModel.create(ARLE).then((a) => a.charId);

    const alias = await aliasModel.upsert({
      alias: 'Sonic',
      charId,
      internal: false,
      cardType: 'character',
    });

    const count = await getAliasTableCount(sql);
    expect(count).toEqual(1);

    const deletedCount = await aliasModel.deleteOne(alias.alias);
    expect(deletedCount).toEqual(1);

    const countAfterDeleted = await getAliasTableCount(sql);
    expect(countAfterDeleted).toEqual(0);
  });

  test('deleteByCharId', async ({ sql }) => {
    const charId = await characterModel.create(ARLE).then((a) => a.charId);

    await aliasModel.upsert({
      alias: 'Sonic',
      charId,
      internal: false,
      cardType: 'character',
    });
    await aliasModel.upsert({
      alias: 'Knuckles',
      charId,
      internal: false,
      cardType: 'character',
    });
    await aliasModel.upsert({
      alias: 'Tails',
      charId,
      internal: false,
      cardType: 'character',
    });

    const deletedCount = await aliasModel.deleteByCharId(charId);
    expect(deletedCount).toEqual(3);

    const count = await getAliasTableCount(sql);
    expect(count).toEqual(0);
  });

  test('listByCharId', async () => {
    const charId = await characterModel.create(ARLE).then((a) => a.charId);

    await aliasModel.upsert({
      alias: 'Sonic',
      charId,
      internal: false,
      cardType: 'character',
    });
    await aliasModel.upsert({
      alias: 'Knuckles',
      charId,
      internal: false,
      cardType: 'character',
    });
    await aliasModel.upsert({
      alias: 'Tails',
      charId,
      internal: false,
      cardType: 'character',
    });

    const aliases = await aliasModel.listByCharId(charId);
    const aliasValues = aliases.map((a) => a.alias);

    expect(aliasValues).toEqual(expect.arrayContaining(['Tails', 'Knuckles', 'Sonic']));
  });
});
