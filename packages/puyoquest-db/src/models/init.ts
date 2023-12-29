import type { Sql } from 'postgres';
import { CharacterModel } from './character.js';

export interface Models {
  characterModel: CharacterModel;
}

export const initModels = (sql: Sql): Models => {
  return {
    characterModel: new CharacterModel(sql),
  };
};
