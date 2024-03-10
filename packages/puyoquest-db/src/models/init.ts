import type { Sql } from 'postgres';
import { CharacterModel } from './character.js';
import { CardModel } from './card.js';
import { AliasModel } from './alias.js';
import { CronLastUpdatedModel } from './cron-last-updated.js';

export interface Models {
  characterModel: CharacterModel;
  cardModel: CardModel;
  aliasModel: AliasModel;
  cronLastUpdatedModel: CronLastUpdatedModel;
}

export const initModels = (sql: Sql): Models => {
  return {
    characterModel: new CharacterModel(sql),
    cardModel: new CardModel(sql),
    aliasModel: new AliasModel(sql),
    cronLastUpdatedModel: new CronLastUpdatedModel(sql),
  };
};
