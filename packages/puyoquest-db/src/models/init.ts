import type { Sql } from 'postgres';
import { CharacterModel } from './character.js';
import { CardModel } from './card.js';

export interface Models {
  characterModel: CharacterModel;
  cardModel: CardModel;
}

export const initModels = (sql: Sql): Models => {
  return {
    characterModel: new CharacterModel(sql),
    cardModel: new CardModel(sql),
  };
};
