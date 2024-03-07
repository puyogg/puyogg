import type { Sql } from 'postgres';
import { CharacterModel } from './character.js';
import { CardModel } from './card.js';
import { AliasModel } from './alias.js';

export interface Models {
  characterModel: CharacterModel;
  cardModel: CardModel;
  aliasModel: AliasModel;
}

export const initModels = (sql: Sql): Models => {
  return {
    characterModel: new CharacterModel(sql),
    cardModel: new CardModel(sql),
    aliasModel: new AliasModel(sql),
  };
};
